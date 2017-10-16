/* Remote event handlers script. */

$(document).ready(function() {
    target_link = GetURLParameter('target_link');
    if (target_link) {
        setActiveLink(target_link);
    } else {
        setActiveLink("Dom");
    }
    checkAmplituner("PHP/AmplitunerCheck.php");
});

$(window).load(function() { 
    var x, hours, minutes, minutes_fraction, minutes_fraction_rounded, slider_value;
    
/*
HA Bridge user id obtaining for later communication with PS4. Remember to set actual IP and port of HA Bridge server.
*/ 
   communicateREST("http://<HA Bridge>:<HA Bridge port>/api","POST",'{"devicetype":"BrowarRemote#Browser"}',RESTcallback,false);
    hue_user = RESTresponse[0]["success"]["username"];
    emptyObject(RESTresponse);
    checkLampArray();
/*
Thermostats polling is performed in above checkLampArray function (in fact it is z-wave device array, not only z-wave lamp array). Only one thermostat currently at my place, with id#18 assigned to request response, below its parameters assigned to global variables. Id could be checked and programmed dynamically, not fixed assignment as it poses risks in case of z-wave network modifications, but I find value added marginal compared to static assignment and eventual manual code corrections.
*/
    thermostats["Salon"] = [Number(RESTresponse["contents"][18]["id"]),Number(RESTresponse["contents"][18]["properties"]["targetLevel"]),Number(RESTresponse["contents"][18]["properties"]["timestamp"])];
    $('input[type=range]#TemperaturaSalon').val(thermostats["Salon"][1]);
    displayThermostat("Salon");
    emptyObject(RESTresponse);
    if ($('#nav a#Dom').hasClass('active')) {
        showLampPanel();
    }
});

/*Top navigation panel button handlers. Active panel is colored red. If "Home" (Polish language: "Dom") panel is active
and any adjustable lighting is powered on, a color picker panel appears.*/

$(function() {
    $("#nav a:not(#Odśwież)").click(function() {
        if (!$(this).hasClass('transparent')) {
            setActiveLink(this.id);
		    if (!jQuery.isEmptyObject(curs)) {
			    curs.canvas.getContext('2d').clearRect(0, 0, curs.canvas.width, curs.canvas.height);
		    }
		    if (this.id == "Dom") {
		        showLampPanel();
		    }		    
        }
    });
});

/*Site refresh button handling for iOs "standalone app" view.*/

$(function() {
    $("#Odśwież").click(function() {
        location.reload();
    });
});

/*
Power On/Off events for ONKYO AVR Main, Zone2 and Zone3 (currently disabled). 
Main zone handled by RESTful Harmony API by BWS Systems(http://www.bwssystems.com, https://github.com/bwssytems), remaining zones 
by PHP script over LAN using Onkyo eISCP Control library by Michael Elsdörfer (http://blog.elsdoerfer.name, https://github.com/miracle2k)
as Harmony does not provide response status with power and volume. Main could be covered by Harmony as it provides status in standby mode, 
not only after Power On.
Devices used by Harmony API must be defined in Logitech Harmony Hub.
WARNING: remember to provide actual RESTful Harmony server IP with port. 
*/

$(function() {
    $("div#Amplituner a#MainPower,a#Bathroom,a#Zone3").click(function() { 
        var device = findDevice($(this));
	        param_string = "", harmony = "";
        
        switch(this.id) {
            case "MainPower":
                if (zones[0] == 0) {
                    harmony=JSON.stringify({"device":"Amplituner","button":"PowerOn"});
                    communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
                    zones[0] = 1;
                }
                else {
                    harmony=JSON.stringify({"device":"Amplituner","button":"PowerOff"});
                    communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
                    zones[0] = 0;
                }
            break;
            case "Bathroom":
                if (zones[2] == 0) {
                    param_string = "device=Amplituner&command1=LazienkaOn";
                    sendMultiCommands(param_string);
                    zones[2] = 1;
                }
                else {
                    harmony=JSON.stringify({"device":"Bathroom","button":"PowerOff"});
                    communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
                    zones[2] = 0;
                }
            break;
            /*
            case "Zone3":
                if (zones[4] == 0) {
                    param_string = "device="+device+"&command1=Zone3On";
                    sendMultiCommands(param_string);
                    zones[4] = 1;
                }
                else {
                    harmony=JSON.stringify({"device":"ONKYO Zone 3","button":"PowerOff"});
                    communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
                    zones[4] = 0;
                }
            break;
            */
        }
        toggleZone(this.id);
    });
});

