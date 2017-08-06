import request from 'request'
import path from 'path'
import fs from 'fs'

export const download = function (url, id, callback) {
  request({
    url: url + '/favicon.ico',
    encoding: null,
    followRedirect: true,
    timeout: 5000,
    maxRedirect: 5
  }, function (err, res, body) {
    if (err) {
      callback(err)
    } else if (res.statusCode === 200) {
      fs.writeFile(
        path.join(__dirname, '../../../dist/images/favicons/') + id + '.ico', body, function (err) {
          if (err) {
            callback(err)
          }
          callback(null, 'success')
        })
    }
  })
}
