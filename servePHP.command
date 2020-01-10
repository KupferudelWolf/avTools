#!/usr/bin/env bash
# Copy this to the directory you wish to serve.

cd "$(dirname "$0")"

PORT=$1

if [[ $1 -eq 0 ]]
then
  read -p 'Port: ' PORT
  PORT=${PORT:-8000}
fi

if [ $PORT -lt 1000 ]
then
  PORT=$(($PORT+8000))
fi

if [ $PORT -lt 1025 ] || [ $PORT -gt 49151 ]
then
  echo $PORT 'is an invalid port. Defaulting to 8000.'
  let PORT 8000
fi

echo
open http://localhost:$PORT
php -S 127.0.0.1:$PORT
