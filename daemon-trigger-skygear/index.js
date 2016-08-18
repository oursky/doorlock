'use strict';

const exec = require('child_process').exec;
const skygear = require('skygear');

const apiKey = process.argv[2] || '';

const channel = '&chima-open-door';

function onConnectionOpen() {
  console.log("daemon-trigger-skygear: connection open");
}

function onConnectionClose() {
  console.log("daemon-trigger-skygear: connection close");
  skygear.on(channel, onReceiveOpenDoor);
}

function onReceiveOpenDoor(data) {
  console.log('daemon-trigger-skygear: open door');
  exec(`curl localhost:8090 --header 'X-Source: Skygear'`);
}

skygear.config({
  endPoint: 'https://chimagun.skygeario.com/',
  apiKey: apiKey,
}).then(() => {
  skygear.loginWithUsername('__master_chima', '__master_chima_password').then(() => {
    skygear.pubsub.onOpen(onConnectionOpen);
    skygear.pubsub.onClose(onConnectionClose);
    skygear.on(channel, onReceiveOpenDoor);
  });
});
