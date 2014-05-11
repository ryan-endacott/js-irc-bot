var irc = require('irc');

console.log('Starting IRC bot...')

var client = new irc.Client(
    'chat.freenode.net',
    'BetterBot1',
    {
      channels: ['#MizzouACM'],
    }
);

client.addListener('message', function (from, to, message) {
  console.log('message: ' + from  + ': ', message);
});

client.addListener('pm', function (from,  message) {
  console.log('pm: ' + from + ': ', message);
})

client.addListener('error', function(message) {
  console.log('error: ', message);
});


// On connection to the server
client.addListener('join', function(message) {
  client.say('#mizzouacm', 'Hello, world!');
})


