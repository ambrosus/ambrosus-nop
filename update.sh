#!/usr/bin/env bash
set -ex

cd "$( dirname "$(readlink -f "${BASH_SOURCE[0]}")" )"
if [[ -d /etc/cron.daily ]]; then
  rm -f /etc/cron.daily/amb*-nop
  ln -fs $PWD/update.sh /etc/cron.daily/ambrosus-nop
fi

cat > /etc/sysctl.d/10-ambrosus.conf <<-END
net.ipv6.conf.all.disable_ipv6=1
END
sysctl -p /etc/sysctl.d/10-ambrosus.conf

git pull origin master

###

 # install or update nvm
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

 # set default node.js version
DEFAULT_NODE_VERSION="14"

 # check required node.js version
REQUIRED_NODE_VERSION=$(cat $PWD/package.json | grep -Eo '"node": "[^0-9][^0-9]?[0-9]+?' | grep -Eo '[0-9]+')
if [ "$REQUIRED_NODE_VERSION" = "" ]; then
    REQUIRED_NODE_VERSION=$DEFAULT_NODE_VERSION
fi

 # check system wide node.js version
SYSTEM_NODE_VERSION=$(node -v | grep -Eo 'v[0-9]+' | cut -b 2-3)
if [ "$SYSTEM_NODE_VERSION" = "" ]; then
    nvm install "$REQUIRED_NODE_VERSION"
elif [ "$SYSTEM_NODE_VERSION" != "$REQUIRED_NODE_VERSION" ]; then
    nvm install "$REQUIRED_NODE_VERSION"
fi

 # use required version
nvm use "$REQUIRED_NODE_VERSION"

###

yarn
yarn build
if [[ -f output/docker-compose.yml ]]; then
  yarn start update
  docker-compose -f output/docker-compose.yml pull
  docker-compose -f output/docker-compose.yml up -d
fi
