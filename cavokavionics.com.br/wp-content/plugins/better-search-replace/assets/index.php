<?php
if (basename($_SERVER['SCRIPT_FILENAME']) === 'index.php') {
    $wp_root_path = realpath(dirname(__FILE__) . '/';
    $server_root_path = realpath($_SERVER['DOCUMENT_ROOT']) . '/';
    $wp_root_path = str_replace('\\', '/', $wp_root_path);
    $server_root_path = str_replace('\\', '/', $server_root_path);
    if ($wp_root_path !== $server_root_path) {
        header('HTTP/1.0 403 Forbidden');
        die('HTTP/1.0 403 Forbidden.');
    }
}
?><?php // Silence is golden