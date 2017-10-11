# Web Home Automation Remote
Web app for controlling different protocol based home devices in one place.

I am a hobby programmer, who learnt to write this project from a scratch. Half a year ago I did not know either what Raspberry Pi or Git is. Neither did I know JavaScript syntax at all as I had built my last (and only, laying WordPress experiments aside) website when there were still dinosaurs on Earth and HTML4 entered the scene on a white horse back in 1997. Therefore the project is nothing close to a clean code, it is just the result of my how-to-code learning curve steepening.

The idea of the project was to gather smart home device controllers in one place. All providers of smart home solutions provide GUI and/or smartphone/tablet app for controlling their products, some ofe them allow for 3rd party devices integration via various APIs. There are also open source home automation systems available like [Domoticz](http://domoticz.com) or [Home Assistant](http://home-assistant.io) that cover numerous devices, but I was not able a solution that served all devices I have at my place, or integrated all of them smoothly, so I decided to work on one myself. The result is simple GUI for controlling home devices, that were set up before in their native environments.

The app allows to control devices from devices in LAN. Communications that are covered:
- infrared via Logitech Harmony Hub,
- bluetooth, Sony Playstation 4 specifically via Logitech Harmony Hub,
- ISCP communication over LAN for ONKYO AVR,
- RF 433 mhz via RFXtrx433e transmitter connected to Raspberry Pi,
- z-wave via Fibaro Home Center 2 gateway,
- zigbee lighting via Philips Hue Bridge,
- camera live view and control over IP.

## Prerequisites

### Hardware
#### Controllers / Hubs / Gateways
The following devices are used in the project:
- Raspberry Pi - main hub of the project, host for the app as well as several servers listening for and processing commands,
- RFXtrx433E RF transceiver for RF 433 mhz communication (manual can be found in this repository),
- Logitech Harmony Hub - used for handling IR remotes and most commands for Sony PlayStation 4 (excluding Power On/Off functions which are covered in a different in a different way,
- Fibaro Home Center 2 gateway used for controlling z-wave based devices,
- Philips Hue bridge used for controlling Philips Hue and compatible Zigbee lighting,
- EXTRA: Amazon Echo Dot for providing voice commands for the whole system.
#### Devices controlled
- RF 433 mhz power strip that provides power for my home entertainment system,   
- RF 433 mhz smart socket providing power for air humifier,
- RF 433 mhz window blind motors with YOODA compatible DC306 remote (remote programming manual can be found in this repository),
- Philips Hue lighting: multiple bulbs and color spots grouped in lamps + Hue Go lamp,
- Zigbee lighting compatible with Philips Hue found on Aliexpress, eg here: - several bulbs grouped in lamp,
- z-wave Fibaro smart wall plug with table lamp connected,
- z-wave Fibaro RGBW controller with RGBW light strips connected,
- z-wave Danfoss thermostat,
- Sony Bravia TV KDL-40W5500 - only Power On/Off functions, as other operations are handled by AVR,
- ONKYO TX-NR616 AVR,
- UPC Mediabox - cable STB,
- WD TV Media Player,
- Sony Bravia TV KDL-40W5500,
- Sony PlayStation 4,
- Foscam FI9816P v. 2 IP camera.
