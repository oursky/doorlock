'use strict';

const exec = require('child_process').exec;
const skygear = require('skygear');

const apiKey = process.argv[2] || '';

function onReceiveOpenDoor(data) {
  console.log('openDoor');
  exec(`curl localhost:8090 --header 'X-Source: Skygear'`);
}

skygear.config({
  endPoint: 'https://chimagun.skygeario.com/',
  apiKey: apiKey,
}).then(() => {
  skygear.loginWithUsername('__master_chima', '__master_chima_password').then(() => {
    skygear.on('&chima-open-door', onReceiveOpenDoor);
  });
});
