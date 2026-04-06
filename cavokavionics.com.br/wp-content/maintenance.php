<?php

//  ATTENTION!
//
//  DO NOT MODIFY THIS FILE BECAUSE IT WAS GENERATED AUTOMATICALLY,
//  SO ALL YOUR CHANGES WILL BE LOST THE NEXT TIME THE FILE IS GENERATED.
//  IF YOU REQUIRE TO APPLY CUSTOM MODIFICATIONS, PERFORM THEM IN THE FOLLOWING FILE:
//  /home/welfar13/cavokavionics.com.br/wp-content/maintenance/template.phtml


$protocol = $_SERVER['SERVER_PROTOCOL'];
if ('HTTP/1.1' != $protocol && 'HTTP/1.0' != $protocol) {
    $protocol = 'HTTP/1.0';
}

header("{$protocol} 503 Service Unavailable", true, 503);
header('Content-Type: text/html; charset=utf-8');
header('Retry-After: 600');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <link rel="icon" href="https://cavokavionics.com.br/wp-content/uploads/2023/10/cropped-Design-sem-nome-62-32x32.png">
    <link rel="stylesheet" href="https://cavokavionics.com.br/wp-content/maintenance/assets/styles.css?1746089167">
    <script src="https://cavokavionics.com.br/wp-content/maintenance/assets/timer.js?1746089167"></script>
    <title>Manutenção Programada</title>
    <style>body {background-image: url("https://cavokavionics.com.br/wp-content/maintenance/assets/images/bg.jpg?1746089167");}</style>
</head>

<body>

    <div class="container">

    <header class="header">
        <h1>O site está passando por manutenção programada.</h1>
        <h2>Lamentamos o inconveniente. Volte um pouco mais tarde, estaremos prontos em breve!</h2>
    </header>

    <!--START_TIMER_BLOCK-->
        <!--END_TIMER_BLOCK-->

    <!--START_SOCIAL_LINKS_BLOCK-->
    <section class="social-links">
            </section>
    <!--END_SOCIAL_LINKS_BLOCK-->

</div>

<footer class="footer">
    <div class="footer__content">
        Desenvolvido por WP Toolkit    </div>
</footer>

</body>
</html>