/*
Most infrared remotes (Amplituner main zone, TV, cable ("UPC"), Media Player) most button commands (VolumeUp, VolumeDown excluded) + 
most PS4 buttons (PowerOn, PowerOff, PS long press excluded). Handled by RESTful Harmony API by BWS Systems(http://www.bwssystems.com, 
https://github.com/bwssytems).
Devices used by Harmony API must be defined in Logitech Harmony Hub.
FEATURE: up to triple press covered.
WARNING: remember to provide actual RESTful Harmony server IP with port.  
*/

$(function() {
    $("div#PHPConnections > div > div:not(#Bathroom,#Zone3) a:not(#MainPower,#Bathroom,#Zone3,#PS4On,#PS4Off,#PSHold,#VolumeUp,#VolumeDown)").on("click", function(e) {
        var single_command = $(this).attr('id');
            device = findDevice($(this));
            harmony = "";
        
        commands_arr[clicks++]=single_command;
        if (clicks === 1) {
            timer = setTimeout(function() {
                harmony=JSON.stringify({"device":device,"button":commands_arr[0]});
                communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
                commands_arr.splice(0,commands_arr.length);     
                clicks = 0;
            },delay);
        } 
        else if (clicks === 2) {
            clearTimeout(timer);
            timer = setTimeout(function() {
                harmony=JSON.stringify([{"device":device,"button":commands_arr[0]},{"device":device,"button":commands_arr[1]}]);
                communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
                commands_arr.splice(0,commands_arr.length);
                clicks = 0;
            }, delay);
        }
        else {
            clearTimeout(timer);    
            harmony=JSON.stringify([{"device":device,"button":commands_arr[0]},{"device":device,"button":commands_arr[1]},{"device":device,"button":commands_arr[2]}]);
            communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
            commands_arr.splice(0,commands_arr.length);
            clicks = 0;           
        }
    })
    .on("dblclick", function(e){
        e.preventDefault();
    });
});

/*
Bathroom (Zone2) infrared remote most button commands (VolumeUp, VolumeDown excluded).
Handled by RESTful Harmony API by BWS Systems(http://www.bwssystems.com, https://github.com/bwssytems). 
Bathroom is a device defined in Logitech Harmony Hub.
FEATURE: up to triple press covered.
WARNING: remember to provide actual RESTful Harmony server IP with port.  
*/

$(function() {
    $("div#Bathroom a:not(#VolumeUp,#VolumeDown)").on("click", function(e) {       
        var single_command = $(this).attr('id');
            device = "Bathroom";
            harmony = "";
        
        commands_arr[clicks++]=single_command;
        if (clicks === 1) {
            timer = setTimeout(function() {
                harmony=JSON.stringify({"device":device,"button":commands_arr[0]});
                communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
                commands_arr.splice(0,commands_arr.length);     
                clicks = 0;
            },delay);
        } 
        else if (clicks === 2) {
            clearTimeout(timer);
            timer = setTimeout(function() {
                harmony=JSON.stringify([{"device":device,"button":commands_arr[0]},{"device":device,"button":commands_arr[1]}]);
                communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
                commands_arr.splice(0,commands_arr.length);
                clicks = 0;
            }, delay);
        }
        else {
            clearTimeout(timer);    
            harmony=JSON.stringify([{"device":device,"button":commands_arr[0]},{"device":device,"button":commands_arr[1]},{"device":device,"button":commands_arr[2]}]);
            communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
            commands_arr.splice(0,commands_arr.length);
            clicks = 0;           
        }
    })
    .on("dblclick", function(e){
        e.preventDefault();
    });
});

/*
Power On/Off events for PS4. 
Handled by Node.js server and ps4-waker module by Daniel Leong (http://dhleong.net, https://github.com/dhleong).
WARNING: remember to provide actual Node.js server IP with port.
*/

$(function() {
    $("a#PS4On,a#PS4Off").on("click", function(e) {
        param_string = "http://<Home Node.js server IP>:<Home Node.js server port>/"+this.id;
	    communicateNodeJSServer(param_string);
    })
    .on("dblclick", function(e){
        e.preventDefault();
    });
});

/*
PS button long press for PS4. 
Handled by HA Bridge server by BWS Systems (http://bwssystems.com/, https://github.com/bwssytems).
WARNING: remember to provide actual Node.js server IP with port and light id of a PS long press button defined in HA Bridge.
*/

