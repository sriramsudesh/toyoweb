let genericRequestRawPromise = require('../util/api').genericRequestRawPromise
let xml2js = require('xml2js')

module.exports = function (ZillowServices) {
  ZillowServices.disableRemoteMethod('invoke', true)

  // Define the getSentiment method
  ZillowServices.getPropertyDetails = async function (citystatezip, address, res, cb) {
    let deepSearchResults = {}
    let processedResults = []
    let messageFromServer = {}
    try {
      // Get a response from conversation
      let deepSearchResultsRaw = await genericRequestRawPromise({
        url: process.env.ZILLOW_DEEPSEARCH_URL,
        method: 'GET',
        qs: {
          'zws-id': process.env.ZILLOW_ZWS_ID,
          address: address,
          citystatezip: citystatezip
        }
      })
      // Results are provided in XML, must parse
      xml2js.parseString(deepSearchResultsRaw, (error, result) => {
        if (error) {
          console.log('error occurred')
          console.log(error)
        } else {
          try {
            // Try to get results from the parsed XML structure
            messageFromServer = result['SearchResults:searchresults']['message'][0]
            deepSearchResults = result['SearchResults:searchresults']['response'][0]['results'][0]['result']
          } catch (e) {
            deepSearchResults = {error: 'NORESULTS'}
          }
        }
      })
    } catch (e) {
      console.log(e)
      throw (e)
    }
    // Code 0 indicates success.
    if (messageFromServer.code[0] !== '0') {
      processedResults = messageFromServer.text[0]
      res.status(500)
    } else {
      try {
        // Filter the results into a more readable form for this application
        for (let result of deepSearchResults) {
          let propertyDetails = {}
          let street = ''
          let city = ''
          let state = ''
          let zip = ''

          // Safely pull data from zillow's results. All data is returned as arrays.
          try {
            propertyDetails.homeDetailsLink = result.links[0].homedetails[0]
          } catch (e) {
            propertyDetails.homeDetailsLink = 'http://zillow.com'
          }

          try {
            street = result.address[0].street[0]
          } catch (e) {
            street = 'Unknown Street Address'
          }

          try {
            zip = result.address[0].zipcode[0]
          } catch (e) {
            zip = '00000'
          }

          try {
            city = result.address[0].city[0]
          } catch (e) {
            city = 'Unknown City'
          }

          try {
            state = result.address[0].state[0]
          } catch (e) {
            state = 'Unknown State'
          }

          propertyDetails.address = street + ', ' + city + ', ' + state + ' ' + zip

          try {
            propertyDetails.yearBuilt = result.yearBuilt[0]
          } catch (e) {
            propertyDetails.yearBuilt = ''
          }

          try {
            propertyDetails.finishedSqFt = result.finishedSqFt[0]
          } catch (e) {
            propertyDetails.finishedSqFt = ''
          }

          try {
            propertyDetails.bathrooms = result.bathrooms[0]
          } catch (e) {
            propertyDetails.bathrooms = ''
          }

          try {
            propertyDetails.bedrooms = result.bedrooms[0]
          } catch (e) {
            propertyDetails.bedrooms = ''
          }

          try {
            propertyDetails.lastSoldDate = result.lastSoldDate[0]
          } catch (e) {
            propertyDetails.lastSoldDate = ''
          }

          try {
            propertyDetails.estimate = result.zestimate[0].amount[0]._
          } catch (e) {
            propertyDetails.estimate = ''
          }
          processedResults.push(propertyDetails)
        }
      } catch (e) {
        console.log(e)
        processedResults = {}
      }
    }

    return [processedResults]
  }

  // Register the Remote Method
  ZillowServices.remoteMethod(
    'getPropertyDetails', {
      description: 'Returns property details for an address query',
      http: {
        path: '/getPropertyDetails',
        verb: 'get'
      },
      accepts: [
        {
          arg: 'citystatezip',
          type: 'string',
          http: {source: 'query'},
          description: 'City, State, or Zip',
          required: true
        },
        {
          arg: 'address',
          type: 'string',
          http: {source: 'query'},
          description: 'Address to deep search',
          required: true
        },
        {
          arg: 'res',
          type: 'object',
          http: {source: 'res'},
          description: 'HTTP response'
        }
      ],
      returns: [
        {
          arg: 'propertyDetailsResults',
          type: '[zillow-property-details]',
          root: true,
          description: 'The property details results from Zillow'
        }
      ]
    }
  )
}
