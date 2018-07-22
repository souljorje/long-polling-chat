const fs = require('fs');
const http = require('http');
const chat = require('./chat');

http.createServer((req, res) => {
  switch(req.url) {
    case '/':
    case '': 
      sendFile('index.html', res);
      break;
    case '/subscribe':
      chat.subscribe(req, res);
      break;
    case '/publish':
      let body = '';
      req
        .on('readable', () => {
          const message = req.read();
          if (message) {
            body += message;
          }
          if (body.length > 1e4) {
            res.statusCode = 413;
            res.end('Your message is too long');
          }
        })
        .on('end', () => {
          chat.publish(body);
          res.end('sent');
        })
      break;
    default:
      res.statusCode = 404;
      res.end('Not found');
  }
}).listen(3000);

const sendFile = (fileName, res) => {
  const fileStream = fs.createReadStream(fileName);
  fileStream
    .on('error', () => {
      res.statusCode(500);
      res.end('Server error');
    })
    .pipe(res);
}