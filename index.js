var irc = require('irc'),
    vm = require('vm'),
    util = require('util');

console.log('Starting IRC bot...')

var client = new irc.Client(
    'chat.freenode.net',
    'MasterBot',
    {
      channels: ['#MizzouACM'],
    }
);

client.addListener('message', function (from, to, message) {
  console.log('message: ' + from  + ': ', message);

  evaluate_javascript(message);
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


// Safely (hopefully?) evaluate javascript in a message
// if the message starts with `js `
function evaluate_javascript(message) {
  if (!/^js /.test(message)) return;

  var context = evaluate_javascript.context || {};
  context.say = say;

  var js = message.replace(/^js /, '');


  // Run it

  try {
    say(vm.runInNewContext(js, context, {timeout: '1000'}));
  }
  catch (e) {
    say(e);
  }

  evaluate_javascript.context = context;
}

function say(message) {

  // Handle null, undefined, etc
  if (!message)
    message = typeof(message);

  if (typeof(message) === 'object')
    message = util.inspect(message);

  messageQueue.push(message.toString());
}

var messageQueue = [];

// To prevent flooding, keep a queue of things to say
setInterval(function() {
  client.say('#mizzouacm', messageQueue.shift());
}, 600);


