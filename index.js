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
  context.clear = clear;
  context.help = help;

  var js = message.replace(/^js /, '');


  // Run it
  try {
    say(vm.runInNewContext(js, context, {timeout: 1000}));
  }
  catch (e) {
    var error_message = e.message || e;
    say(error_message.split('\n').pop());
  }

  evaluate_javascript.context = context;
}

// Prints how to use the bot
function help() {
  say('Hello!  Say `js <JavaScript>` to evaluate JavaScript.');
  say('For more info, see my readme here: https://github.com/ryan-endacott/js-irc-bot');
}

// Clears the message queue
function clear() {
  messageQueue = [];
}

// Say something to the channel
function say(message) {

  // Handle null, undefined, etc
  if (!message)
    message = typeof(message);

  if (typeof(message) === 'object')
    message = util.inspect(message);

  message = message.toString();

  // Handle saying lines that are too long.
  if (message.length > 200) {
    message.match(/.{1,200}/g).forEach(function(line) {
      messageQueue.push(line);
    });
  }
  else {
    messageQueue.push(message);
  }
}

var messageQueue = [];

// To prevent flooding, keep a queue of things to say
setInterval(function() {
  client.say('#mizzouacm', messageQueue.shift());
}, 600);


