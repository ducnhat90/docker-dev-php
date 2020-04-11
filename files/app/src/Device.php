<?php

namespace App;

require_once 'Util.php';

/**
 * Class Device
 * @package App
 */
class Device
{
    public function getListDevice($array = false)
    {
        $file = ROOT_PATH . '/config/devices.txt';
        if (!file_exists($file)) {
            return [];
        }

        $list = file_get_contents($file);
        $list = explode(PHP_EOL, $list);
        $devices = [];

        foreach ($list as $row) {
            if (empty($row)) {
                continue;
            }

            list($name, $ip, $proxy) = explode(',', $row);
            $ip = explode('.', $ip);
            $ip[3] = 1;
            $ip = implode('.', $ip);
            $devices[] = [
                'name' => $name,
                'ip' => $ip,
                'proxy' => $proxy,
            ];
        }

        if ($array) {
            return $devices;
        }

        return Util::responseJson(['devices' => $devices]);
    }
}
