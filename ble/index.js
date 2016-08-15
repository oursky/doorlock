'use strict';

const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

/**
 * BLENO
 */
const bleno = require('bleno');
const PrimaryService = bleno.PrimaryService;
const Characteristic = bleno.Characteristic;

/**
 * Constants
 */
const serviceUuid = 'fff0';
const characteristicUuid = 'fff0';

/**
 * Service & Characteristic
 */
const primaryService = new PrimaryService({
  uuid: serviceUuid,
  characteristics: [new Characteristic({
    uuid: characteristicUuid,
    properties: ['writeWithoutResponse'],
    onWriteRequest: function onDoorLockWrite(data, offset, withoutResponse, callback) {
      if (!withoutResponse) {
        callback(Characteristic.RESULT_UNLIKELY_ERROR);
        return;
      }

      console.log('data: ', data.toString('utf8'));
      const token = process.argv[2] || 'secret';
      const isValid = data.toString('utf8') === token;

      if (isValid) {
        openDoor();
      }
    },
  })],
});

/**
 * Main
 */
function openDoor() {
  console.log('openDoor');
  exec(`curl localhost:8090 --header 'X-Source: BLE'`);
}

function startAdvertising() {
  const peripheralName = 'chima door';

  bleno.startAdvertising(peripheralName, [serviceUuid], (err) => {
    if (err) {
      console.log(`startAdvertising err: ${err}`);
      return;
    }
  });
}

function onBLEStateChange(state) {
  console.log(`bleno state: ${bleno.state}`);

  if (state === 'poweredOn') {
    startAdvertising();
    bleno.setServices([primaryService]);
  } else {
    bleno.stopAdvertising();
  }
}

bleno.on('stateChange', onBLEStateChange);
