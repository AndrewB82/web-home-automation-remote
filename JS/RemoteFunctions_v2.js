/*Global variables and functions of the project*/


// Variable used for counting of multiple button presses
var delay = 700;

//  Button press counter
    clicks = 0; 

//  Multiple button press timer
    timer = null; 

//  Multiple button press command array  
    
    commands_arr = []; 

//  Multiple button press volume command array
    vol_commands_arr = []; 

//  Zones power and volume status array
    zones = [];

//  Volume commands multiple press counters
    volume_commands = {VolumeUp:0,VolumeDown:0};

//  Lighting power status array
    lights = [];

//  Selected lights buffer array
    lamp_buffer = [];

//  Thermostats associative array
    thermostats = {};

//  Flag for checking if any lamp is on
    any_lamp_on = false;

//  Object for storing http response from Philips Hue bridge and Fibaro Home Center 2.
    RESTresponse = {}; 

//  Object for holding ColorPicker instance
    pick = {}; 

//  Object for storing ColorCursor instance
    curs = {};
    
//  Current timestamp:
    current_ts = Date.now() / 1000;
    
//  Flag for checking if media center RF power strip is on  
    strip_on = false, 

//  Variable for storing target panel chosen from Cam_v2.php script
    target_link = "";

//  HA bridge hue user id obtained for HA bridge communication
    hue_user = "";

//  Domoticz commands map (key: address bar parameter, value: Domoticz parameter to be sent)
    DomoticzCommands = {
        ListwaOn: "type=command&param=switchlight&idx=5&switchcmd=On",
        ListwaOff: "type=command&param=switchlight&idx=4&switchcmd=Off",
        NawilzaczOn: "type=command&param=switchlight&idx=80&switchcmd=On",
        NawilzaczOff: "type=command&param=switchlight&idx=80&switchcmd=Off",
        Rolety1Open: "type=command&param=switchlight&idx=1&switchcmd=Off",
        Rolety1Close: "type=command&param=switchlight&idx=1&switchcmd=On",
        Rolety1Stop: "type=command&param=switchlight&idx=1&switchcmd=Stop",
        Rolety2Open: "type=command&param=switchlight&idx=2&switchcmd=Off",
        Rolety2Close: "type=command&param=switchlight&idx=2&switchcmd=On",
        Rolety2Stop: "type=command&param=switchlight&idx=2&switchcmd=Stop",
        Rolety3Open: "type=command&param=switchlight&idx=3&switchcmd=Off",
        Rolety3Close: "type=command&param=switchlight&idx=3&switchcmd=On",
        Rolety3Stop: "type=command&param=switchlight&idx=3&switchcmd=Stop",
        Rolety0Open: "type=command&param=switchscene&idx=3&switchcmd=On",
        Rolety0Close: "type=command&param=switchscene&idx=2&switchcmd=On",
        Rolety0Stop: "type=command&param=switchscene&idx=4&switchcmd=On"
    };

//  Harmony Activities map (key address bar parameter, value: Harmony Activity name to be sent)
    HarmonyActivities = {
        "TV":"Watch TV",
        "Movies":"Watch Movies",
        "Chromecast":"Watch Chromecast",
        "PS4":"Start PlayStation",
        "Bluetooth":"Listen to Bluetooth Streaming",
        "Radio":"Listen to Internet Radio",
        "Bathroom":"Listen to Bathroom Speakers",
        "Netflix":"Watch Netflix",
        "FIFA":"Play FIFA",
        "Legia":"Watch Legia"
    };

/*Function for communicatig Home Node.js server, partially deprecated, since at first the server was used 
to handle RF device. As they were switched to Domoticz server, Node.js server is now used only for handling
PS4 PowerOn, PowerOff and start Netflix and FIFA18 commands.*/ 

function communicateNodeJSServer(path) {
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function() {
    /*
        if (this.readyState == 4 && this.status == 200) {
        }
    */
    };    
    xmlhttp.open("GET",path,true);
    xmlhttp.send();
    
    /*Below line is specifically for my home devices - as my RF power strip is powered on, 
    my Media Player also automatically powers on, below command shuts it down to standby mode.*/

    if (path.includes("ListwaOn")) {
        setTimeout(checkAmplituner,45000,"PHP/AmplitunerCheck.php");
        setTimeout(communicateREST,65000,"<RESTful Harmony server IP>:<RESTful Harmony server port>/harmony/press","PUT",'{"device":"MediaPlayer","button":"PowerToggle"}',null,true);
    }
    if (path.includes("ListwaOff")) {
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
        $("#nav a:not(.active,#Kamera,#Odśwież)").addClass('transparent');
    }
}

