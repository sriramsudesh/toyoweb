let genericRequestPromise = require('../util/api').genericRequestPromise
let getBaseUrl = require('../util/util').getBaseUrl

module.exports = function (Conversation) {
  Conversation.disableRemoteMethod('invoke', true)
  Conversation.orchestratedMessage = async function (req, body, token, cb) {
    // let baseUrl = getBaseUrl(req)
    let enrichment = {}
    let message = {}
    let retText = ''
    let enrichmentName = ''
    try {
      let context = body.context
      let input = body.input

      /** Get a response from conversation */
      message = await genericRequestPromise({
        url: process.env.CONVERSATION_API_URL,
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          input: {
            text: input.text
          },
          context: context
        })
      })

      retText = message.output.text.join('\n')

      // If the conversation calls for Property Suggestion, we'll make that call
      if (message && message.output && message.input && message.input.text && (message.output.apiCall === global.CONSTANTS.API_PROP_SUGGEST)) {
        // Get a suggestion for a property
        enrichmentName = 'PROPSUGGEST'
        try {
          enrichment = await genericRequestPromise({
            url: getBaseUrl(req) + '/api/zillow/getPropertyDetails',
            method: 'GET',
            qs: {
              citystatezip: message.context.citystatezip || '00000',
              address: message.context.address || '',
              access_token: token
            }
          })
        } catch (e) {
          console.log(e)
          enrichment = false
        }
      }
    } catch (e) {
      console.log(e)
      throw (e)
    }

    return [message, enrichment, retText, enrichmentName]
  }
  // Register the Remote Method
  Conversation.remoteMethod(
    'orchestratedMessage', {
      description: 'Pass the results of the Watson Conversation through additional APIs',
      http: {
        path: '/orchestratedMessage',
        verb: 'post'
      },
      accepts: [
        {
          arg: 'req',
          type: 'object',
          http: {source: 'req'},
          description: 'Express Request'
        },
        {
          arg: 'body',
          type: 'Conversation',
          http: {source: 'body'},
          description: 'Input to supply to Watson Conversation',
          required: true
        },
        {
          arg: 'access_token',
          type: 'string',
          http: {source: 'query'},
          description: 'Loopback Access Token',
          required: false
        }
      ],
      returns: [
        {
          arg: 'message',
          type: 'object',
          description: 'The original message returned from Watson Conversation'
        },
        {
          arg: 'enrichment',
          type: 'object',
          description: 'The raw response from the extra enrichment, if any'

        },
        {
          arg: 'text',
          type: 'string',
          description: 'The text to return to the user, after all enrichments have been applied'
        },
        {
          arg: 'enrichmentName',
          type: 'string',
          description: 'The name of the enrichment performed, if any'
        }
      ]
    }
  )
}
