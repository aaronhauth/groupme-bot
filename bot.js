var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      d20 = /^\/d20$/,
      d4 = /^\/d4$/,
      d6 = /^\/d6$/,
      d8 = /^\/d8$/,
      d10 = /^\/d10$/,
      d12 = /^\/d12$/;

  if(request.text) {
    this.res.writeHead(200);
    if (d20.test(request.text)){
      rollDie(request, 20)
    }
    else if (d4.test(request.text)){
      rollDie(request, 4)
    }
    else if (d6.test(request.text)){
      rollDie(request, 6)
    }
    else if (d8.test(request.text)){
      rollDie(request, 8)
    }
    else if (d10.test(request.text)){
      rollDie(request, 10)
    }
    else if (d12.test(request.text)){
      rollDie(request, 12)
    }
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function rollDie(request, size){
  var firstName = request.name.split(' ')[0];
  var roll = Math.floor(Math.random() * Math.floor(size) + 1);

  var botResponse = firstName + " rolled a d" + size + " and got a " + roll;
  if (roll == 1 && size == 20)
    botResponse += ". A CRITICAL FAIL!"

  if (roll == 20 && size == 20)
    botResponse += ". A CRITICAL SUCCESS!"

  postMessage(botResponse)
}

function postMessage(message) {
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : message
  };

  console.log('sending ' + message + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;