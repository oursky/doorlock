# doorlock

Oursky IoT doorlock system.

System Architecture:
![](https://github.com/oursky/doorlock/raw/master/architecture.png)

(drawn using GNU Dia)
## Hardware

Circuit diagrams are drawn with this [Circuit Simulator](http://www.falstad.com/circuit/).<br/>
Diagrams are saved as `txt` files, you can import them under `File > Import From Text`.

**Relay Board:**
![](https://github.com/oursky/doorlock/raw/master/relay-board/circuit.png)

**Connections:**
* Release Button: GPIO0/Ground
* Release Signal: GPIO1/Ground

## Raspberry Pi 3

**System:** ArchLinux ARM

**Enable Watchdog:**

```
[~/]$ pacman -S watchdog
[~/]$ systemctl enable watchdog
[~/]$ systemctl start watchdog
```

```
# /etc/watchdog.conf

ping = 127.0.0.1
max-load-1 = 24
watchdog-timeout = 10
watchdog-device = /dev/watchdog
realtime = yes
priority = 1
```

### Doorlock Daemon

Responsible for interacting with hardware connected to the Pi. Exposes a HTTP API listening on `127.0.0.1:8090`, any requests sent to this socket will trigger an unlock. An optional header `X-Source` can be sent to identify the triggering source (e.g. Bluetooth LE). Written in clojure, runs on JVM.

**System:** ArchLinux ARM

**Enable Watchdog:**

```
[~/]$ pacman -S watchdog
[~/]$ systemctl enable watchdog
[~/]$ systemctl start watchdog
```

```
# /etc/watchdog.conf

ping = 127.0.0.1
max-load-1 = 24
watchdog-timeout = 10
watchdog-device = /dev/watchdog
realtime = yes
priority = 1
```

### Doorlock Daemon

Responsible for interacting with hardware connected to the Pi. Exposes a HTTP API listening on `127.0.0.1:8090`, any requests sent to this socket will trigger an unlock. An optional header `X-Source` can be sent to identify the triggering source (e.g. Bluetooth LE). Written in clojure, runs on JVM.

**Build Dependencies:**

* leiningen

**Build:**
```
[~/]$ git clone ...
[~/doorlock/daemon-doorlock]$ lein uberjar
```
The compiled JAR is now in `daemon-doorlock/target/doorlock-<version>-standalone.jar`.

**Runtime Dependencies:**

* Java 8
* wiringpi-git (AUR)

**Install as systemd service:**

1. copy the compiled JAR to `/home/oursky/doorlock.jar`
2. copy `doorlock.service` to `/etc/systemd/system/`
3. enable and start the service:
```
[oursky ~/]$ sudo systemctl enable doorlock
[oursky ~/]$ sudo systemctl start doorlock
```

**Note:** If your username is not `oursky`, you need to edit `doorlock.service` accordingly.

### BLE Trigger Daemon

Running this service, the rpi would act as peripheral and advertise. You would need to connect to the device and write a generated time-based token to service 'fff0' characteristic 'fff0' to unlock.

**Runtime Dependencies:**

* bluez
* pi-bluetooth (AUR)
* node `6.x`

**Install as systemd service:**

1. copy `doorlock-ble@.service` to `/etc/systemd/system/`
2. enable and start the service:
```
[oursky ~/]$ sudo systemctl enable doorlock-ble@<your-secret>
[oursky ~/]$ sudo systemctl start doorlock-ble@<your-secret>
```

### Skygear Trigger Daemon

Listen for unlock requests from Skygear ...

## OpenSky App

Allow end users to trigger an unlock from a mobile device. Written using clojurescript on react-native.

**Dev Dependencies:**

* leiningen 
* npm
* re-natal (from npm)
* react-native-cli (from npm)
* android SDK (must set env `ANDROID_HOME`)
* android platform tools (adb)
* XCode (with CLI tools)
* rlwrap (optional, for figwheel REPL)

**Android Development:**
```
[~/doorlock/opensky/]$ npm install
[~/doorlock/opensky/]$ npm start                       # start react-native packager
[~/doorlock/opensky/]$ rlwrap lein figwheel android    # start figwheel dev server
[~/doorlock/opensky/]$ react-native run-android        # deploy app
[~/doorlock/opensky/]$ adb reverse tcp:8081 tcp:8081   # connect react-native
[~/doorlock/opensky/]$ adb reverse tcp:3449 tcp:3449   # connect figwheel
```

