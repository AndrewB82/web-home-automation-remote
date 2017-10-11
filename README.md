# Web Home Automation Remote
Web app for controlling different protocol based home devices in one place.

I am a hobby programmer, who learnt to write this project from a scratch. Half a year ago I did not know either what Raspberry Pi or Git is. Neither did I know JavaScript syntax at all as I had built my last (and only, laying WordPress experiments aside) website when there were still dinosaurs on Earth and HTML4 entered the scene on a white horse back in 1997. Therefore the project is nothing close to a clean code, it is just the result of my how-to-code learning curve steepening.

The idea of the project was to gather smart home device controllers in one place. All providers of smart home solutions provide GUI and/or smartphone/tablet app for controlling their products, some of them allow for 3rd party devices integration via various APIs. There are also open source home automation systems available like [Domoticz](http://domoticz.com) or [Home Assistant](http://home-assistant.io) that cover numerous devices, but I was not able a solution that served all devices I have at my place, or integrated all of them smoothly, so I decided to work on one myself. The result is simple GUI for controlling home devices, that were set up before in their native environments.

The app allows to control devices from devices in LAN. Communications that are covered:
- infrared via Logitech Harmony Hub,
- bluetooth, Sony Playstation 4 specifically via Logitech Harmony Hub,
- ISCP communication over LAN for ONKYO AVR,
- RF 433 mhz via RFXtrx433e transmitter connected to Raspberry Pi,
- z-wave via Fibaro Home Center 2 gateway,
- zigbee lighting via Philips Hue Bridge,
- camera "live view" and control over IP.

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
- Zigbee lighting compatible with Philips Hue found on AliExpress, eg [here](https://www.aliexpress.com/item/Jiawen-Zigbee-bulb-smart-bulb-wireless-bulb-for-philip-hubs-control-by-Apple-homekit-Siri-and/32810632827.html?spm=2114.search0104.3.9.QIGuBQ&ws_ab_test=searchweb0_0,searchweb201602_4_10152_10065_10151_10068_10344_10345_10342_10343_10340_10341_10304_10307_10301_10060_10155_10154_10056_10055_10054_10059_10534_10533_10532_100031_10099_10338_10103_10102_5590020_10052_10053_10142_10107_10050_10051_10171_10084_10083_5370020_10080_10082_10081_10110_10111_10112_10113_10114_10312_10313_10314_10078_10079_10073,searchweb201603_17,ppcSwitch_2&btsid=48e6236d-6e4d-4715-ba0b-c557b9db3b5b&algo_expid=b62e7ced-8cac-4ea3-82b2-aed51b6f1fad-1&algo_pvid=b62e7ced-8cac-4ea3-82b2-aed51b6f1fad) - several bulbs grouped in lamp,
- z-wave Fibaro smart wall plug with table lamp connected,
- z-wave Fibaro RGBW controller with RGBW light strips connected,
- z-wave Danfoss thermostat,
- Sony Bravia TV KDL-40W5500 - only Power On/Off functions, as other operations are handled by AVR,
- ONKYO TX-NR616 AVR,
- UPC Mediabox - cable STB,
- WD TV Media Player,
- Sony PlayStation 4,
- Foscam FI9816P v. 2 IP camera.

### Software
The following software was used in the project, installed on Raspberry Pi, or embedded in the code:
- Raspbian Jessie OS,
- Domoticz Home Automation System,
- Node.js,
- Serialport Node module,
- Queue Node module,
- [RFXcom Node module](https://github.com/rfxcom/node-rfxcom) (deprecated, not used in current version) by and credited to Maxwell Hadley - @rfxcom,
- [PS4-waker Node module](https://github.com/dhleong/ps4-waker) by and credited to Daniel Leong - [@dhleong](https://github.com/dhleong),
- Apache2 web server,
- PHP5,
- PHP5 cURL,
- Python3 package,
- Python3-dev package,
- [ONKYO-eISCP package](https://github.com/miracle2k/onkyo-eiscp) by and credited to Michael Elsdörfer - [@miracle2k](https://github.com/miracle2k),
- [HA Bridge](https://github.com/bwssystems/ha-bridge) by and credited to BWS Systems - [@bwssystems](https://github.com/bwssystems),
- [RESTful Harmony API](https://github.com/bwssystems/restful-harmony) by and credited to BWS Systems - [@bwssystems](https://github.com/bwssystems),
- Modified [PHP proxy script](https://github.com/cowboy/php-simple-proxy) by and credited to Ben Alman - [@cowboy](https://github.com/cowboy),
- Modified [cie_rgb_converter.js script](https://github.com/usolved/cie-rgb-converter) by and credited to Ricardo Klement - [@usolved](https://github.com/usolved),
- ColorPicker and ColorCursor classes largely using code from this [stackoverflow.com question](https://stackoverflow.com/questions/41844110/ploting-rgb-or-hex-values-on-a-color-wheel-using-js-canvas) and corresponding [jsfiddle](http://jsfiddle.net/havdto6e/4/) - credited to [this guy](https://stackoverflow.com/users/1579780/giladd),
- color picker mouse tracking with touchscreen capabilities largely credited to http://zipso.net , specifically to: https://zipso.net/a-simple-touchscreen-sketchpad-using-javascript-and-html5/,
- CountDown function with small amendments using code from [W3schools](https://www.w3schools.com): https://www.w3schools.com/howto/howto_js_countdown.asp,
- function for getting parameter from URL by and credited to [JQUERYBYEXAMPLE](http://www.jquerybyexample.net/), http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html,
- functions for embedding and handling IP camera live view, credited to [the Mad Hermit](http://www.themadhermit.net), http://www.themadhermit.net/how-to-embed-video-from-your-foscam-fi9821w-wireless-camera-into-your-web-page/.

## Installation

## Usage
The app is divided into panels:
- "Dom" - Polish word for "Home" - here user can control RF Devices, namely entertainment center power strip, window blinds and tested smart socket, as well as Philips Hue and z-wave lighting and z-wave theromostats; **it is the default panel opened when the app is initiated**,
- "Amplituner" - AVR remote with multizone covered (second zone - Bathroom - and third zone are opened when activated, third zone not implemented currently),
- "UPC" - cable TV service remote,
- "Media Player" - media player remote,
- "TV" - remote with only TV power toggle implemented, as other media operations are handled by AVR,
- "PS4" - Sony Plasystation 4 remote with Power On, Power Off, and PS button long press included,
- "Kamera" - IP camera live view with controls,
- "Sceny" - Polish word for "Scenes" - currrently starting of Harmony Activities is implemented.

## To-dos
1. Security issues.
2. Migration of remaining functions from using [ONKYO-eISCP package](https://github.com/miracle2k/onkyo-eiscp) to [eISCP Node module](https://github.com/tillbaks/node-eiscp) by and credited to [@tillbaks](https://github.com/tillbaks).
3. Project rewriting and code optimization.
4. Translation of the GUI from Polish to English.
