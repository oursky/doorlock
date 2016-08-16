'use strict';

const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

const secret = process.argv[2] || 'secret';

/**
 * BLENO
 */
const bleno = require('bleno');
const PrimaryService = bleno.PrimaryService;
const Characteristic = bleno.Characteristic;
const platform = bleno.platform;

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

      const tokens = genTokens();
      const input = data.toString('utf8');
      const isValid = tokens.filter((t) => input === t).length > 0;

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

function tokenWithDateExpr(expr) {
  const token = platform === 'darwin' ?
    execSync(`echo -n ${secret}${expr} | md5 | awk '{print $1}'`) :
    execSync(`echo -n ${secret}${expr} | md5sum | awk '{print $1}'`);
  return token.toString('utf8').substr(0, 32);
}

function genTokens() {
  const exprs = [
    `$(expr $(date +%s) / 20 - 1)`,
    `$(expr $(date +%s) / 20)`,
    `$(expr $(date +%s) / 20 + 1)`,
  ];

  return exprs.map(tokenWithDateExpr);
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
