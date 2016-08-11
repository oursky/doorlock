const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const setTimeout = require('timers').setTimeout;
const log = require('simple-node-logger').createSimpleLogger();

execSync('gpio mode 0 up');
execSync('gpio mode 1 out');

function openDoor() {
  execSync('gpio write 1 1');
  setTimeout(_ => execSync('gpio write 1 0'), 3000);
}

(function listenButton() {
  exec('gpio wfi 0 rising').on('exit', _ => {
    log.info('Unlocked via Button');
    openDoor();
    setTimeout(_ => listenButton(), 500);
  })
})()

log.info('=== Daemon Started ===');