/*Function for polling AVR for power and volume status of each zone and parsing it.*/

function checkAmplituner(path) {
    var zones_str = ""; str_array=[];
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText.startsWith("TX")) {
                strip_on = true;
                document.getElementById('Kamera').setAttribute('href','PHP/Cam_v2.php?strip_on='+strip_on);
                $("#nav a:not(.active,#Kamera,#Odśwież)").removeClass('transparent');
                zones_str = this.responseText.trim();
                zones_str = zones_str.replace(/on/g,"1");
                zones_str = zones_str.replace(/standby,off/g,"0");
                zones_str = zones_str.replace(/standby/g,"0");
                if (zones_str.search("N\/A") > 0) {
                    zones[2] = 0;
                } else {
                    zones[2] = 1;
                }
                zones_str = zones_str.replace(/N\/A/g,"0");
                zones_str = zones_str.slice(10);
                zones_str = zones_str.slice(0,zones_str.indexOf("TX"))+" "+zones_str.slice(zones_str.indexOf("TX"),zones_str.lastIndexOf("TX"))+" "+zones_str.slice(zones_str.lastIndexOf("TX"));
                str_array = zones_str.split(" "); 
                zones[0] = Number(str_array[2]);
                zones[1] = Number(str_array[6]);
                zones[3] = Number(str_array[10]);
                if (zones[1] > 60) {
                    zones[1] = 60;
                }
                if (zones[3] > 60) {
                    zones[3] = 60;
                }
                /*
                if (zones[5] > 60) {
                    zones[5] = 60;
                }
                */
            } else {
                strip_on = false;
                document.getElementById('Kamera').setAttribute('href', 'PHP/Cam_v2.php?strip_on='+strip_on);
                $("#nav a:not(.active,#Kamera,#Odśwież)").addClass('transparent');
                zones[0]=0;
                zones[1]=0;
                zones[2]=0;
                zones[3]=0;
                /*
                zones[4]=0;
                zones[5]=0;
                */
            }
        }
    };
    xmlhttp.open("GET",path,false);
    xmlhttp.send();
}

/*Function for setting active panel from top navigation bar.*/

function setActiveLink(setActive) {
    var currActive = $(".active").attr('id');
    $("div#"+currActive).css("display","none");
    $("#nav .active").removeClass('active');
    $("a#"+setActive+":first").addClass('active');
    $("div#"+setActive).css("display","block");
    if (setActive == "Amplituner") {
        $('input[type=range]#Volume'+setActive).val(zones[1]);
        if (zones[0] == 1) {
            $("div#Amplituner a#MainPower").addClass('active');
        }
        if (zones[2] == 1) {
            $("div#Amplituner a#Bathroom").addClass('active');
	        $("div#Bathroom").css("display","block");
	        $('input[type=range]#VolumeBathroom').val(zones[3]);
	        showVolume("VolumeBathroom");
        }
        /*
        if (zones[4] == 1) {
            $("div#Amplituner a#Zone3").addClass('active');
	        $("div#Zone3").css("display","block");
	        $('input[type=range]#VolumeZone3').val(zones[5]);
	        showVolume("VolumeZone3");
	    }
	    */
    } else {
        $('input[type=range]#Volume'+setActive).val(zones[1]);
    }
    showVolume("Volume"+setActive);
}

/*Function for sending commands to AVR over LAN using Onkyo eISCP Control library by Michael Elsdörfer
(http://blog.elsdoerfer.name, https://github.com/miracle2k). Most of them are deprecated in current version
in favor of RESTful Harmony API by BWS Systems(http://www.bwssystems.com, https://github.com/bwssytems).
Only Zone 2 powering toggle is using the function now.*/

function sendMultiCommands(commands) {
    var com = commands.substr(commands.lastIndexOf("=")+1);
    var xmlhttp = new XMLHttpRequest();
    
    switch (com) {
        case "LazienkaOn":
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    response_str = this.responseText.trim();
                    response_str = response_str.substr(response_str.lastIndexOf(" "));
                    zones[3] = response_str.trim();
                    if (zones[3] > 60) {
                        zones[3] = 60;
                    }
                    $('input[type=range]#VolumeBathroom').val(zones[3]);
                    zones[3] = Number(zones[3]);
                    showVolume("VolumeBathroom");
                }
            };
            xmlhttp.open("GET","PHP/SendCommands_v2.php?"+commands,false);
            break;
        /*
        case "Zone3On":
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    response_str = this.responseText.trim();
                    response_str = response_str.substr(response_str.lastIndexOf(" "));
                    zones[zone_selector] = response_str.trim();
                    if (zones[5] > 60) {
                        zones[5] = 60;
                    }
                    $('input[type=range]#VolumeZone3').val(zones[5]);
                    showVolume("VolumeZone3");
                }
            };
            xmlhttp.open("GET","PHP/SendCommands.php?"+commands,false);
            break;
        */
        default:
            xmlhttp.open("GET","PHP/SendCommands_v2.php?"+commands,true);
    }
    xmlhttp.send();
}

