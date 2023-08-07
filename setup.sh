#!/bin/bash

apt-get update
apt install -y curl
apt install -y python-dev
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
apt-get install -y build-essential
apt-get install -y nodejs
apt install -y npm
apt install -y git
apt install -y apt-transport-https ca-certificates curl software-properties-common
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io
curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-"$(uname -s)"-"$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

apt install -y jq
npm install -g yarn

# todo remove branch simplify-nop
git clone -b simplify-nop https://github.com/ambrosus/ambrosus-nop.git
cd ambrosus-nop || return

./update.sh

yarn install
yarn build
yarn start
