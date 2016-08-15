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
[~/doorlock/embedded]$ lein cljsbuild once
```
The compiled JS is now in `doorlock/embedded/dist/index.js`.

**Note:**
It is highly recommended that you build the JS file on a modern x86 computer.
Compilation takes around 30 secs on an i7 laptop.

### Deploy
**Embedded OS:** ArchLinux ARM

**Dependencies:**

* nodejs
* wiringpi-git (AUR)

**Install as systemd service:**

1. copy the compiled JS to `/home/oursky/doorlock.js`
2. copy `doorlock.service` to `/etc/systemd/system/`
3. enable and start the service:
```
[oursky ~/]$ sudo systemctl enable doorlock
[oursky ~/]$ sudo systemctl start doorlock
```

**Note:** If your username is not `oursky`, you need to edit `doorlock.service` accordingly.

## App
