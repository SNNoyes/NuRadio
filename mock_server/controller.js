const path = require('path');
const fs = require('node:fs');

function sendHello(request, response) {
  response.status = 200;
  response.send("Hello!");
};

function listFiles(request, response) {
  fs.readdir('./mocks', function (error, files) {
    if (error) {
      console.log(error);
      response.status = 404;
      response.end();
    } else {
      console.log(files);
      response.status = 200;
      response.send(JSON.stringify(files));
    }
  });
};

function serveFile(request, response) {
  let fileName = request.params;
  response.status = 200;
  response.sendFile('./mocks/' + fileName.file, {
    root: __dirname
  },
    function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log('Sent:', fileName);
      }
    });
};

module.exports = { sendHello, listFiles, serveFile };