#!/bin/bash

docker build -t grafana_image .

docker run -d \
    -p 3000:3000 \
    --name=grafana_container \
    grafana_image