/*Function for level presentation on website slider.*/

function showVolume(volume){
    var val = $("input[type=range]#"+volume).val();
        output  = $("span#"+volume);
 
    output.html(val);
}

/*Function for setting Specified Volume level on AVR over LAN using Onkyo eISCP Control library by Michael Elsdörfer
(http://blog.elsdoerfer.name, https://github.com/miracle2k). Most of them are deprecated in current version
in favor of RESTful Harmony API by BWS Systems(http://www.bwssystems.com, https://github.com/bwssytems).*/

function setVolume(command) {
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.open("GET","PHP/SetVolume.php?"+command,true);
    xmlhttp.send();
}

/*Function for indentyfying the device that the pressed button represents.*/

function findDevice(my_button) {
   return my_button.parent().parent().parent().attr('id');
}

/*Function for setting AVR zone active: coloring Power button, opening/closing other zones subpanels.*/

function toggleZone(zonePower) {
    if (zonePower == "MainPower") {
        if (zones[0] == 1) {
            $("div#Amplituner a#"+zonePower).addClass('active');
        }
        else {
            $("div#Amplituner a#"+zonePower).removeClass('active');
        }
    } else {
        if ($("div#"+zonePower).css("display") == "block") {
	            $("div#Amplituner a#"+zonePower).removeClass('active');
	            $("div#"+zonePower).css("display","none");
        }
        else {
                $("div#Amplituner a#"+zonePower).addClass('active');
	            $("div#"+zonePower).css("display","block");
        }
    }  
}

/*Function for polling Phillips Hue Bridge and Fibaro HC2 for devices status and populating lights array.
WARNING: remember to provide actual Hue bridge and Fibaro HC2 IPs with ports as well as Hue bridge user ID.*/

function checkLampArray() {
    communicateREST("<Hue bridge IP>/api/<Hue bridge user id>/lights","GET","",RESTcallback,false);
    for (x in RESTresponse) {
        if (RESTresponse[x]["state"]["on"]) {
            lights[x] = 1;
        } else {
            lights[x] = 0;
        }
        toggleLamp("Lampy"+x,"Lampy");
    }
    emptyObject(RESTresponse);
    communicateREST("/PHP/ba-simple-proxy.php?url=<Fibaro HC2 IP>:<Fibaro HC2 port>/api/devices","GET","",RESTcallback,false);
    lights[23] = Number((RESTresponse["contents"][1]["properties"]["value"] === "true") || (Number(RESTresponse["contents"][1]["properties"]["value"]) > 0));
    toggleLamp("Fibaro23","Fibaro");
    lights[36] = Number((RESTresponse["contents"][2]["properties"]["value"] === "true") || (Number(RESTresponse["contents"][2]["properties"]["value"]) > 0));
    toggleLamp("Fibaro36","Fibaro");
    if (!lights.some(checkAnyLampOn)) {
        any_lamp_on = false;
    } else {
        any_lamp_on = true;
    }
}

/*Callback function for storing http request response in object variable.*/

function RESTcallback(result) {
    RESTresponse = result;
}

/*Function for communicating with most APIs in the project through http AJAX request.*/

function communicateREST(path,request_method,command,cb,sync,additional_headers) {  
    $.ajax({
        dataType: "json",
        headers: additional_headers,
        url: path,
        data: command,
        type: request_method,
        success: cb,
        async: sync
    });
}

/*Check function if any light at home is powered, lamp is an array variable.*/

function checkAnyLampOn(lamp) {
    return lamp;
}

/*Function for setting lighting items active: coloring Power button, enabling/disabling checkboxes 
for multiple item command sending.*/

