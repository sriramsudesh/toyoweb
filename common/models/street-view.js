module.exports = function (StreetView) {
  StreetView.disableRemoteMethod('invoke', true)
  StreetView.getStreetView = async function (res, address, cb) {
    res.redirect('https://maps.googleapis.com/maps/api/streetview?location=' + address + '&key=' + process.env.GOOGLE_STREETVIEW_KEY + '&size=300x200')
  }
  // Register the Remote Method
  StreetView.remoteMethod(
    'getStreetView', {
      description: 'Return an image of the property by Address',
      http: {
        path: '/getStreetView',
        verb: 'get'
      },
      accepts: [
        {
          arg: 'res',
          type: 'object',
          http: {source: 'res'},
          description: 'Express Response'
        },
        {
          arg: 'address',
          type: 'string',
          http: {source: 'query'},
          description: 'Property Address'
        }
      ],
      returns: [
        {arg: 'body', type: 'file', root: true}
      ]
    }
  )
}
