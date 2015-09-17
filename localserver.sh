#!/usr/bin/env sh
echo
echo Starting remind-frontend web server at http://localhost:8000/
echo CONFIG is ...
cat js/config.js
python -m SimpleHTTPServer
