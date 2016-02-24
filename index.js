module.exports = publish

var https = require('http')

function publish(publisher, password, project, edition, form, callback) {
  https.request(
    { auth: ( publisher + ':' + password ),
      method: 'POST',
      host: 'projects.commonform.org',
      path:
        ( '/publishers/' + publisher +
          '/projects/' + project +
          '/editions/' + edition ) },
    function(response) {
      if (response.statusCode === 201) {
        callback(null, response.headers.location) }
      else {
        var error = new Error()
        error.statusCode = status
        callback(error) } })
  .end() }
