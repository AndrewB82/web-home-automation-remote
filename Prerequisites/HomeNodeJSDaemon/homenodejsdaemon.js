#!/usr/bin/env node

//Below the path to ps4-waker Node.js module installed globally, replace the path with your actual loaction of the module.
const {Device} = require('/usr/lib/node_modules/ps4-waker');

//Below line is commented because in current version of my remote (v2) RFXtrx Node.js module is disabled 
//- RF devices work through Domoticz in order to secure Homebridge HomeKit emulation.
//I left the code to have RFXcom library as an alternative to Domoticz. There may be issue, however:
//for my devices to work with the server, I had to slightly amend lighting4.js and lighting5.js files 
//in the module. It was tested and worked fine with node-rfxcom module (https://github.com/rfxcom/node-rfxcom)
//version installed around June 2017. I noticed that since then the owner of the repository conducted significant
//changes to the module and my server was not tested with the current version. Amended versions of lighting4.js 
//and lighting5.js can be found in repository if someone was interested in using them - amendments were made
//to var buffer.

//var rfxcom = require('/home/pi/node_modules/rfxcom');
var http = require('http');
    url = require('url');

    ps4 = new Device();    

    /*
    //My RFXcom transmitter object:
    rfxtrx = new rfxcom.RfxCom("/dev/ttyUSB0", {debug: true});
    //My RF power strip remote object:
    listwa = new rfxcom.Lighting4(rfxtrx,rfxcom.lighting4.PT2262);
    //My RF blinds remote object:
    rolety = new rfxcom.Blinds1(rfxtrx,rfxcom.blinds1.BLINDS_T6);
    //My RF smart socket remote object :
    nawilzacz = new rfxcom.Lighting5(rfxtrx,rfxcom.lighting5.LIGHTWAVERF);
    */
    
    sockets = {}, nextSocketId = 0;
    
    //Below object with functions called when certain requests are caught by the server, 
    //each function calls proper remote tp send command to RF device or PS4 (in this case PowerOn, PowerOff,
    //StartNetflix, StartFIFA18).
    ha_commands = {
        /*
        ListwaOn: function() { listwa.sendData("0x555557","0x0142"); },
        ListwaOff: function() { listwa.sendData("0x555554","0x0142"); },
        NawilzaczOn: function() { nawilzacz.switchOn("0x005D0C/1"); },
        NawilzaczOff: function() { nawilzacz.switchOff("0x005D0C/1"); },
        Rolety1Open: function() { rolety.open("0xBF17348/1"); },
        Rolety1Close: function() { rolety.close("0xBF17348/1"); },
        Rolety1Stop: function() { rolety.stop("0xBF17348/1"); },
        Rolety2Open: function() { rolety.open("0xBF17348/2"); },
        Rolety2Close: function() { rolety.close("0xBF17348/2"); },
        Rolety2Stop: function() { rolety.stop("0xBF17348/2"); },
        Rolety3Open: function() { rolety.open("0xBF17348/3"); },
        Rolety3Close: function() { rolety.close("0xBF17348/3"); },
        Rolety3Stop: function() { rolety.stop("0xBF17348/3"); },
        Rolety0Open: function() { rolety.open("0xBF17348/0"); },
        Rolety0Close: function() { rolety.close("0xBF17348/0"); },
        Rolety0Stop: function() { rolety.stop("0xBF17348/0"); },
        */

        PS4On: function() { ps4.turnOn().then(() => ps4.close()); },
        PS4Off: function() { ps4.turnOff(); },
        PS4Netflix: function() { 
            ps4.turnOn().then(() => ps4.startTitle("CUSA00127").then(() => ps4.close()));
        },
        PS4FIFA: function() { 
            ps4.turnOn().then(() => ps4.startTitle("CUSA07994").then(() => ps4.close()));
        }
    };

/*
rfxtrx.initialise(function () {
    console.log("Device initialised");
});
*/

var server = http.createServer(function(request, response) {
    var params = url.parse(request.url,true);
        param_str = "";
    console.log(params.href);
    response.writeHead(200,{'Content-Type': 'text/plain'});
    response.write('Node JS server running');  
    response.end();
    param_str = params.href.slice(1);
    if (param_str in ha_commands) {
        console.log(param_str);
        ha_commands[param_str]();
    }
}).listen(7777);
console.log("HTTP server initialized");

server.on('connection', function (socket) {
    // Addidtion of currently connected socket
    var socketId = nextSocketId++;
    sockets[socketId] = socket;
    console.log('socket', socketId, 'opened');
    // Deletion of the socket when it has been closed
    socket.once('close', function () {
        console.log('socket', socketId, 'closed');
        delete sockets[socketId];
    });
});
