<?php

namespace App;

require_once 'Util.php';

/**
 * Class IP
 * @package App
 */
class IP
{

    public function getRand($ip)
    {
        $path = 'mark_lang.w.xml';
        list($response, $error) = Util::send($ip, $path);

        if (!empty($error)) {
            return $error;
        }

        preg_match('/<rand>(.*)<\/rand>/', $response, $matches);

        if (count($matches) > 1) {
            return $matches[1];
        }

        return false;
    }

    public function changeIp($ip, $proxy)
    {
        $rand = $this->getRand($ip);

        if (empty($rand)) {
            Util::responseJson('Could not get Rand', 0);
            return;
        }

        $username = 'admin';
        $password = 'admin';
        $password = md5($rand . $password);
        $path = 'wxml/post_login.xml';
        list($response, $error) = Util::send($ip, $path, 'POST',
            ['Name' => $username, 'password' => $password, 'rand' => $rand]);

        if (!empty($error)) {
            return Util::responseJson('Something went wrong: ' . $error, 0);
        }

        preg_match('/<login_check>(.*)<\/login_check>/', $response, $matches);

        if (count($matches) > 1) {
            $loginCheck = (int)$matches[1];

            if ($loginCheck === 3) {
                $res = $this->markConnection($ip);

                if (!empty($res['status'])) {
                    /*if ($res['conn'] == 1) {
                        $this->disconnect($ip);
                    }*/

                    $this->connect($ip);
                }

                $response = $this->setNetMode($ip);

                if (!empty($response['status'])) {
                    $ip = $this->getPublicIP($proxy);

                    return Util::responseJson(['msg' => 'Successfully', 'ip' => $ip]);
                }
            }

            return Util::responseJson('Something went wrong', 0);
        }

        return Util::responseJson('Something went wrong', 0);
    }

    public function connect($ip, $conn = 0)
    {
        $path = 'wxml/conn.xml';
        $data = ['conn' => $conn];

        list($response, $error) = Util::send($ip, $path, 'POST', $data);

        if (!empty($error)) {
            return ['status' => false, 'error' => $error];
        }

        preg_match('/<req>(.*)<\/req>/', $response, $matches);

        if (count($matches) > 1) {
            $req = (int)$matches[1];

            return ['req' => $req, 'status' => true];
        }

        return ['status' => false];
    }

    public function disconnect($ip)
    {
        return $this->connect($ip, 1);
    }

    public function markConnection($ip)
    {
        $path = 'mark_conn.w.xml';

        list($response, $error) = Util::send($ip, $path);

        if (!empty($error)) {
            return ['status' => false];
        }

        preg_match('/<netstatus>(.*)<\/netstatus>/', $response, $matches);

        if (count($matches) > 1) {
            $netStatus = (int)$matches[1];

            $conn = ($netStatus == 8) ? 0 : 1;

            return ['status' => true, 'conn' => $conn];
        }

        return ['status' => false];
    }

    public function getNetMode($ip)
    {
        $path = 'mark_set_net.w.xml';
        list($response, $error) = Util::send($ip, $path);

        if (!empty($error)) {
            return ['status' => false];
        }

        preg_match('/<mode>(.*)<\/mode>/', $response, $matches);

        if (count($matches) > 1) {
            $netMode = (int)$matches[1];

            return ['status' => true, 'netMode' => $netMode];
        }

        return ['status' => false];
    }

    public function setNetMode($ip)
    {
        $netModeResponse = $this->getNetMode($ip);

        if (empty($netModeResponse['status'])) {
            return ['status' => false];
        }

        $currentNetMode = $netModeResponse['netMode'];
        $newNetMode = ($currentNetMode == 1) ? 0 : 1;

        $path = 'wxml/set_net.xml';
        $data = [
            'dial_mode' => 0,
            'net_mode' => $newNetMode,
            'apn_index' => 0,
            'apn_name' => 'Jazz',
            'user' => '',
            'pwd' => '',
            'apn' => '',
            'number' => '',
            'upnp' => 0,
            'ping' => 0,
            'wan_access' => 0,
            'dns_mode' => 0,
            'pri_dns' => '',
            'sec_dns' => '',
            'ip_mode' => 2,
        ];

        list($response, $error) = Util::send($ip, $path, 'POST', $data);

        if (!empty($error)) {
            return ['status' => false];
        }

        preg_match('/<commit>(.*)<\/commit>/', $response, $matches);

        if (count($matches) > 1) {
            $netStatus = (int)$matches[1];

            $status = ($netStatus == 1) ? true : false;

            return ['status' => $status];
        }

        return ['status' => false];
    }

    public function getPublicIP($proxy)
    {
        list($response, $error) = Util::checkPublicIp($proxy);

        if (!empty($error)) {
            return ['status' => true, 'ip' => $response];
        }

        return ['status' => false];
    }

}