$(function() {
    $("a#PSHold").on("click", function(e) {
        ha_bridge_harmony=JSON.stringify({"on":true});
        communicateREST("http://<HA Bridge server IP>:<HA Bridge server port>/api/"+hue_user+"/lights/<light id >/state","PUT",ha_bridge_harmony,null,true);
    })
    .on("dblclick", function(e){
        e.preventDefault();
    });
});

/*
Most infrared remotes (Amplituner main zone, TV, UPC, Media Player) VolumeUp and VolumeDown buttons.
Handled by RESTful Harmony API by BWS Systems(http://www.bwssystems.com, https://github.com/bwssytems).
Devices used by Harmony API must be defined in Logitech Harmony Hub.
FEATURE: up to triple press covered.
WARNING: remember to provide actual RESTful Harmony server IP with port.  
*/

$(function() {
    $("div#PHPConnections > div > div:not(#Bathroom,#Zone3) a#VolumeUp, div#PHPConnections > div > div:not(#Bathroom,#Zone3) a#VolumeDown").on("click", function(e) {
        var single_command = $(this).attr('id');
            device = findDevice($(this));
            change = 0;
            harmony = "";
        
        //Array with VolumeUp and VolumeDown counter:
        volume_commands[single_command]++;
        //Array with commands to be sent to Harmony object:
        vol_commands_arr[clicks++] = single_command;
        if (clicks === 1) {
            timer = setTimeout(function() {
                change = volume_commands["VolumeUp"] - volume_commands["VolumeDown"];
                zones[1] = zones[1] + change;
                harmony=JSON.stringify({"device":"Amplituner","button":vol_commands_arr[0]});
                $('input[type=range]#Volume'+device).val(zones[1]);
                showVolume("Volume"+device);
                communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
                volume_commands = {VolumeUp:0,VolumeDown:0};
                vol_commands_arr.splice(0,vol_commands_arr.length);      
                clicks = 0;
            },delay);
        } 
        else if (clicks === 2) {
            clearTimeout(timer);
            timer = setTimeout(function() {
                change = volume_commands["VolumeUp"] - volume_commands["VolumeDown"];
                if (change != 0) {
                    zones[1] = zones[1] + change;
                    harmony=JSON.stringify([{"device":"Amplituner","button":vol_commands_arr[0]},{"device":"Amplituner","button":vol_commands_arr[1]}]);
                    $('input[type=range]#Volume'+device).val(zones[1]);
                    showVolume("Volume"+device);
                }
                communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
                volume_commands = {VolumeUp:0,VolumeDown:0};
                vol_commands_arr.splice(0,vol_commands_arr.length);          
                clicks = 0;
            }, delay);
        }
        else {
            clearTimeout(timer);
            change = volume_commands["VolumeUp"] - volume_commands["VolumeDown"];
            zones[1] = zones[1] + change;
            harmony=JSON.stringify([{"device":"Amplituner","button":vol_commands_arr[0]},{"device":"Amplituner","button":vol_commands_arr[1]},{"device":"Amplituner","button":vol_commands_arr[2]}]);
            $('input[type=range]#Volume'+device).val(zones[1]);
            showVolume("Volume"+device);
            communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
            volume_commands = {VolumeUp:0,VolumeDown:0};
            vol_commands_arr.splice(0,vol_commands_arr.length);      
            clicks = 0;           
        }
    })
    .on("dblclick", function(e){
        e.preventDefault();
    });
});

/*
Bathroom (Zone2) infrared remote VolumeUp and VolumeDown commands.
Handled by RESTful Harmony API by BWS Systems(http://www.bwssystems.com, https://github.com/bwssytems). 
Bathroom is a device defined in Logitech Harmony Hub.
FEATURE: up to triple press covered.
WARNING: remember to provide actual RESTful Harmony server IP with port.
*/

