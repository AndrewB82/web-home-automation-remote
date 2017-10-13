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
- Zigbee lighting compatible with Philips Hue found on AliExpress, e.g. [here](https://www.aliexpress.com/item/Jiawen-Zigbee-bulb-smart-bulb-wireless-bulb-for-philip-hubs-control-by-Apple-homekit-Siri-and/32810632827.html?spm=2114.search0104.3.9.QIGuBQ&ws_ab_test=searchweb0_0,searchweb201602_4_10152_10065_10151_10068_10344_10345_10342_10343_10340_10341_10304_10307_10301_10060_10155_10154_10056_10055_10054_10059_10534_10533_10532_100031_10099_10338_10103_10102_5590020_10052_10053_10142_10107_10050_10051_10171_10084_10083_5370020_10080_10082_10081_10110_10111_10112_10113_10114_10312_10313_10314_10078_10079_10073,searchweb201603_17,ppcSwitch_2&btsid=48e6236d-6e4d-4715-ba0b-c557b9db3b5b&algo_expid=b62e7ced-8cac-4ea3-82b2-aed51b6f1fad-1&algo_pvid=b62e7ced-8cac-4ea3-82b2-aed51b6f1fad) - several bulbs grouped in lamp,
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
WARNING: it is assumed that "sudo" prefix is required for conducting setup operations (non-root user).
### Raspbian update
At first Raspberry OS should be updated from the command line:
```
sudo apt-get update
sudo apt-get upgrade
```
### Domoticz
I followed below tutorials for installation:
- [Initial Raspberry Pi Setup](https://www.domoticz.com/wiki/Initial_Raspberry_Pi_Setup) - for Pi preparation,
- [Installing and running Domoticz on a Raspberry PI](https://www.domoticz.com/wiki/Installing_and_running_Domoticz_on_a_Raspberry_PI) - the easy way from tutorial fits perfectly, point 4 (Domoticz autostart) is of a prime importance,
- DEPRECATED: [Using Domoticz with the RaZberry Z-Wave Controller](http://www.vesternet.com/resources/application-notes/apnt-85#.Wd4vm02LSCo) - I abandoned RaZberry board in favour of more powerful (but a lot more expensive) Fibaro Home Center 2 controller, tutorial by [Vesternet](https://www.vesternet.com),
- last, but not least: [Using Domoticz with the RFXtrx433E USB RF 433.92 MHz Transceiver](http://www.vesternet.com/resources/application-notes/apnt-86#.Wd4vnE2LSCo) - this is the easy and user-friendly way to configure RFXtrx433E transceiver as well as RF devices it serves on Raspberry Pi, tutorial by [Vesternet](https://www.vesternet.com).

WARNING: base64 encoded Domoticz credentials in JSON format are required for using Domoticz REST Api - they should be filled in the code,  
sample credentials http header should look like this:
```json
{"Authorization":"Basic <base64 encoded login:password>"}
```
```"login:password"``` string encoding can be performed at e.g. https://codebeautify.org/base64-encode.

For http requests to be correctly specified, you would need to retrieve device information from Domoticz API. Instructions can be found at: https://www.domoticz.com/wiki/Domoticz_API/JSON_URL's.

It can be worked around to some extent when using [HA Bridge (see below)].  
### Node.js
I followed this tutorial for installation - the most current version is installed as a result: [Beginner’s Guide to Installing Node.js on a Raspberry Pi](http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/) by [Dave Johnson - @thisDaveJ](https://twitter.com/thisDaveJ).
## RFXtrx433E transceiver - if there is no Domoticz server
DEPRECATED in current version of the project - setup is finalised through Domoticz.

RFXtrx433E transceiver is most easily configurable using PC running on Windows. User would probably need to install
USB driver to connect the device to the PC. Once it is done, the transceiver firmware can be updated using RFXflash
application and setup can be done using RFXmngr application. User can find further details in RFXtrx433E manual, which 
can be found in this repository (Prerequisites folder).

For the needs of the project only ```Lighting4``` and ```Lighting5``` protocols are enabled in RFXmngr app.

Installation of RFXcom Node module with necessary dependencies:
```
sudo npm install serialport --unsafe-perm
sudo npm install queue
sudo npm install rfxcom --unsafe-perm
```
For project devices to work with the server, I had to slightly amend lighting4.js and lighting5.js files 
in the RFXcom Node module. It was tested and worked fine with node-rfxcom module (https://github.com/rfxcom/node-rfxcom)
version installed in June 2017. I noticed that since then the owner of the repository introduced significant
changes to the module and my server was not tested with the current version. Amended versions of ```lighting4.js``` 
and ```lighting5.js``` can be found in repository if someone was interested in using them - amendments were made
to var buffer.

```/home/<actual user>/node_modules/rfxcom/lib/lighting4.js``` var buffer modified version:
```javascript
var buffer = [0x09, defines.LIGHTING4, self.subtype, seqnbr,data[0], data[1], data[2], pulseWidth[0], pulseWidth[1], 0x70];
```
```/home/<actual user>/node_modules/rfxcom/lib/lighting5.js``` var buffer modified version:
```javascript
var buffer = [0x0a, defines.LIGHTING5, 0x11, seqnbr,device.idBytes[0], device.idBytes[1], device.idBytes[2],device.unitCode, command, 0, 0x60];
```
Following devices were set up in RFXmngr:
- power strip with entertainment center connected: 
 - type: "Lighting4", 
 - subtype: "PT2262", 
 - "off" code: 555554, dec 5592404, S1-S24: 0101 0101 0101 0101 0101 0100, pulse 322,
 - "on" code: 555557, dec 5592407, S1-S24: 0101 0101 0101 0101 0101 0111, pulse 322,
- smart socket with humifier connected: 
 - type: "Lighting5", 
 - subtype:"Kangtai, Cotech",
 - unit: "1",
 - ID: "5D0C",
 - commands: "on", "off".
- window blind motors:
 - type: "Blinds1",
 - subtype: "BlindsT6",
 - ID (chosen by user preferences): XX XX XX X,
 - unit codes: "0" - all devices in the group, "1"-"3" - blinds in particular rooms,
 - commands: "open", "close", "stop", "confirm" (this one for remote setup - user can find remote manual in this repository's Prerequisites folder.
### Web Server
Apache server with PHP and PHP cURL are used by the project to host the app:
```
sudo apt-get install apache2 -y
sudo apt-get install php5 libapache-mod-php5 -y
sudo apt-get install php5-curl
```
Change owner of the ```/usr/www``` folder to actual user:
```
sudo chown <actual user> /usr/www -R
```
All files from main folder of the repository, except of Prerequistes folder, should be put in ```/usr/www```. 
### ONKYO eISCP
Installation of ONKYO eISCP package with necessary dependencies. Only power and volume querying, dependant zones power on/off and setting specified volume level use this package currently.
```
sudo apt-get install python3-pip
sudo apt-get install python-dev
sudo pip3 install onkyo-eiscp
```
For the onkyo script to work from a browser, a modification to Sudoers File must be done. Open from command line:
```
sudo visudo
```
Add this line in "User privillege section", take into account your actual path to the onkyo script.
```
www-data ALL=NOPASSWD: www-data ALL=NOPASSWD: /usr/local/bin/onkyo
```
### PS4-waker Node module
Install the module:
```
sudo npm install ps4-waker -g
```
You have to pair the Raspberry Pi with iOs (tested by myself) or Android (not tested by myself) Sony PlayStation App. 
Run the app for the first time from command line:
```
sudo ps4-waker
```
Turn on your PS4 and go to "Add Device" tab in "Settings" section and follow on-screen instruction to pair.

After finishing setup, check if you see Raspberry as a device in your PS4 systems and whether credentials file is created correctly - ```.ps4-wake.credentials.json``` - it is a hidden file and should be located in user's home folder. The file should look like this:
```json
{ 
 	"client-type": "X", 
	"auth-type": "Y", 
	"user-credential": "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ"
} 
```
### Node.js Home Server
It is used for handling PS4 Power On/Off and application starting functions. Formerly I used it also to handle RF devices. 
It is a http server that listens for requests assigned to those functions.
Download the ```homenodejsdaemon.js``` file from Prerequisites and put it in preferred folder.
#### Run at startup
The server should run automatically at startup, so system service should be set up:
```
cd /etc/systemd/system
sudo nano homenodejsdaemon.service
```
Below is a template for the service from my project. The file can be found in this repository in the Prereqisites folder,
you can fill your parameters and paste it in nano editor.
```
[Unit]
Description=Node.js RFXtrx PS4 Http Server

[Service]
User=root
Restart=always
KillSignal=SIGQUIT
#The line below specifies path where Node.js server file is located - replace <path> with your actual location.
WorkingDirectory=<path>
#The line below specifies path to the app itself - replace <path> with your actual location.
ExecStart=<path>/homenodejsdaemon.js

[Install]
WantedBy=multi-user.target
```
Save by CTL-X.
To start the service and enable it at boot:
```
sudo systemctl daemon-reload
sudo systemctl enable homenodejsdaemon.service
sudo systemctl start homenodejsdaemon.service
```
HINT: starting apps on PS4 requires passing app ID as a parameter. ID's can be found in PlayStation Store in URL:
simply open desired app page and check URL: ID should have format: '''CUSAXXXXX'''. For the project I used following IDs:
- Netflix - "CUSA00127",
- FIFA18 - "CUSA07994".
### RESTful Harmony API
It is a very useful application making basic communication with Logitech Harmony Hub easier by establishing REST server.
For installation follow guide at: https://github.com/bwssytems/restful-harmony.
I simply downloaded the .jar file.

In the project it is used for handling IR remotes button press functions as well as Harmony Activities initiating.
#### Run at startup
The server should run automatically at startup, so system service should be set up:
```
cd /etc/systemd/system
sudo nano homenodejsdaemon.service
```
Below is a template for the service from my project. The file can be found in this repository in the Prereqisites folder,
you can fill your parameters and paste it in nano editor.
```
[Unit]
Description=RESTful Harmony
Wants=network.target 
After=network.target 

[Service]
Type=simple
#The line below specifies path where Restful Harmony .jar file is located - replace <path> with your actual location.
WorkingDirectory=<path> 
#The line below specifies path to the app itself - replace <path> with your actual location, as well as your Harmony Hub ip - replace <Harmony Hub IP> with actual address.
ExecStart=/usr/bin/java -jar <path>/restful-harmony-1.0.0.jar <Harmony Hub IP>

[Install]
WantedBy=multi-user.target
```
Save by CTL-X.
To start the service and enable it at boot:
```
sudo systemctl daemon-reload
sudo systemctl enable restfulharmony.service
sudo systemctl start restfulharmony.service
```
### HA Bridge
It is a brilliant tool that complements and supports your own home automation system. It emulates Philips Hue bridge behind which one can embak almost every kind of device able to communicate over network.
They are all seen as Philips Hue lights operated by On, Off and Dim commands for which you can assign various network requests.
For installation follow guide at: https://github.com/bwssytems/ha-bridge.
I simply downloaded the .jar file. You should also pay special attention to the section "Run ha-bridge alongside web server already on port 80".

IMPORTANT: running for the first time from command line, I used port number parameter -Dserver.port=<port number> as HA Bridge runs on default port 80 and there is already Apache listening on that port, and Domoticz listening on 8080:
```
/usr/bin/java -jar -Dserver.port=<port number> <actual path>/ha-bridge-W.X.Y.jar
```

The bridge has decent GUI where you can configure your phisical Philips Hue bridge, Logitech Harmony Hub, Domoticz devices and few others. When done, it has build helpers to set up HA bridge virtual devices.

For the project, HA Bridge was used for:
- Harmony button press functionality to emulate Sony Playstation 4 PS button long press,
- having Domoticz devices set up, one can see URL's that are necessary to control Domoticz devices via API - this is a workaround mentioned above,
- EXTRA FEATURE: having set up RF devices as http devices in HA Bridge opens your RF devices for Alexa voice control,
- EXTRA FEATURE: having Node.js server + PS4-waker module listening, I set up HA bridge htpp devices that start apps on my PlayStation 4 by voice, i.e. Netflix and Fifa18.
#### Run at startup
The most convenient way of using HA Bridge is to set up a system service to start at boot:
```
cd /etc/systemd/system
sudo nano habridge.service
```
Below is a template for the service from my project, based on the one found in [the guide](https://github.com/bwssytems/ha-bridge). The file can be found in this repository in the Prereqisites folder,
you can fill your parameters and paste it in nano editor.
```
[Unit]
Description=HA Bridge
Wants=network.target
After=network.target

[Service]
Type=simple
#The line below specifies path where HA Bridge .jar file is located - replace <path> with your actual location.
WorkingDirectory=<path>
#The line below specifies HA Bridge config file you prefer to use and path to the app itself - replace <path> with your actual location.
ExecStart=/usr/bin/java -jar -Dconfig.file=<path>/data/habridge.config <path>/ha-bridge-4.5.6.jar

[Install]
WantedBy=multi-user.target
```
Save by CTL-X.
To start the service and enable it at boot:
```
sudo systemctl daemon-reload
sudo systemctl enable habridge.service
sudo systemctl start habridge.service
```
### Philips Hue API
For the app to work, you have to create an authorized user with your Hue Bridge. It can be implemented in the app, as far as I know, but it is not necessary for my needs, so maybe in the future.
At first you have to create an account at [Hue Developer Program](https://developers.meethue.com): https://developers.meethue.com.
The Hue API is then available at:
```
http://<bridge ip address>/debug/clip.html
```
To create a user you have to fill the form with following values:
URL: ```http://<bridge ip address>/api```,
Message Body:
```json
{"devicetype":"my_hue_app#<device> <user name>"}
```
A POST request should be sent, and username will be returned in response. 
It must be implemented in the code and used in every Hue Api request sending commands to Hue and compatible lighting, e.g.:
```
http://<bridge ip address>/api/<username>/lights
```
For further Hue API instructions go to: https://developers.meethue.com/documentation/getting-started.
## Usage
The app is divided into panels:
- "Dom" - Polish word for "Home" - here user can control RF Devices, namely entertainment center power strip, window blinds and tested smart socket, as well as Philips Hue and z-wave lighting and z-wave theromostats; **it is the default panel opened when the app is initiated**,
- "Amplituner" - AVR remote with multizone covered (second zone - Bathroom - and third zone are opened when activated, third zone not implemented currently),
- "UPC" - cable TV service remote,
- "Media Player" - media player remote,
- "TV" - remote with only TV power toggle implemented, as other media operations are handled by AVR,
- "PS4" - Sony Plasystation 4 remote with **Power On, Power Off, and PS button long press included**,
- "Kamera" - IP camera live view with controls,
- "Sceny" - Polish word for "Scenes" - currrently starting of Harmony Activities is implemented.
## Potential development areas
1. Security issues.
2. Migration of remaining functions from using [ONKYO-eISCP package](https://github.com/miracle2k/onkyo-eiscp) to [eISCP Node module](https://github.com/tillbaks/node-eiscp) by and credited to [@tillbaks](https://github.com/tillbaks).
3. Project rewriting and code optimization.
4. Translation of the GUI from Polish to English.
5. Philips Hue API user creation.
