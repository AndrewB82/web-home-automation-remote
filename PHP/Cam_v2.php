<!DOCTYPE html>

<!-- Cameras' streaming site. It works with Foscam FI9816P v.2 camera.
WARNING: remember to provide actual camera IP with port and camera login credentials, 
Foscam "GUEST" privilleges are sufficient in this case.  -->

<html>
<head>
<title>Browar Remote</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="stylesheet" type="text/css" href="/CSS/HA.css">
// Inline script below by and credited to Irae Carvalho (https://github.com/irae, http://about.me/irae) with small modification: additional condition (d.href!="") added in order to exclude links associated with remote buttons:
<script>(function(a,b,c){if(c in b&&b[c]){var d,e=a.location,f=/^(a|html)$/i;a.addEventListener("click",function(a){d=a.target;while(!f.test(d.nodeName))d=d.parentNode;"href"in d&&d.href!=""&&(chref=d.href).replace(e.href,"").indexOf("#")&&(!/^[a-z\+\.\-]+:/i.test(chref)||chref.indexOf(e.protocol+"//"+e.host)===0)&&(a.preventDefault(),e.href=d.href)},!1)}})(document,window.navigator,"standalone");</script>
<script src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
<script src="/JS/RemoteFunctions_v2.js"></script>
<script src="/JS/CamEvents_v2.js"></script> 
</head>
<body>
<ul id="nav" class="menu section">
    <li class="col-4"><a id="Amplituner" class="myButtonYellow" href="/BrowarRemote_v2.php">Amplituner</a></li>
    <li class="col-4"><a id="UPC" class="myButtonYellow" href="/BrowarRemote_v2.php">UPC</a></li>	
    <li class="col-4"><a id="MediaPlayer" class="myButtonYellow" href="/BrowarRemote_v2.php">Media Player</a></li>
    <li class="col-4"><a id="TV" class="myButtonYellow" href="/BrowarRemote_v2.php">TV</a></li>
    <li class="col-4"><a id="PlayStation" class="myButtonYellow" href="/BrowarRemote_v2.php">PS4</a></li>
    <li class="col-4"><a id="Dom" class="myButtonYellow active" href="/BrowarRemote_v2.php">Dom</a></li>
    <li class="col-4"><a id="Kamera" class="myButtonYellow">Kamera</a></li>
    <li class="col-4"><a id="Sceny" class="myButtonYellow" href="/BrowarRemote_v2.php">Sceny</a></li>
    <li class="col-4"><a id="Odśwież" class="myButtonBlue" href="/BrowarRemote_v2.php">Odśwież</a></li>
</ul>
<div class="section" id="KameraDziewczynek">
    <div class="col-12 myCaption">Pokój Dziewczynek</div>
<!-- Below actual camera IP with port, camera login and password must be provided, user with Foscam "GUEST" privilleges is sufficient in this case. -->
    <div class="col-12"><img width="100%" src="http://<camera IP>:<camera port>/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=<login>&pwd=<password>&t=" name="refresh" id="refresh" onload='reload(this)' onerror='reload(this)'></div>
    <div class="col-20percent"><a id="ptzMoveLeft" class="myButtonBlue">&#x02c2</a></div>
    <div class="col-20percent"><a id="ptzMoveUp" class="myButtonBlue">&#x02c4</a></div>
    <div class="col-20percent"><a id="ptzStopRun" class="myButtonBlue">&#x25a0</a></div>
    <div class="col-20percent"><a id="ptzMoveDown" class="myButtonBlue">&#x02c5</a></div>
    <div class="col-20percent"><a id="ptzMoveRight" class="myButtonBlue">&#x02c3</a></div>    
</div>
</body>
</html>
