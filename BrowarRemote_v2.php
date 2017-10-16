<!DOCTYPE html>
<!--
Main site of the project, covering most panels:
- "Dom" - Polish word for "Home" - here user can control RF Devices, namely entertainment center power strip, window blinds and 
tested smart socket, as well as Philips Hue and z-wave lighting and z-wave theromostats; it is the default panel opened when 
the app is initiated,
- "Amplituner" - AVR remote with multizone covered (second zone - Bathroom - and third zone are opened when activated, third zone
not implemented currently),
- "UPC" - cable TV service remote,"Media Player" - media player remote,
- "TV" - remote with only TV power toggle implemented, as other media operations are handled by AVR,
- "PS4" - Sony Plasystation 4 remote with Power On, Power Off, and PS button long press included,
- "Sceny" - Polish word for "Scenes" - currrently starting of Harmony Activities is implemented.
- "Odśwież" - Polish word for "Refresh" - site refresh feature.
-->

<html>
<head>
<title>Browar Remote</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="stylesheet" type="text/css" href="CSS/HA.css">
<link rel="shortcut icon" href="Graphics/favicon.ico" type="image/x-icon"/>
<link rel="apple-touch-icon" href="Graphics/apple-touch-icon.png"/>
<link rel="apple-touch-icon" sizes="57x57" href="Graphics/apple-touch-icon-57x57.png"/>
<link rel="apple-touch-icon" sizes="72x72" href="Graphics/apple-touch-icon-72x72.png"/>
<link rel="apple-touch-icon" sizes="76x76" href="Graphics/apple-touch-icon-76x76.png"/>
<link rel="apple-touch-icon" sizes="114x114" href="Graphics/apple-touch-icon-114x114.png"/>
<link rel="apple-touch-icon" sizes="120x120" href="Graphics/apple-touch-icon-120x120.png"/>
<link rel="apple-touch-icon" sizes="144x144" href="Graphics/apple-touch-icon-144x144.png"/>
<link rel="apple-touch-icon" sizes="152x152" href="Graphics/apple-touch-icon-152x152.png"/>
<link rel="apple-touch-icon" sizes="180x180" href="Graphics/apple-touch-icon-180x180.png"/>
// Inline script below by and credited to Irae Carvalho (https://github.com/irae):
<script>(function(a,b,c){if(c in b&&b[c]){var d,e=a.location,f=/^(a|html)$/i;a.addEventListener("click",function(a){d=a.target;while(!f.test(d.nodeName))d=d.parentNode;"href"in d&&(chref=d.href).replace(e.href,"").indexOf("#")&&(!/^[a-z\+\.\-]+:/i.test(chref)||chref.indexOf(e.protocol+"//"+e.host)===0)&&(a.preventDefault(),e.href=d.href)},!1)}})(document,window.navigator,"standalone");</script>
<script src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
<script src="JS/RemoteFunctions_v2.js"></script>
<script src="JS/RemoteEvents_v2.js"></script>
<script src="JS/CIERGBConverter.js"></script>
<script src="JS/ColorPicker.js"></script>
</head>
<body>
<ul id="nav" class="menu section">
    <li class="col-4"><a id="Amplituner" class="myButtonYellow">Amplituner</a></li>
    <li class="col-4"><a id="UPC" class="myButtonYellow">UPC</a></li>	
    <li class="col-4"><a id="MediaPlayer" class="myButtonYellow">Media Player</a></li>
    <li class="col-4"><a id="TV" class="myButtonYellow">TV</a></li>
    <li class="col-4"><a id="PlayStation" class="myButtonYellow">PS4</a></li>
    <li class="col-4"><a id="Dom" class="myButtonYellow">Dom</a></li>
    <li class="col-4"><a id="Kamera" class="myButtonYellow" href="PHP/Cam_v2.php">Kamera</a></li>
    <li class="col-4"><a id="Sceny" class="myButtonYellow">Sceny</a></li>		
    <li class="col-4"><a id="Odśwież" class="myButtonBlue">Odśwież</a></li>
