var irc = require('irc'),
    vm = require('vm');

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
    say(vm.runInNewContext(js, context));
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

  client.say('#mizzouacm', message.toString());
}


