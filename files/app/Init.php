<?php

if (!defined('ROOT_PATH')) {
    define('ROOT_PATH', dirname(__FILE__));
}

require_once ROOT_PATH . '/src/Device.php';

class Init
{
    public function __construct()
    {
        $device = new \App\Device();
        $list = $device->getListDevice(true);

        foreach ($list as $item) {
            $this->configSquid($item['ip'], $item['proxy']);
        }

        $this->configSquidDNS();
    }

    public function configSquid($ip, $port)
    {
        $proxy = "http_port {$port} name=port_{$port}\r\n";
        $proxy .= "acl port_{$port}_acl myportname port_{$port}\r\n";
        $proxy .= "http_access allow port_{$port}_acl\r\n";
        $proxy .= "tcp_outgoing_address {$ip} port_{$port}_acl\r\n";

        file_put_contents(ROOT_PATH . '/squid.conf', $proxy, FILE_APPEND);
    }

    public function configSquidDNS()
    {
        file_put_contents(ROOT_PATH . '/squid.conf', "dns_nameservers 8.8.8.8 8.8.4.4\r\n", FILE_APPEND);
    }
}

$init = new Init();
