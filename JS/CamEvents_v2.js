/* Cameras site event handlers: navigation back to main site and camera controls. Script works with 
Foscam FI9816P v.2 camera.
WARNING: remember to provide actual camera IP with port and camera login credentials, user should have at least 
Foscam "OPERATOR" privilleges.
*/

$(document).ready(function() {
    strip_on = (GetURLParameter('strip_on') === 'true');
    setActiveLink("Kamera");        
    if (!strip_on) {
        $("#nav a:not(.active,#Dom)").addClass('transparent');
        $("#nav a:not(.active,#Dom)").removeAttr('href');
    } else {
        $("#nav a:not(.active,#Dom)").removeClass('transparent');
        $("#nav a:not(.active,#Dom)").attr('href','/BrowarRemote_v2.php');
    }
});

/*Top navigation panel button handlers. Active panel is colored red.*/

$(function() {
    $("#nav a:not(#Kamera)").click(function() {
        if (!$(this).hasClass('transparent')) {
            target_link = this.id;
            if (target_link === "Odśwież") {
                $(this).attr('href','/BrowarRemote_v2.php');
            } else {
                $(this).attr('href','/BrowarRemote_v2.php?target_link='+target_link);
            }
        }
    });
});

/*Camera control button handlers*/

$(function() {
    $("div#KameraDziewczynek a").on("click", function(e) {
	//Below actual camera IP with port, camera login and password must be provided, user should have at least Foscam "OPERATOR" privilleges.
        $.get('http://<camera IP>:<camera port>/cgi-bin/CGIProxy.fcgi?cmd='+this.id+'&usr=<login>&pwd=<password>
    });
});
