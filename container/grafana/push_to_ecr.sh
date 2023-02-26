#!/bin/bash

accountId=`aws sts get-caller-identity --query Account --output text`
echo 'account_id: ' $accountId
echo 'region: ' $1

aws ecr get-login-password --region $1 | docker login --username AWS --password-stdin $accountId.dkr.ecr.$1.amazonaws.com

imageName='grafana_image_with_api'

echo 'image_name: ' $imageName

docker commit grafana_container $imageName

aws ecr create-repository \
--repository-name $imageName \
--image-scanning-configuration scanOnPush=true \
--region $1

docker tag $imageName:latest $accountId.dkr.ecr.$1.amazonaws.com/$imageName:latest
docker push $accountId.dkr.ecr.$1.amazonaws.com/$imageName:latest
