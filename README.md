# doorlock

**Project Structure:**
```
.
└── embedded    Embedded System & Hardware
```

## Hardware

Circuit diagrams are drawn with this [Circuit Simulator](http://www.falstad.com/circuit/).<br/>
Diagrams are saved as `txt` files, you can import them under `File > Import From Text`.

**Relay Board:**
![](https://github.com/oursky/doorlock/raw/master/embedded/circuit.png)

**Embedded System:** Raspberry Pi 3

**Connections:**
* Release Button: GPIO0/Ground
* Release Signal: GPIO1/Ground

## Embedded System

### Build

**Dependencies:**

* leiningen

**Build:**
```
[~/]$ git clone ...
[~/doorlock/embedded]$ lein uberjar
```
The compiled JAR is now in `doorlock/embedded/target/doorlock-<version>-standalone.jar`.

### Deploy
**Embedded OS:** ArchLinux ARM

**Dependencies:**

* java
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

## BLE

Running this service, your rpi would act as peripheral and advertise. You would need to connect to the device and write a generated time-based token to service 'fff0' characteristic 'fff0' to activiate open door.

**Requirement**
- http://www.elinux.org/RPi_Bluetooth_LE
- node 6.x

**Install as systemd service**
- copy `doorlock-ble.service` to `/etc/systemd/system/doorlock-ble@.service`
- enable and start the service:
```
[oursky ~/]$ sudo systemctl enable doorlock-ble@<your-secret>
[oursky ~/]$ sudo systemctl start doorlock-ble@<your-secret>
```

## App
