#!/bin/sh

curl https://www.pingviini.fi/jaatelokioskit/ | tr '\n' ' ' | sed 's/.*var bgmpData.*markers : //;s/};.*//' > pingviini.json
