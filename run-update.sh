#!/usr/bin/env bash
set -e

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source $HOME/.nvm/nvm.sh
echo "The $(command -v nvm) has been installed."

DEFAULT_NODE_VERSION="14"
REQUIRED_NODE_VERSION=$(cat $PWD/package.json | grep -Eo '"node": "[^0-9][^0-9]?[0-9]+?' | grep -Eo '[0-9]+')
if [ "$REQUIRED_NODE_VERSION" = "" ]; then
    REQUIRED_NODE_VERSION=$DEFAULT_NODE_VERSION
fi

SYSTEM_NODE_VERSION=$(nvm current | cut -d '.' -f 1 | cut -b 2-)
if [ "$SYSTEM_NODE_VERSION" = "" ] || [ "$SYSTEM_NODE_VERSION" != "$REQUIRED_NODE_VERSION" ]; then
    nvm install "$REQUIRED_NODE_VERSION"
fi

nvm use "$REQUIRED_NODE_VERSION"
nvm alias default "$REQUIRED_NODE_VERSION"

BLOCKCHAIN_DB_FILE_PATH=$(find ./output/chains -name "db_version")
BLOCKHAIN_DB_VERSION=$(cat $BLOCKCHAIN_DB_FILE_PATH)
BLOCKHAIN_DB_UPDATE_PATH=$(find ./output/chains -name "overlayrecent")
NETWORK_ENV=$(echo $BLOCKCHAIN_DB_FILE_PATH | cut -d/ -f4)

MIDDLE_ADDRESS_SYMBOL=$(echo "ibase=16; $(cat state.json | jq '.address' | awk '{print substr($0,23,1)}' |  tr a-z A-Z)" | bc)
UPDATE_PART=$(($MIDDLE_ADDRESS_SYMBOL%4))
if [ $UPDATE_PART -ne 2 ] ; then 
    exit 0
fi

if [ ! -d "3.1-db-upgrade-tool" ]; then
  git clone https://github.com/openethereum/3.1-db-upgrade-tool
fi

if [ 16 -gt $BLOCKHAIN_DB_VERSION ]; then
    apt-get -yq install cargo clang llvm
    cd 3.1-db-upgrade-tool
    docker container stop parity
    echo "I AGREE" | cargo run ../$BLOCKHAIN_DB_UPDATE_PATH
    cd ..
    rm -rf 3.1-db-upgrade-tool
fi

yarn
yarn build
if [ -f output/docker-compose.yml ]; then
  yarn start update
  docker-compose -f output/docker-compose.yml pull
  docker-compose -f output/docker-compose.yml down
  docker-compose -f output/docker-compose.yml up -d
fi
