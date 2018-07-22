let clients = [];

exports.subscribe = (req, res) => {
  console.log('subscribe');
  clients.push(res);

  res.on('close', () => {
    clients.splice(clients.indexOf(res), 1);
  });
}

exports.publish = (message) => {
  console.log('publish', message);

  clients.forEach((res) => {
    res.end(message);
  });

  clients = [];
}