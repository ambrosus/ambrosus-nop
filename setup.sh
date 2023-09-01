#!/bin/bash

# Change /etc/needrestart/needrestart.conf
sed -i 's/^#\$nrconf{restart} = '\''i'\'';/$nrconf{restart} = '\''a'\'';/' /etc/needrestart/needrestart.conf

#Intall node.js
apt-get update -y
apt-get install -y ca-certificates curl gnupg
mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo \
  "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
apt-get update -y
apt-get install -y nodejs

apt-get install -y python-dev
apt-get install -y build-essential
apt-get install -y npm
apt-get install -y git
apt-get install -y apt-transport-https software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o -y /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io
curl -L https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-"$(uname -s)"-"$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

apt-get install -y jq
npm install -g yarn

# todo remove branch simplify-nop
git clone -b update https://github.com/ambrosus/ambrosus-nop.git
cd ambrosus-nop || return

./update.sh

yarn install
yarn build
yarn start
