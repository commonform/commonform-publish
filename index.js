/* Copyright 2016 Kyle E. Mitchell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = publish

var https = require('https')

function publish (
  publisher,
  password,
  project,
  edition,
  digest,
  callback
) {
  https.request({
    auth: publisher + ':' + password,
    method: 'POST',
    host: 'api.commonform.org',
    path: (
      '/publishers/' + encodeURIComponent(publisher) +
      '/projects/' + encodeURIComponent(project) +
      '/publications/' + encodeURIComponent(edition)
    ),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .once('response', function (response) {
      var status = response.statusCode
      if (status === 201 || status === 204) {
        done(null, response.headers.location)
      } else {
        var buffers = []
        response
          .on('data', function (buffer) {
            buffers.push(buffer)
          })
          .once('error', function (error) {
            done(error)
          })
          .once('end', function () {
            var message = Buffer.concat(buffers).toString()
            var error = new Error(message)
            error.statusCode = response.statusCode
            done(error)
          })
      }
    })
    .once('error', function (error) {
      done(error)
    })
    .once('aborted', function () {
      done(new Error('aborted'))
    })
    .end(JSON.stringify({digest: digest}))

  var calledBack = false

  function done (error, result) {
    if (!calledBack) {
      calledBack = true
      callback(error, result)
    }
  }
}