$(function() {
    $("div#Bathroom a#VolumeUp, div#Bathroom a#VolumeDown").on("click", function(e) {
        var single_command = $(this).attr('id');
            device = findDevice($(this));
            change = 0;
            param_string = "", harmony = "";
        
        //Tablica z licznikiem klikniêæ VolumeUp i VolumeDown:
        volume_commands[single_command]++;
        //Tablica z komendami do przes³ania do obiektu harmony:
        vol_commands_arr[clicks++] = single_command;
        if (clicks === 1) {
            timer = setTimeout(function() {
                change = volume_commands["VolumeUp"] - volume_commands["VolumeDown"];
                zones[3] = zones[3] + change;
                harmony=JSON.stringify({"device":"Bathroom","button":vol_commands_arr[0]});
                $('input[type=range]#VolumeBathroom').val(zones[3]);
                showVolume("VolumeBathroom");
                communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
                volume_commands = {VolumeUp:0,VolumeDown:0};
                vol_commands_arr.splice(0,vol_commands_arr.length);      
                clicks = 0;
            },delay);
        } 
        else if (clicks === 2) {
            clearTimeout(timer);
            timer = setTimeout(function() {
                change = volume_commands["VolumeUp"] - volume_commands["VolumeDown"];
                if (change != 0) {
                    zones[3] = zones[3] + change;
                    harmony=JSON.stringify([{"device":"Bathroom","button":vol_commands_arr[0]},{"device":"Bathroom","button":vol_commands_arr[1]}]);
                    $('input[type=range]#VolumeBathroom').val(zones[3]);
                    showVolume("VolumeBathroom");
                }
                communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
                volume_commands = {VolumeUp:0,VolumeDown:0};
                vol_commands_arr.splice(0,vol_commands_arr.length);          
                clicks = 0;
            }, delay);
        }
        else {
            clearTimeout(timer);
            change = volume_commands["VolumeUp"] - volume_commands["VolumeDown"];
            zones[3] = zones[3] + change;
            harmony=JSON.stringify([{"device":"Bathroom","button":vol_commands_arr[0]},{"device":"Bathroom","button":vol_commands_arr[1]},{"device":"Bathroom","button":vol_commands_arr[2]}]);
            $('input[type=range]#VolumeBathroom').val(zones[3]);
            showVolume("VolumeBathroom");
            communicateREST("http://<RESTful Harmony IP>:<RESTful Harmony port>/harmony/press","PUT",harmony,null,true);
            volume_commands = {VolumeUp:0,VolumeDown:0};
            vol_commands_arr.splice(0,vol_commands_arr.length);      
            clicks = 0;           
        }
    })
    .on("dblclick", function(e){
        e.preventDefault();
    });
});

/*
Volume Sliders for ONKYO AVR Main, Zone2 and Zone3 (currently disabled). 
Handled by PHP script over LAN using Onkyo eISCP Control library by Michael Elsdörfer (http://blog.elsdoerfer.name,
https://github.com/miracle2k) as Harmony provides neither response status with power and volume, nor setting exact volume levels.
*/

$(function() { 
    $('input[type=range].mySlider[id*="Volume"]').on("change",function() {
        switch (this.id) {
            case "VolumeAmplituner":
            case "VolumeUPC":
            case "VolumeMediaPlayer":
            case "VolumePlayStation":
                if (zones[0] == 1) {
                    param_string = "command=main.volume:"+($(this).val());
                    zones[1] = Number($(this).val());
                    setVolume(param_string);
                }
            break;
            case "VolumeBathroom":
                if (zones[2] == 1) {
                    param_string = "command=zone2.volume:"+($(this).val());
                    zones[3] = Number($(this).val());
                    setVolume(param_string);
                }
            break;
            /*
            case "VolumeZone3":
                if (zones[4] == 1) {
                    param_string = "command=zone3.volume:"+($(this).val());
                    zones[5] = $(this).val();
                    setVolume(param_string);
                }
            break;
            */
        }
    })
    .on("input", function() {
        showVolume(this.id);
    });
});

/*Handling RF devices through RFXtrx transceiver. Orginally they were set up as Node.js server connections exploiting node-rfxcom library 
- that's an alternative I kept "commented" in code. In current version RFXtrx transceiver as well as RF devices are set up in Domoticz 
in order to secure Apple Home Kit compatibility via Homebridge.
WARNING: remember to provide actual Domoticz server IP with port and base64 encoded Domoticz credentials in JSON format, 
sample credentials http header: ,{"Authorization":"Basic <base64 encoded login:password>"}.
*/

