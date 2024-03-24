#!/bin/bash

DEFAULT_DIR=${HOME}/dev/bulletin/bulletin/client/build
DEFAULT_HTTPS_CRT=${HOME}/sg1.crt
DEFAULT_HTTPS_KEY=${HOME}/sg1.key

# Use the CLIENT_DIR var to set the path to the client build directory
CLIENT_DIR="${CLIENT_DIR:-$DEFAULT_DIR}"
HTTPS_CRT="${HTTPS_CRT:-$DEFAULT_HTTPS_CRT}"
HTTPS_KEY="${HTTPS_KEY:-$DEFAULT_HTTPS_KEY}"

CLIENT_DIR=$CLIENT_DIR HTTPS_CRT=$HTTPS_CRT HTTPS_KEY=$HTTPS_KEY  uwsgi --ini uwsgi.ini
