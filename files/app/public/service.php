<?php

include 'config.php';
include ROOT_PATH . '/src/IP.php';
include ROOT_PATH . '/src/Device.php';

$action = $_GET['action'];
$ipAddress = $_GET['ip'];

if ($action == 'changeIp') {
    $ip = new \App\IP();
    $ip->changeIp($ipAddress);
} elseif ($action == 'listDevices') {
    $device = new \App\Device();
    $device->getListDevice();
}

exit;