function toggleLamp(lampPower,protocol) {
    var position = lampPower.search(/[0-9]/);
        lamp_id = Number(lampPower.slice(position));
    
    if (!lights[lamp_id]) {
        $("#LampyZasilanie a#"+lampPower).removeClass('active');
	    $("input[type=checkbox].css-checkbox#"+protocol+"Checkbox"+lamp_id+" + label.css-label").addClass('transparent');
        $("input[type=checkbox].css-checkbox#"+protocol+"Checkbox"+lamp_id).prop("disabled",true);
    } else {
        $("#LampyZasilanie a#"+lampPower).addClass('active');
	    $("input[type=checkbox].css-checkbox#"+protocol+"Checkbox"+lamp_id+" + label.css-label").removeClass('transparent');
        $("input[type=checkbox].css-checkbox#"+protocol+"Checkbox"+lamp_id).prop("disabled",false);
    }
}

/*Function for opening/closing Lamp panel if any of adjustable lighting items is powered on.*/

function showLampPanel() {
    if (!any_lamp_on) {
        $("div#Lampy").css("display","none");
        if (!jQuery.isEmptyObject(curs)) {
			curs.canvas.getContext('2d').clearRect(0, 0, curs.canvas.width, curs.canvas.height);
		}
    } else {
        // Specific condition excluding Fibaro switch light from checking if any adjustable lighting item is switched on
        if (lights[36]) {
            lights[36] = 0;
            if (lights.some(checkAnyLampOn)) {
                $("div#Lampy").css("display","block");
                if (jQuery.isEmptyObject(pick)) {
	                pick = new ColorPicker(document.querySelector('.color-space'));
                    curs = new ColorCursor(document.querySelector('.color-space'));
                }
            } else {
                $("div#Lampy").css("display","none");
                if (!jQuery.isEmptyObject(curs)) {
			        curs.canvas.getContext('2d').clearRect(0, 0, curs.canvas.width, curs.canvas.height);
		        }
            }
            lights[36] = 1;
	    } else {
	        $("div#Lampy").css("display","block");
            if (jQuery.isEmptyObject(pick)) {
	            pick = new ColorPicker(document.querySelector('.color-space'));
                curs = new ColorCursor(document.querySelector('.color-space'));
            }
	    }   
    }
}

/*Function for checking which lighting items are selected to send command to from lamp panel and populating buffer array.
Function is strongly tailored to my needs - some of my Hue lights are grouped so they follow behaviour of
first lamp in the group and therefore are stored in passed_lights array.*/

function setLampBuffer(lamps) {
    var lampslen = lamps.length;
        protocol = "";
        buffer_index = 0;
        /*Hue lights passed due to grouping (1 - living room "leading" bulb, therefore 2 and 3 are omitted, and so on: 
        4 - Kids Room "leading" bulb, 9 - Kitchen "leading" bulb).*/
        passed_lights = [2,3,5,6,10,11,12,13];
    
    lamp_buffer.splice(0,lamp_buffer.length);
    for (i = 1; i < lampslen; i++) {
        if (passed_lights.indexOf(i) > -1) {
            continue;
        }
        if ($("#LampyCheckbox"+i)[0] !== undefined) {
            protocol = "#LampyCheckbox";
        } else if ($("#FibaroCheckbox"+i)[0] !== undefined) {
            protocol = "#FibaroCheckbox";
        }
        else {
            protocol = null;
        }   
        if ((lamps[i] == 1) && (protocol != undefined) && ($(protocol+i)[0].checked === true)) {
            lamp_buffer[buffer_index++] = i;
        }
    }
}

/*Function for sending commands to lights with checkboxes selected in lamp panel (and therefore
stored in lamp_buffer variable).
Again, it is strongly tailored to my home setup (lights grouping, only one Fibaro item that is fixed set).
WARNING: remember to provide actual Hue bridge and Fibaro HC2 IPs with ports as well as Hue bridge user ID.*/

function setLamps(hue,fibaro,fibaro_action) {
        var bufferlen = lamp_buffer.length;
        
        for (i = 0; i < bufferlen; i++) {
             switch (lamp_buffer[i]) {
                case 1:
                case 4:
                case 9:
                    communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+(lamp_buffer[i]+1)+"/state","PUT",hue,null,true);
                    communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+(lamp_buffer[i]+2)+"/state","PUT",hue,null,true);
                    if (lamp_buffer[i] == 9) {
                        lights[lamp_id+3] = 1;
                        lights[lamp_id+4] = 1;
                        communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+(lamp_buffer[i]+3)+"/state","PUT",hue,null,true);
                        communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+(lamp_buffer[i]+4)+"/state","PUT",hue,null,true);
                    }
                break;
            }
            if (lamp_buffer[i] != 23) {
                communicateREST("<Hue bridge IP>/api/<Hue bridge user ID>/lights/"+lamp_buffer[i]+"/state","PUT",hue,null,true);
            } else {
                communicateREST("/PHP/ba-simple-proxy.php?url=<Fibaro HC2 IP>:<Fibaro HC2 port>/api/devices/23/action/"+fibaro_action,"POST",fibaro,null,true);
            }
        }
}

