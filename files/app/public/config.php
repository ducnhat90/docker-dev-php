<?php

$publicPath = dirname(__FILE__);
if (!defined('PUBLIC_PATH')) {
    define('PUBLIC_PATH', $publicPath);
}
$rootPath = dirname(dirname(__FILE__));
if (!defined('ROOT_PATH')) {
    define('ROOT_PATH', $rootPath);
}
