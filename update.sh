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

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source $HOME/.nvm/nvm.sh && \. $HOME/.nvm/nvm.sh
echo "The $(command -v nvm) has been installed."

DEFAULT_NODE_VERSION="14"
REQUIRED_NODE_VERSION=$(cat $PWD/package.json | grep -Eo '"node": "[^0-9][^0-9]?[0-9]+?' | grep -Eo '[0-9]+')
if [ "$REQUIRED_NODE_VERSION" = "" ]; then
    REQUIRED_NODE_VERSION=$DEFAULT_NODE_VERSION
fi

SYSTEM_NODE_VERSION=$(node -v | cut -d '.' -f1 | cut -b2-)
if [ "$SYSTEM_NODE_VERSION" = "" ] || [ "$SYSTEM_NODE_VERSION" != "$REQUIRED_NODE_VERSION" ]; then
    nvm install "$REQUIRED_NODE_VERSION"
fi
nvm use "$REQUIRED_NODE_VERSION"

yarn
yarn build
if [[ -f output/docker-compose.yml ]]; then
  yarn start update
  docker-compose -f output/docker-compose.yml pull
  docker-compose -f output/docker-compose.yml up -d
fi
