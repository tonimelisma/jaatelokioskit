#!/bin/sh

curl https://www.pingviini.fi/jaatelokioskit/ | tr '\n' ' ' | sed 's/.*kioskData = //;s/\].*/\]/' > pingviini.json