</ul>
<div id="PHPConnections">
    <div id="Amplituner" style="display: none">
        <div class="section">
            <div class="col-6"><a id="MainPower" class="myButtonYellow">Main Power</a></div>
            <div class="col-6"><a id="Display" class="myButtonBlue">Display</a></div>
        </div>
        <div class="section">
            <div class="col-3"><a id="InputBd/Dvd" class="myButtonBlue">PS4</a></div>
            <div class="col-3"><a id="InputCbl/Sat" class="myButtonBlue">UPC</a></div>
            <div class="col-3"><a id="InputStb/Dvr" class="myButtonBlue">Media Player</a></div>
            <div class="col-3"><a id="InputGame" class="myButtonBlue" style="font-size: 8px">Chromecast</a></div>
            <div class="col-3"><a id="InputPc" class="myButtonBlue">Malina</a></div>
            <div class="col-3"><a id="InputAux" class="myButtonBlue">AUX</a></div>
            <div class="col-3"><a id="InputAm" class="myButtonBlue">Radio AM</a></div>
            <div class="col-3"><a id="InputFm" class="myButtonBlue">Radio FM</a></div>
            <div class="col-4"><a id="InputTv/Cd" class="myButtonBlue">Bluetooth</a></div>
            <div class="col-4"><a id="InputNet" class="myButtonBlue">Radio Internetowe</a></div>
            <div class="col-4"><a id="InputUsb" class="myButtonBlue">USB</a></div>
        </div>
        <div class="section">
            <div class="col-6"><a id="Bathroom" class="myButtonBlue">Łazienka</a></div>
            <!-- <div class="col-4"><a id="Zone3" href="#" class="myButtonBlue">Zone 3</a></div> -->
            <div class="col-6"><a id="Mute" class="myButtonBlue">Muting</a></div>
        </div>
        <div id="Bathroom" class="section" style="display: none">
            <div class="col-4"><a id="InputBd/Dvd" class="myButtonBlue">Łazienka PS4</a></div>
            <div class="col-4"><a id="InputCbl/Sat" class="myButtonBlue">Łazienka UPC</a></div>
            <div class="col-4"><a id="InputStb/Dvr" class="myButtonBlue">Łazienka Media Player</a></div>
            <div class="col-4"><a id="InputPc" class="myButtonBlue">Łazienka Malina</a></div>
            <div class="col-4"><a id="InputAm" class="myButtonBlue">Łazienka Radio AM</a></div>
            <div class="col-4"><a id="InputFm" class="myButtonBlue">Łazienka Radio FM</a></div>
            <div class="col-4"><a id="InputTv/Cd" class="myButtonBlue">Łazienka Bluetooth</a></div>
            <div class="col-4"><a id="InputInternetRadio" class="myButtonBlue">Łazienka Radio Internetowe</a></div>
            <div class="col-4"><a id="InputUsb" class="myButtonBlue">Łazienka USB</a></div>
            <div class="col-6"><a id="PresetNext" class="myButtonBlue">Radio Channel Up</a></div>
            <div class="col-6"><a id="VolumeUp" class="myButtonBlue">Vol Up</a></div>
            <div class="col-6"><a id="PresetPrev" class="myButtonBlue">Radio Channel Down</a></div>
            <div class="col-6"><a id="VolumeDown" class="myButtonBlue">Vol Down</a></div>
            <div class="col-9"><input id="VolumeBathroom" name="VolumeBathroom" type="range" class="mySlider" min="0" max="60" value="30"></div>
            <div class="col-3"><p>Volume</p><span id="VolumeBathroom">30</span></div>
            <!--
            <div class="col-12"><a id="DirectionUp" class="myButtonBlue">&#x02c4</a></div>
            <div class="col-4"><a id="DirectionLeft" class="myButtonBlue">&#x02c2</a></div>
            <div class="col-4"><a id="Select" class="myButtonBlue">Enter</a></div>
            <div class="col-4"><a id="DirectionRight" class="myButtonBlue">&#x02c3</a></div>
            <div class="col-12"><a id="DirectionDown" class="myButtonBlue">&#x02c5</a></div>
            <div class="col-12"><a id="Return" class="myButtonBlue">Return</a></div>
            -->
            <div class="col-4"><a id="1" class="myButtonBlue">1</a></div>
            <div class="col-4"><a id="2" class="myButtonBlue">2</a></div>
            <div class="col-4"><a id="3" class="myButtonBlue">3</a></div>
            <div class="col-4"><a id="4" class="myButtonBlue">4</a></div>
            <div class="col-4"><a id="5" class="myButtonBlue">5</a></div>
            <div class="col-4"><a id="6" class="myButtonBlue">6</a></div>
            <div class="col-4"><a id="7" class="myButtonBlue">7</a></div>
            <div class="col-4"><a id="8" class="myButtonBlue">8</a></div>
            <div class="col-4"><a id="9" class="myButtonBlue">9</a></div>
            <div class="col-12"><a id="0" class="myButtonBlue">0</a></div>
        </div>
        <!--
        <div id="Zone3" class="section" style="display: none">
            <div class="col-4"><a id="InputBd/Dvd" class="myButtonBlue">Zone3 PS4</a></div>
            <div class="col-4"><a id="InputCbl/Sat" class="myButtonBlue">Zone3 UPC</a></div>
            <div class="col-4"><a id="InputStb/Dvr" class="myButtonBlue">Zone3 Media Player</a></div>
            <div class="col-4"><a id="InputPc" class="myButtonBlue">Zone3 Malina</a></div>
            <div class="col-4"><a id="InputAm" class="myButtonBlue">Zone3 Radio AM</a></div>
            <div class="col-4"><a id="InputFm" class="myButtonBlue">Zone3 Radio FM</a></div>
            <div class="col-4"><a id="InputTv/Cd" class="myButtonBlue">Zone3 Bluetooth</a></div>
            <div class="col-4"><a id="InputNet" class="myButtonBlue">Zone3 Radio Internetowe</a></div>
            <div class="col-4"><a id="InputUsb" class="myButtonBlue">Zone3 USB</a></div>
            <div class="col-6"><a id="PresetNext" class="myButtonBlue">Radio Channel Up</a></div>
            <div class="col-6"><a id="VolumeUp" class="myButtonBlue">Vol Up</a></div>
            <div class="col-6"><a id="PresetPrev" class="myButtonBlue">Radio Channel Down</a></div>
            <div class="col-6"><a id="VolumeDown" class="myButtonBlue">Vol Down</a></div>
            <div class="col-9"><input id="VolumeZone3" name="VolumeZone3" type="range" class="mySlider" min="0" max="60" value="30"></div>
            <div class="col-3"><p>Volume</p><span id="VolumeZone3">30</span></div>
            <div class="col-12"><a id="DirectionUp" class="myButtonBlue">&#x02c4</a></div>
            <div class="col-4"><a id="DirectionLeft" class="myButtonBlue">&#x02c2</a></div>
            <div class="col-4"><a id="Select" class="myButtonBlue">Enter</a></div>
            <div class="col-4"><a id="DirectionRight" class="myButtonBlue">&#x02c3</a></div>
            <div class="col-12"><a id="DirectionDown" class="myButtonBlue">&#x02c5</a></div>
            <div class="col-12"><a id="Return" class="myButtonBlue">Return</a></div>
            <div class="col-4"><a id="1" class="myButtonBlue">1</a></div>
            <div class="col-4"><a id="2" class="myButtonBlue">2</a></div>
            <div class="col-4"><a id="3" class="myButtonBlue">3</a></div>
            <div class="col-4"><a id="4" class="myButtonBlue">4</a></div>
            <div class="col-4"><a id="5" class="myButtonBlue">5</a></div>
            <div class="col-4"><a id="6" class="myButtonBlue">6</a></div>
            <div class="col-4"><a id="7" class="myButtonBlue">7</a></div>
            <div class="col-4"><a id="8" class="myButtonBlue">8</a></div>
            <div class="col-4"><a id="9" class="myButtonBlue">9</a></div>
            <div class="col-12"><a id="0" class="myButtonBlue">0</a></div>
        </div>
        -->
        <div class="section">
            <div class="col-6"><a id="PresetNext" class="myButtonBlue">Radio Channel Up</a></div>
            <div class="col-6"><a id="VolumeUp" class="myButtonBlue">Vol Up</a></div>
            <div class="col-6"><a id="PresetPrev" class="myButtonBlue">Radio Channel Down</a></div>
            <div class="col-6"><a id="VolumeDown" class="myButtonBlue">Vol Down</a></div>
            <div class="col-9"><input id="VolumeAmplituner" name="VolumeAmplituner" type="range" class="mySlider" min="0" max="60" value="30"></div>
            <div class="col-3"><p>Volume</p><span id="VolumeAmplituner">30</span></div> 	
        </div>
        <div class="section">
            <div class="col-12"><a id="DirectionUp" class="myButtonBlue">&#x02c4</a></div>
            <div class="col-4"><a id="DirectionLeft" class="myButtonBlue">&#x02c2</a></div>
            <div class="col-4"><a id="Select" class="myButtonBlue">Enter</a></div>
            <div class="col-4"><a id="DirectionRight" class="myButtonBlue">&#x02c3</a></div>
            <div class="col-4"><a id="Setup" class="myButtonBlue">Setup</a></div>
            <div class="col-4"><a id="DirectionDown" class="myButtonBlue">&#x02c5</a></div>
            <div class="col-4"><a id="Return" class="myButtonBlue">Return</a></div>
            <div class="col-12"><a id="Home" class="myButtonBlue">Home</a></div>
        </div>
        <div class="section">
            <div class="col-3"><a id="ModeMovie/TV" class="myButtonBlue">Movie/Tv</a></div>
            <div class="col-3"><a id="ModeMusic" class="myButtonBlue">Music</a></div>
            <div class="col-3"><a id="ModeGame" class="myButtonBlue">Game</a></div>
            <div class="col-3"><a id="ModeThx" class="myButtonBlue">THX</a></div>
            <!--
            <div class="col-4"><a id="1" class="myButtonBlue">1</a></div>
            <div class="col-4"><a id="2" class="myButtonBlue">2</a></div>
            <div class="col-4"><a id="3" class="myButtonBlue">3</a></div>
            <div class="col-4"><a id="4" class="myButtonBlue">4</a></div>
            <div class="col-4"><a id="5" class="myButtonBlue">5</a></div>
            <div class="col-4"><a id="6" class="myButtonBlue">6</a></div>
            <div class="col-4"><a id="7" class="myButtonBlue">7</a></div>
            <div class="col-4"><a id="8" class="myButtonBlue">8</a></div>
            <div class="col-4"><a id="9" class="myButtonBlue">9</a></div>
            <div class="col-12"><a id="0" class="myButtonBlue">0</a></div>
            -->
        </div>
    </div>
    <div id="UPC" style="display: none">
      <div class="section">
        <div class="col-4"><a id="Tv" class="myButtonBlue">TV</a></div>
        <div class="col-4"><a id="UPC" class="myButtonYellow">UPC</a></div>
        <div class="col-4"><a id="PowerOff" class="myButtonYellow">Power</a></div>
      </div>
      <div class="section">
        <div class="col-4"><a id="1" class="myButtonBlue">1</a></div>
        <div class="col-4"><a id="2" class="myButtonBlue">2</a></div>
        <div class="col-4"><a id="3" class="myButtonBlue">3</a></div>
        <div class="col-4"><a id="4" class="myButtonBlue">4</a></div>
        <div class="col-4"><a id="5" class="myButtonBlue">5</a></div>
        <div class="col-4"><a id="6" class="myButtonBlue">6</a></div>
        <div class="col-4"><a id="7" class="myButtonBlue">7</a></div>
        <div class="col-4"><a id="8" class="myButtonBlue">8</a></div>
        <div class="col-4"><a id="9" class="myButtonBlue">9</a></div>
        <div class="col-12"><a id="0" class="myButtonBlue">0</a></div>
      </div>
      <div class="section">
        <div class="col-4"><a id="Guide" class="myButtonBlue">Guide</a></div>
        <div class="col-4"><a id="Menu" class="myButtonBlue">Menu</a></div>
        <div class="col-4"><a id="OnDemand" class="myButtonBlue">On Demand</a></div>
        <div class="col-4"><a id="Radio" class="myButtonBlue">Radio</a></div>
        <div class="col-4"><a id="" class="myButtonBlue">DVR</a></div>
        <div class="col-4"><a id="Interactive" class="myButtonBlue">Interactive</a></div>
      </div>
      <div class="section">
        <div class="col-12"><a id="PageUp" class="myButtonBlue">Page Up</a></div>
        <div class="col-12"><a id="DirectionUp" class="myButtonBlue">&#x02c4</a></div>
        <div class="col-4"><a id="DirectionLeft" class="myButtonBlue">&#x02c2</a></div>
        <div class="col-4"><a id="Select" class="myButtonBlue">OK</a></div>
        <div class="col-4"><a id="DirectionRight" class="myButtonBlue">&#x02c3</a></div>
        <div class="col-12"><a id="DirectionDown" class="myButtonBlue">&#x02c5</a></div>
        <div class="col-4"><a id="VolumeUp" class="myButtonBlue">Vol Up</a></div>
        <div class="col-4"><a id="PageDown" class="myButtonBlue">Page Down</a></div>
        <div class="col-4"><a id="ChannelUp" class="myButtonBlue">Channel Up</a></div>
        <div class="col-4"><a id="VolumeDown" class="myButtonBlue">Vol Down</a></div>
        <div class="col-4"><a id="ChannelPrev" class="myButtonBlue">&#x2190</a></div>
        <div class="col-4"><a id="ChannelDown" class="myButtonBlue">Channel Down</a></div>
        <div class="col-9"><input id="VolumeUPC" name="VolumeUPC" type="range" class="mySlider" min="0" max="60" value="30"></div>
        <div class="col-3"><p>Volume</p><span id="VolumeUPC">30</span></div>
        <div class="col-6"><a id="Mute" class="myButtonBlue">Mute</a></div>
        <div class="col-6"><a id="Info" class="myButtonBlue">Info</a></div>
        <div class="col-6"><a id="Teletext" class="myButtonBlue">TXT</a></div>
        <div class="col-6"><a id="Help" class="myButtonBlue">Help</a></div>
      </div>
      <div class="section">
        <div class="col-3"><a id="Red" class="myButtonBlue" style="background-color: red" onmouseover="this.style.background='#930000'" onmouseout="this.style.background='red'"></a></div>
        <div class="col-3"><a id="Green" class="myButtonBlue" style="background-color: green" onmouseover="this.style.background='#005300'" onmouseout="this.style.background='green'"></a></div>
        <div class="col-3"><a id="Yellow" class="myButtonBlue" style="background-color: yellow" onmouseover="this.style.background='#717100'" onmouseout="this.style.background='yellow'"></a></div>
        <div class="col-3"><a id="Blue" class="myButtonBlue" style="background-color: blue" onmouseover="this.style.background='#000093'" onmouseout="this.style.background='blue'"></a></div>
      </div>
      <div class="section">  
        <div class="col-4"><a id="Rewind" class="myButtonBlue">Rewind</a></div>
        <div class="col-4"><a id="Play" class="myButtonBlue">&#x25ba</a></div>
        <div class="col-4"><a id="FastForward" class="myButtonBlue">Fast Forward</a></div>
      </div>
      <div class="section">  
        <div class="col-4"><a id="Record" class="myButtonBlue">Rec</a></div>
        <div class="col-4"><a id="Pause" class="myButtonBlue">&#x2016</a></div>
        <div class="col-4"><a id="Stop" class="myButtonBlue">&#x25a0</a></div>
      </div>
    </div>
    <div id="MediaPlayer" style="display: none">
      <div class="section">
        <div class="col-6"><a id="PowerToggle" class="myButtonYellow">Power</a></div>
        <div class="col-6"><a id="Home" class="myButtonBlue">Home</a></div>
      </div>
      <div class="section">
        <div class="col-6"><a id="Subtitle" class="myButtonBlue">Subtitle</a></div>
        <div class="col-6"><a id="Audio" class="myButtonBlue">Audio</a></div>
        <div class="col-4"><a id="PreviousTrack" class="myButtonBlue">Previous</a></div>
        <div class="col-4"><a id="Stop" class="myButtonBlue">&#x25a0</a></div>
        <div class="col-4"><a id="NextTrack" class="myButtonBlue">Next</a></div>
        <div class="col-4"><a id="Rewind" class="myButtonBlue">Rewind</a></div>
        <div class="col-4"><a id="Play" class="myButtonBlue">&#x25ba/&#x2016</a></div>
        <div class="col-4"><a id="FastForward" class="myButtonBlue">Fast Forward</a></div>
        <div class="col-12"><a id="Play" class="myButtonBlue">&#x25ba</a></div>
      </div>
      <div class="section">
        <div class="col-4"><a id="Back" class="myButtonBlue">Back</a></div>
        <div class="col-4"><a id="DirectionUp" class="myButtonBlue">&#x02c4</a></div>
        <div class="col-4"><a id="Options" class="myButtonBlue">Options</a></div>    
        <div class="col-4"><a id="DirectionLeft" class="myButtonBlue">&#x02c2</a></div>
        <div class="col-4"><a id="Ok" class="myButtonBlue">OK</a></div>
        <div class="col-4"><a id="DirectionRight" class="myButtonBlue">&#x02c3</a></div>
        <div class="col-4"><a id="PageDown" class="myButtonBlue">Prev Page</a></div>
        <div class="col-4"><a id="DirectionDown" class="myButtonBlue">&#x02c5</a></div>
        <div class="col-4"><a id="PageUp" class="myButtonBlue">Next Page</a></div>
        <div class="col-6"><a id="Mute" class="myButtonBlue">Mute</a></div>
        <div class="col-6"><a id="Setup" class="myButtonBlue">Setup</a></div>
        <div class="col-12"><a id="VolumeUp" class="myButtonBlue">Vol Up</a></div>
        <div class="col-12"><a id="VolumeDown" class="myButtonBlue">Vol Down</a></div>
        <div class="col-9"><input id="VolumeMediaPlayer" name="VolumeMediaPlayer" type="range" class="mySlider" min="0" max="60" value="30"></div>
        <div class="col-3"><p>Volume</p><span id="VolumeMediaPlayer">30</span></div>
      </div>
      <div class="section">
        <div class="col-3"><a id="Green" class="myButtonBlue" style="color: black; background-color: green" onmouseover="this.style.background='#005300'" onmouseout="this.style.background='green'">A</a></div>
        <div class="col-3"><a id="Red" class="myButtonBlue" style="color: black; background-color: red" onmouseover="this.style.background='#930000'" onmouseout="this.style.background='red'">B</a></div> 
        <div class="col-3"><a id="Yellow" class="myButtonBlue" style="color: black; background-color: yellow" onmouseover="this.style.background='#717100'" onmouseout="this.style.background='yellow'">C</a></div>
        <div class="col-3"><a id="Blue" class="myButtonBlue" style="color: black; background-color: blue" onmouseover="this.style.background='#000093'" onmouseout="this.style.background='blue'">D</a></div>
      </div>
      <div class="section">
        <div class="col-4"><a id="1" class="myButtonBlue">1</a></div>
        <div class="col-4"><a id="2" class="myButtonBlue">2</a></div>
        <div class="col-4"><a id="3" class="myButtonBlue">3</a></div>    
        <div class="col-4"><a id="4" class="myButtonBlue">4</a></div>
        <div class="col-4"><a id="5" class="myButtonBlue">5</a></div>
        <div class="col-4"><a id="6" class="myButtonBlue">6</a></div>
        <div class="col-4"><a id="7" class="myButtonBlue">7</a></div>
        <div class="col-4"><a id="8" class="myButtonBlue">8</a></div>
        <div class="col-4"><a id="9" class="myButtonBlue">9</a></div>
        <div class="col-4"><a id="Search" class="myButtonBlue">Search</a></div>
        <div class="col-4"><a id="0" class="myButtonBlue">0</a></div>
        <div class="col-4"><a id="Eject" class="myButtonBlue">Eject</a></div>
      </div>
    </div>
    <div id="TV" style="display: none">
      <div class="section">
        <div class="col-12"><a id="PowerToggle" class="myButtonYellow">Power</a></div>
      </div>
    </div>
    <div id="PlayStation" style="display: none">
      <div class="section">
        <div class="col-4"><a id="PS4Off" class="myButtonBlue">Power Off</a></div>
        <div class="col-4"><a id="PS" class="myButtonBlue">PS</a></div>
        <div class="col-4"><a id="PS4On" class="myButtonBlue">Power On</a></div>
        <div class="col-4"><a id="Share" class="myButtonBlue">Share</a></div>
        <div class="col-4"><a id="PSHold" class="myButtonBlue">PS Hold</a></div>
        <div class="col-4"><a id="Options" class="myButtonBlue">Options</a></div>
      </div>
      <div class="section">
        <div class="col-12"><a id="Triangle" class="myButtonBlue">Trójkąt</a></div>
        <div class="col-6"><a id="Square" class="myButtonBlue">Kwadrat</a></div>
        <div class="col-6"><a id="Circle" class="myButtonBlue">Kóko</a></div>
        <div class="col-12"><a id="Cross" class="myButtonBlue">Krzyżyk</a></div>
      </div>
      <div class="section">
        <div class="col-12"><a id="DirectionUp" class="myButtonBlue">&#x02c4</a></div>
        <div class="col-6"><a id="DirectionLeft" class="myButtonBlue">&#x02c2</a></div>
        <div class="col-6"><a id="DirectionRight" class="myButtonBlue">&#x02c3</a></div>
        <div class="col-12"><a id="DirectionDown" class="myButtonBlue">&#x02c5</a></div>
        <div class="col-12"><a id="VolumeUp" class="myButtonBlue">Vol Up</a></div>
        <div class="col-12"><a id="VolumeDown" class="myButtonBlue">Vol Down</a></div>
        <div class="col-9"><input id="VolumePlayStation" name="VolumePlayStation" type="range" class="mySlider" min="0" max="60" value="30"></div>
        <div class="col-3"><p>Volume</p><span id="VolumePlayStation">30</span></div>
      </div>
    </div>
