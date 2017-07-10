'use strict';

const exec = require('child_process').exec;
const skygear = require('skygear');

const apiKey = process.argv[2] || '';

const channel = '&chima-open-door';

var heartbeatTimer = null;
var heartbeatCounter = 0;
const heartbeatChannel = '&chima-open-door-heartbeat';
const heartbeatInterval = 1000 * 60;
function onConnectionOpen() {
  console.log("daemon-trigger-skygear: connection open");

  if (heartbeatTimer == null) {
    heartbeatTimer = setInterval(function() {
	skygear.pubsub.publish(heartbeatChannel, heartbeatCounter+1);
    }, heartbeatInterval);
  }
}

function onConnectionClose() {
  console.log("daemon-trigger-skygear: connection close");

  if (heartbeatTimer != null) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

function onReceiveOpenDoor(data) {
  console.log('daemon-trigger-skygear: open door');
  exec(`curl localhost:8090 --header 'X-Source: Skygear'`);
}

function onHeartbeat(data) {
  if (data != (heartbeatCounter + 1)) {
    console.log('daemon-trigger-skygear: unexpected heartbeat counter:' + data + ", expecting " + (heartbeatCounter+1));
  } else if ((data % 60) == 0){
    console.log('daemon-trigger-skygear: connection alive');
  }

  heartbeatCounter = data;
}

skygear.config({
  endPoint: 'https://chimagun.skygeario.com/',
  apiKey: apiKey,
}).then(() => {
  return skygear.loginWithUsername('__master_chima', '__master_chima_password');
}).then(() => {
  console.log("daemon-trigger-skygear: skygear client started");
  skygear.pubsub.onOpen(onConnectionOpen);
  skygear.pubsub.onClose(onConnectionClose);
  skygear.on(channel, onReceiveOpenDoor);
  skygear.on(heartbeatChannel, onHeartbeat);
}).catch((err) => {
  console.log("daemon-trigger-skygear: failed to start skygear client", err);
});
