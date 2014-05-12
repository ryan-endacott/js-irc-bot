var irc = require('irc'),
    vm = require('vm'),
    util = require('util'),
    Threads = require('threads_a_gogo');

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

  // Create a thread for evaluation
  var t = Threads.create();

  var full_js = " \
  try { \
    thread.emit('result', (require('vm').runInNewContext(js, context))); \
  } \
  catch (e) { \
    thread.emit('result', e); \
  } ";

  t.eval(full_js);

  // Destroy if it isn't done in five seconds
  var timeout = setTimeout(function() {
    t.destroy()
  }, 5000);

  // Clear the interval if it's done
  // and say result
  t.on('result', function(result) {
    clearInterval(timeout);
    say(result);
  });

  evaluate_javascript.context = context;
}

function say(message) {

  // Handle null, undefined, etc
  if (!message)
    message = typeof(message);

  if (typeof(message) === 'object')
    message = util.inspect(message);

  client.say('#mizzouacm', message.toString());
}