</div>
<div id="Dom" style="display: none">
    <!-- Domoticz connections were originally set up as Node.js server connections
    <div id="NodeJSConnections">
    -->
    <div id="DomoticzConnections">
        <div class="section">
            <div class="col-4 myCaption">Kino domowe - zasilanie</div>
            <div class="col-4"><a id="ListwaOn" class="myButtonBlue">Włącz</a></div>
            <div class="col-4"><a id="ListwaOff" class="myButtonBlue">Wyłącz</a></div>         
        </div>
        <div class="section">
            <div class="col-4 myCaption">Nawilżacz u Dziewczynek</div>
            <div class="col-4"><a id="NawilzaczOn" class="myButtonBlue">Włącz</a></div>
            <div class="col-4"><a id="NawilzaczOff" class="myButtonBlue">Wyłącz</a></div>         
        </div>
        <div class="section">
            <div class="col-3 myCaption">Rolety w salonie</div>
            <div class="col-3"><a id="Rolety1Open" class="myButtonBlue">Otwórz</a></div>
            <div class="col-3"><a id="Rolety1Close" class="myButtonBlue">Zamknij</a></div>
            <div class="col-3"><a id="Rolety1Stop" class="myButtonBlue">Zatrzymaj</a></div>
            <div class="col-3 myCaption">Rolety u Dziewczynek</div>
            <div class="col-3"><a id="Rolety2Open" class="myButtonBlue">Otwórz</a></div>
            <div class="col-3"><a id="Rolety2Close" class="myButtonBlue">Zamknij</a></div>
            <div class="col-3"><a id="Rolety2Stop" class="myButtonBlue">Zatrzymaj</a></div>
            <div class="col-3 myCaption">Rolety w sypialni</div>
            <div class="col-3"><a id="Rolety3Open" class="myButtonBlue">Otwórz</a></div>
            <div class="col-3"><a id="Rolety3Close" class="myButtonBlue">Zamknij</a></div>
            <div class="col-3"><a id="Rolety3Stop" class="myButtonBlue">Zatrzymaj</a></div>
            <div class="col-3 myCaption">Rolety wszystkie</div>
            <div class="col-3"><a id="Rolety0Open" class="myButtonBlue">Otwórz</a></div>
            <div class="col-3"><a id="Rolety0Close" class="myButtonBlue">Zamknij</a></div>
            <div class="col-3"><a id="Rolety0Stop" class="myButtonBlue">Zatrzymaj</a></div>                    
        </div>
    </div>
    <div id="RESTConnections">
        <div class="section" id="LampyZasilanie">
            <div class="col-6"><a id="Lampy1" class="myButtonYellow">Lampa w salonie</a></div>
            <div class="col-6"><a id="Lampy9" class="myButtonYellow">Lampki w kuchni</a></div>
            <div class="col-6"><a id="Lampy4" class="myButtonYellow">Lampa w pokoju Dziewczynek</a></div>
            <div class="col-6"><a id="Fibaro36" class="myButtonYellow">Lampka na biurku</a></div>
            <div class="col-4"><a id="Lampy8" class="myButtonYellow">Lampa w sypialni</a></div>
            <div class="col-4"><a id="Lampy7" class="myButtonYellow">HuGo</a></div>
            <div class="col-4"><a id="Fibaro23" class="myButtonYellow">LEDy w sypialni</a></div>         
        </div>
        <div class="section" id="Lampy" style="display: none">
            <div class="col-4"><input type="checkbox" name="LampyCheckbox1" id="LampyCheckbox1" class="css-checkbox" disabled><label for="LampyCheckbox1" class="myButtonYellow css-label">Lampa w salonie</label></div>
            <div class="col-4"><input type="checkbox" name="LampyCheckbox9" id="LampyCheckbox9" class="css-checkbox" disabled><label for="LampyCheckbox9" class="myButtonYellow css-label">Lampki w kuchni</label></div>
            <div class="col-4"><input type="checkbox" name="LampyCheckbox4" id="LampyCheckbox4" class="css-checkbox" disabled><label for="LampyCheckbox4" class="myButtonYellow css-label" style="padding-top: 7px">Lampa w pokoju Dziewczynek</label></div>
            <div class="col-4"><input type="checkbox" name="LampyCheckbox8" id="LampyCheckbox8" class="css-checkbox" disabled><label for="LampyCheckbox8" class="myButtonYellow css-label">Lampa w sypialni</label></div>
            <div class="col-4"><input type="checkbox" name="LampyCheckbox7" id="LampyCheckbox7" class="css-checkbox" disabled><label for="LampyCheckbox7" class="myButtonYellow css-label">HuGo</label></div>
            <div class="col-4"><input type="checkbox" name="FibaroCheckbox23" id="FibaroCheckbox23" class="css-checkbox" disabled><label for="FibaroCheckbox23" class="myButtonYellow css-label">LEDy w sypialni</label></div>
            <div class="col-2 myCaption" style="padding-bottom: 26px">Jasność</div>
            <div class="col-10"><input id="JasnoscSlider" name="JasnoscSlider" type="range" class="BriSlider" min="0" max="254" value="127"></div>
            <div class="col-2 myCaption" style="padding-bottom: 26px">Temperatura bieli</div>
            <div class="col-10"><input id="TemperaturaSlider" name="TemperaturaSlider" type="range" class="CTSlider" min="153" max="500" value="326"></div>
	        <div class="col-12"><div class="color-space"></div></div>
        </div>
        <div class="section" id="Termostaty">
            <div id="TemperatureSettingSalon">
                <div class="col-6"><input id="TemperaturaSalon" name="TemperaturaSalon" type="range" class="mySlider" min="4" max="30" value="16" step="1"></div>
                <div class="col-6"><p style="font-size: 10px">Termostat w salonie</p><span id="TemperaturaSalon" style="font-size: 10px"></span></div>
            </div>
            <div id="ThermostatTimerSettingsSalon" style="display: none">
                <div class="col-6"><input id="TempTimerSalon" name="TempTimerSalon" type="range" class="mySlider" min="0.25" max="6" value="0.25" step="0.25"></div>
                <div class="col-3" style="padding: 0px"><p style="font-size: 10px">Czas</p><span id="TempTimerSalon" style="font-size: 10px"></span></div>
                <div class="col-3" style="padding: 0px"><p style="font-size: 10px">Pozostało</p><span id="CountDownSalon" style="font-size: 10px"></span></div>
            </div>
        </div>
    </div>
