<!-- PHP script for ONKYO AVR zones 2 and 3 powering on and subsequent volume state polling using Onkyo eISCP Control 
library by Michael Elsdšrfer (http://blog.elsdoerfer.name, https://github.com/miracle2k)-->

<?php

$amplituner_map["LazienkaOn"] = "zone2.power:on zone2.volume:query";

/*
$amplituner_map["Zone3On"] = "zone3.power:on zone3.volume:query";
*/

$params = array();
$counter = 0;
$scr_amplituner = "sudo onkyo ";

foreach($_GET as $value) {
	$params[$counter++]=$value;
}

for($i=1; $i<count($params); $i++) {
    $scr_amplituner.=$amplituner_map[$params[$i]];
	$scr_amplituner.=" ";
}
echo(shell_exec($scr_amplituner));

?>
