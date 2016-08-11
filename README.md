# doorlock

Project Structure:
```
.
└── embedded    Embedded System & Hardware
```

## Hardware

Circuit diagrams are drawn with this [Circuit Simulator](http://www.falstad.com/circuit/).<br/>
Diagrams are saved as `txt` files, you can import them under `File > Import From Text`.

Relay Board:
![](https://github.com/oursky/doorlock/raw/master/embedded/circuit.png)

Embedded System: Raspberry Pi 3

Connections:
* Release Button: GPIO0/Ground
* Release Signal: GPIO1/Ground

## Embedded System
**System:** ArchLinux ARM

**Dependencies:**
* nodejs
* npm
* wiringpi-git (AUR)

**Install as systemd service:**
```
[oursky ~/]$ git clone ...
[oursky ~/]$ sudo cp doorlock/embedded/doorlock.service /etc/systemd/system/
[oursky ~/]$ sudo systemctl enable doorlock
[oursky ~/]$ sudo systemctl start doorlock
```
**Note: ** If your username is not `oursky`, you need to edit `doorlock.service` accordingly.

## App