</div>
<div id="Sceny" style="display: none">
    <div class="section">
	    <div class="col-12 myCaption">Aktywności Harmony</div>
	    <div class="col-4"><a id="TV" class="myButtonBlue">Oglądaj<br>TV</a></div>
	    <div class="col-4"><a id="Movies" class="myButtonBlue">Oglądaj<br>film</a></div>
	    <div class="col-4"><a id="Chromecast" class="myButtonBlue">Oglądaj<br>Chromecast</a></div>
	    <div class="col-4"></div>
	    <div class="col-4"><a id="Netflix" class="myButtonBlue">Oglądaj<br>Netflix</a></div>
	    <div class="col-4"></div>
	    <div class="col-4"><a id="Bluetooth" class="myButtonBlue">Słuchaj<br>z bluetooth</a></div>
	    <div class="col-4"><a id="Radio" class="myButtonBlue">Słuchaj radia<br>internetowego</a></div>
	    <div class="col-4"><a id="Bathroom" class="myButtonBlue">Słuchaj<br>w łazience</a></div>
	    <div class="col-4"><a id="PS4" class="myButtonBlue">Uruchom<br>PlayStation</a></div>
	    <div class="col-4"></div>
	    <div class="col-4"><a id="FIFA" class="myButtonBlue">Graj<br>w FIFĘ</a></div>
    </div>
</div>
</body>
</html>








