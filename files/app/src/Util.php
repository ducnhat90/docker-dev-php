<?php

namespace App;

/**
 * Class Util
 */
class Util
{
    public static function send($ip, $path, $method = 'GET', $data = [], $proxy = null)
    {
        Util::updateHosts($ip);
        $curl = curl_init();
        $url = "http://jazz.wifi/{$path}";
        $cookieFile = dirname(__FILE__) . "/" . md5($ip) . '.txt';

        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_COOKIEJAR => $cookieFile,
            CURLOPT_COOKIEFILE => $cookieFile,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => array(
                "X-Requested-With: XMLHttpRequest",
            )
        ));

        if (!empty($proxy)) {
            curl_setopt($curl, CURLOPT_PROXY, $proxy);
        }

        if (strtoupper($method) == 'POST') {
            $posts = "";

            foreach ($data as $key => $value) {
                if (!empty($posts)) {
                    $posts .= "&";
                }
                $posts .= "{$key}={$value}";
            }

            curl_setopt($curl, CURLOPT_POSTFIELDS, $posts);
        }

        $error = null;
        $response = curl_exec($curl);
        curl_close($curl);

        if (empty($response)) {
            $error = curl_getinfo($curl);
        }

        return [$response, $error];
    }

    public static function checkPublicIp($proxy)
    {
        $curl = curl_init();
        $cookieFile = dirname(__FILE__) . "/" . md5($proxy) . '.txt';

        curl_setopt_array($curl, array(
            CURLOPT_URL => "http://ipinfo.io/ip",
            CURLOPT_PROXY => "127.0.0.1:{$proxy}",
            CURLOPT_COOKIEJAR => $cookieFile,
            CURLOPT_COOKIEFILE => $cookieFile,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => array(
                "X-Requested-With: XMLHttpRequest",
            )
        ));

        if (!empty($proxy)) {
            curl_setopt($curl, CURLOPT_PROXY, $proxy);
        }

        $error = null;
        $response = curl_exec($curl);
        curl_close($curl);

        if (empty($response)) {
            $error = curl_getinfo($curl);
        }

        return [$response, $error];
    }

    public static function responseJson($data, $state = 1)
    {
        echo json_encode(['status' => $state, 'data' => $data]);

        return true;
    }

    public static function updateHosts($ip)
    {
        try {
            $hosts = file_get_contents('/etc/hosts');

            preg_match('/.*(jazz.wifi).*/', $hosts, $matches);

            foreach ($matches as $match) {
                $hosts = str_replace($match, '', $hosts);
            }

            $hosts .= "{$ip} jazz.wifi\r\n";

            file_put_contents('/etc/hosts', $hosts);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
