#!/bin/sh
# uwsgi --ini /uwsgi.ini
uwsgi --ini uwsgi.ini

# uwsgi --socket 0.0.0.0:9999 --protocol=http -w bulletin.server:app