/*Function for emptying object passed as parameter.*/

function emptyObject(obj) {
    Object.keys(obj).forEach(function(k) { 
        delete obj[k]
    })
}

/*Function for formatting caption for thermostat timer slider.*/

function setCaption(hh,mm) {
    if (hh > 0) {
        return hh+" godz. "+mm+" min";
    } else {
        return mm+" m";
    }    
}

/*Function for setting HTML caption for thermostat temperature level set.*/

function showTemperature(thermostat) {
    showVolume("Temperatura"+thermostat);
    $('span#Temperatura'+thermostat).append(String.fromCharCode(176)+"C");
}

/*Function for setting HTML caption for thermostat timer slider.*/

function showTimer(thermostat,caption) {
    var output  = $("span#TempTimer"+thermostat);
        
    output.html(caption);
}

/*CountDown function with small amendments using code from W3schools: 
https://www.w3schools.com/howto/howto_js_countdown.asp .
WARNING: remember to provide actual Fibaro HC2 IP with port.*/

function showCountDown(thermostat) {
    var interv = setInterval(CountDown,1000,thermostat);
    
    function CountDown(thermostat) {

        // Get todays date and time
        var now = new Date().getTime() / 1000;

        // Find the distance between now an the count down date
        var distance = thermostats[thermostat][2] - now;

        var hours = Math.floor(distance / 3600);
        var minutes = Math.floor((distance - (hours * 3600)) / 60);
        var seconds = Math.floor((distance - (hours * 3600) - (minutes * 60)));

        document.getElementById("CountDown"+thermostat).innerHTML = hours + " h "+ minutes + " m " + seconds + " s";

        if (distance < 0) {
            $("div#ThermostatTimerSettings"+thermostat).css("display","none");
            clearInterval(interv);
            communicateREST("/PHP/ba-simple-proxy.php?url=<Fibaro HC2 IP>:<Fibaro Hc2 port>/api/devices/"+thermostats[thermostat][0],"GET","",RESTcallback,false);
            thermostats[thermostat][1] = Number(RESTresponse["contents"]["properties"]["targetLevel"]);
            emptyObject(RESTresponse);
            $('input[type=range]#Temperatura'+thermostat).val(thermostats[thermostat][1]);
            showTemperature(thermostat);
        }
    }
}

/*Function for initial displaying thermostat temperature and manual adjustment timer.*/

function displayThermostat(thermostat) {
    var hours, minutes, minutes_fraction, minutes_fraction_rounded, slider_value, interv;
        slider_caption = "";
        
    if ((time_difference = thermostats[thermostat][2] - current_ts) > 0) {
        hours = Math.floor(time_difference / 3600);
        minutes = Math.floor((time_difference - (hours * 3600)) / 60);
        minutes_fraction = minutes / 60;
        minutes_fraction_rounded = (Math.round(minutes_fraction * 4) / 4).toFixed(2);
        slider_value = hours + Number(minutes_fraction_rounded);
        $('input[type=range]#TempTimer'+thermostat).val(slider_value);
        slider_caption = setCaption(Math.floor(slider_value),(slider_value - Math.floor(slider_value))*60);
        $("div#ThermostatTimerSettings"+thermostat).css("display","block");
        showTimer(thermostat,slider_caption);
        showCountDown(thermostat);
    }    
    showTemperature(thermostat);    
}

/*Function for getting parameter from URL. Credit to: http://www.jquerybyexample.net/ ,
http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html */

function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

/*Below two functions for handling camera live view, credited to the Mad Hermit: http://www.themadhermit.net, 
http://www.themadhermit.net/how-to-embed-video-from-your-foscam-fi9821w-wireless-camera-into-your-web-page/
WARNING: remember to provide actual camera IP with port and camera login credentials, 
Foscam "GUEST" privilleges are sufficient here.*/

function reload()
{
   setTimeout('reloadImg("refresh")',100)
};

function reloadImg(id) 
{ 
   var obj = document.getElementById(id); 
   var date = new Date(); 
   obj.src = "<Foscam camera IP>:<Foscam camera port>/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=<Foscam camera login>&pwd=<Foscam camera password>&t=" + Math.floor(date.getTime()/1000); 
} 
