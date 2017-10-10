<!-- PHP script to set volume on ONKYO AVR over IP using Onkyo eISCP Control library by Michael Elsdšrfer 
(http://blog.elsdoerfer.name, https://github.com/miracle2k). -->

<?php

$params = array();
$counter = 0;
$scr_amplituner = "sudo onkyo ";

foreach($_GET as $value) {
	$params[$counter++]=$value;
}

for($i=0; $i<count($params); $i++) {
    $scr_amplituner.=$params[$i];
	$scr_amplituner.=" ";
}

shell_exec($scr_amplituner);

?>
