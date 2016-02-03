#!/bin/bash

npm install

if [ -d 'output_bak_temp' ]; then
    rm -rf output_bak_temp
fi

if [ -d 'output_bak' ]; then
    mv -f output_bak output_bak_temp
fi

if [ -d 'output' ]; then
    mv -f output output_bak
fi

gulp build