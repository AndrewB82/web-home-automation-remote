<!-- PHP script for ONKYO AVR zones power and volume state polling using Onkyo eISCP Control library by 
Michael Elsdšrfer (http://blog.elsdoerfer.name, https://github.com/miracle2k)-->

<?php

$amplituner_response = shell_exec("sudo onkyo main.power:query main.volume:query zone2.volume:query");
echo $amplituner_response;

?>
