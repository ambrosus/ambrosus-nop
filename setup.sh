#!/bin/bash

export DEBIAN_FRONTEND=noninteractive

apt update -y
apt upgrade -y

apt-get install -y curl python-dev build-essential nodejs npm git apt-transport-https ca-certificates curl software-properties-common jq

mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update -y
apt upgrade -y

apt-get install -y docker-ce docker-ce-cli containerd.io

curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-"$(uname -s)"-"$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

npm install -g yarn

git clone -b simplify-nop https://github.com/ambrosus/ambrosus-nop.git
cd ambrosus-nop || return

./update.sh

yarn install
yarn build
yarn start
