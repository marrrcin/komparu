#!/bin/bash

echo 'Starting...'
cd ./backend && composer install && composer run start &  backend=$!
cd ./frontend && npm install && npm run start &  frontend=$!
wait $backend
wait $frontend