$(function() {
    //$("#NodeJSConnections a").click(function() {
    $("#DomoticzConnections a").click(function() {
        var single_command = $(this).attr('id');
            domoticz = "<Domoticz server IP:Domoticz server port>/json.htm?"
            
	    domoticz += DomoticzCommands[single_command];
	    communicateREST(domoticz,"GET",null,null,true,{"Authorization":"Basic <base64 encoded login:password>"});
	    //param_string = "<Home Node.js server IP>:<Home Node.js server port>/"+single_command;
	    //communicateNodeJSServer(param_string);
	    if (single_command.includes("ListwaOn")) {
            setTimeout(checkAmplituner,45000,"PHP/AmplitunerCheck.php");
        //Below line is specifically for my home devices - as my RF power strip is powered on, my Media Player also 
        //automatically powers on, below command shuts it down to standby mode.
            setTimeout(communicateREST,65000,"<RESTful Harmony server IP>:<RESTful Harmony server port>/harmony/press","PUT",'{"device":"MediaPlayer","button":"PowerToggle"}',null,true);
        }
        if (single_command.includes("ListwaOff")) {
            zones[0]=0;
            zones[1]=0;
            zones[2]=0;
            zones[3]=0;
            /*
            zones[4]=0;
            zones[5]=0;
            */
            strip_on = false;
            document.getElementById('Kamera').setAttribute('href','PHP/Cam_v2.php?strip_on='+strip_on);
            $("#nav a:not(.active,#Kamera)").addClass('transparent');
        }
    });
});

/*PowerToggle buttons for lighting, handled by Philips Hue bridge and Fibaro Home Center 2 and thei APIs. Buttons show status 
of respective lighting (On: red color, Off: yellow). When dimmable/color adjustable lighting is powered on, a color picker 
panel opens. Multiple lighting can be selected to send unified color picker commands to.
Procedure below is highly tailored to my needs with grouping of several Hue bulbs.
WARNING: remember to provide actual Hue bridge and Fibaro HC2 IPs with ports as well as Hue bridge user ID.*/

$(function() {
    $("#LampyZasilanie a").click(function() {
	    var position = this.id.search(/[0-9]/);
            lamp_id = Number(this.id.slice(position));
            lighting_protocol = this.id.slice(0,position);
    
        if (lights[lamp_id]) {
            switch (lamp_id) {
                case 1:
                case 4:
                case 9:
                    lights[lamp_id+1] = 0;
                    lights[lamp_id+2] = 0;
                    communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+(lamp_id+1)+"/state","PUT",'{"on": false}',null,true);
                    communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+(lamp_id+2)+"/state","PUT",'{"on": false}',null,true);
                    if (lamp_id == 9) {
                        lights[lamp_id+3] = 0;
                        lights[lamp_id+4] = 0;
                        communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+(lamp_id+3)+"/state","PUT",'{"on": false}',null,true);
                        communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+(lamp_id+4)+"/state","PUT",'{"on": false}',null,true);
                    }
                break;
            }
            lights[lamp_id] = 0;
            if (lighting_protocol == "Lampy") {
                communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+lamp_id+"/state","PUT",'{"on": false}',null,true);
            } else {
                communicateREST("/PHP/ba-simple-proxy.php?url=<Fibaro HC2 IP>:<Fibaro HC2 port>/api/devices/"+lamp_id+"/action/turnOff","POST",'{1}',null,true);
            }
            if (!lights.some(checkAnyLampOn)) {
                any_lamp_on = false;
            }
        } else {
            switch (lamp_id) {
                case 1:
                case 4:
                case 9:
                    lights[lamp_id+1] = 1;
                    lights[lamp_id+2] = 1;
                    communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+(lamp_id+1)+"/state","PUT",'{"on": true}',null,true);
                    communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+(lamp_id+2)+"/state","PUT",'{"on": true}',null,true);
                    if (lamp_id == 9) {
                        lights[lamp_id+3] = 1;
                        lights[lamp_id+4] = 1;
                        communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+(lamp_id+3)+"/state","PUT",'{"on": true}',null,true);
                        communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+(lamp_id+4)+"/state","PUT",'{"on": true}',null,true);
                    }
                break;
            }
            lights[lamp_id] = 1;
            if (lighting_protocol == "Lampy") {
                communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+lamp_id+"/state","PUT",'{"on": true}',null,true);
            } else {
                communicateREST("/PHP/ba-simple-proxy.php?url=<Fibaro HC2 IP>:<Fibaro HC2 port>/api/devices/"+lamp_id+"/action/turnOn","POST",'{1}',null,true);
            }
            any_lamp_on = true;
        }
        toggleLamp(this.id,lighting_protocol);
        showLampPanel();
    });
});

/*Brightness slider handler for dimmable Hue and Fibaro lighting*/

$(function() {
    $('input[type=range].BriSlider').on("change",function() {
        var param_hue = JSON.stringify({"bri": Number($(this).val())});
            bri_fibaro = Math.round(Number($(this).val()) / 254 * 100);
            param_fibaro = {p0: bri_fibaro};
        
        setLampBuffer(lights);
        setLamps(param_hue,param_fibaro,"setBrightness");
    });
});

