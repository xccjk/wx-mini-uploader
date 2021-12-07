#!/usr/bin/env node
const https = require('https');

module.exports = function(token) {
  return {
    send: function(message, callback) {
      const postData = JSON.stringify(message);
      const options = {
        hostname: 'api.dingtalk.com',
        port: 443,
        path: '/robot/send?access_token=' + token,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const request = https.request(options, function(response) {
        const data = [];
        let count = 0;
        response.setEncoding('utf8');

        response.on('data', function(chunk) {
          data.push(chunk);
          count += chunk.length;
        });

        response.on('end', function() {
          let buffer;
          const length = data.length;

          if (length == 0) {
            buffer = new Buffer(0);
          } else if (length == 1) {
            buffer = data[0];
          } else {
            buffer = new Buffer(count);
            for (let index = 0, position = 0; index < length; index++) {
              let chunk = data[index];
              chunk.copy(buffer, position);
              position += chunk.length;
            }
          }

          const datastring = buffer.toString();
          const result = JSON.parse(datastring);
          if (result.errcode) {
            return callback(new Error(result.errmsg));
          }

          return callback(null, result);
        });
      });
      request.on('error', callback);

      request.write(postData);
      request.end();
    }
  };
};
