#!/bin/bash

/init.sh

php Init.php

rm -rf /etc/squid/squid.conf
cp $(pwd)/squid.conf /etc/squid/squid.conf

echo "Start Squid Server"
service squid start