/*White temeprature slider handler for Hue lighting and White color value for Fibaro RGBW*/

$(function() {
    $('input[type=range].CTSlider').on("change",function() {
        var param_hue = JSON.stringify({"ct": Number($(this).val())});
            white_fibaro = Math.round((500 - Number($(this).val())) / 347 * 255);
            param_fibaro = {p0: 0, p1: 0, p2: 0, p3: white_fibaro};
        
        setLampBuffer(lights);
        setLamps(param_hue,param_fibaro,"setColor");
    });
});

/*Thermostat manual temperature adjustment slider handler for z-wave thermostats. After temperature is modified, 
a second slider appears which covers timer for manual adjustment.
WARNING: remember to provide actual Fibaro HC2 IP with port.*/

$(function() {
    $('input[type=range].mySlider[id*="Temperatura"]').on("change",function() {
        var thermostat_id = this.id.slice(11);
            new_ts = Date.now() / 1000 + 900;
            param_fibaro = {};
        
        thermostats[thermostat_id][1] = Number($(this).val());
        thermostats[thermostat_id][2] = Math.round(new_ts);
        $('input[type=range]#TempTimer'+thermostat_id).val(0.25);
        timer_caption = setCaption(0,15);
        showTemperature(thermostat_id);
        showTimer(thermostat_id,timer_caption);
        showCountDown(thermostat_id);
        param_fibaro = param_fibaro = {p0: thermostats[thermostat_id][1]};
        communicateREST("/PHP/ba-simple-proxy.php?url=<Fibaro HC2 IP>:<Fibaro HC2 port>/api/devices/"+thermostats[thermostat_id][0]+"/action/setTargetLevel","POST",param_fibaro,null,true);
        param_fibaro = param_fibaro = {p0: thermostats[thermostat_id][2]};
        communicateREST("/PHP/ba-simple-proxy.php?url=<Fibaro HC2 IP>:<Fibaro HC2 port>/api/devices/"+thermostats[thermostat_id][0]+"/action/setTime","POST",param_fibaro,null,true);
        $("div#ThermostatTimerSettings"+thermostat_id).css("display","block");
    })
    .on("input", function() {
        var thermostat_id = this.id.slice(11);
        
        showTemperature(thermostat_id);
    });
});

/*Thermostat manual adjustment timer slider handler for z-wave thermostats.
WARNING: remember to provide actual Fibaro HC2 IP with port.*/

$(function() {
    $('input[type=range].mySlider[id*="TempTimer"]').on("change",function() {
        var hours, minutes;
            thermostat_id = this.id.slice(9);
            val = $(this).val();
            new_ts = Date.now() / 1000 + Number($(this).val()) * 3600;
        
        thermostats[thermostat_id][2] = Math.round(new_ts);
        hours = Math.floor(val);
        minutes = (val - hours) * 60;
        timer_caption = setCaption(hours,minutes);
        showTimer(thermostat_id,timer_caption);
        showCountDown(thermostat_id);
        param_fibaro = param_fibaro = {p0: thermostats[thermostat_id][2]};
        communicateREST("/PHP/ba-simple-proxy.php?url=<Fibaro HC2 IP>:<Fibaro HC2 port>/api/devices/"+thermostats[thermostat_id][0]+"/action/setTime","POST",param_fibaro,null,true);
    })
    .on("input", function() {
        var hours, minutes;
            thermostat_id = this.id.slice(9);
            val = $(this).val();
            
        hours = Math.floor(val);
        minutes = (val - hours) * 60;
        timer_caption = setCaption(hours,minutes);
        showTimer(thermostat_id,timer_caption);
    });
});

/*Scenes panel button handling. Currently only scenes are Harmony Activities handled by RESTful Harmony API by BWS Systems
(http://www.bwssystems.com, https://github.com/bwssytems).
WARNING: remember to provide actual RESTful Harmony server IP with port.*/

$(function() {
    $("#Sceny a").click(function() {
        var activity = this.id;
            harmony = "";
        
        harmony=JSON.stringify({"activityid":HarmonyActivities[activity]});
        communicateREST("<RESTful Harmony server IP>:<RESTful Harmony server port>/harmony/start","PUT",harmony,null,false); 
        
        checkAmplituner("PHP/AmplitunerCheck.php");
        checkLampArray();
    });
});
