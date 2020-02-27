#!/usr/bin/env bash
set -ex

cd "$( dirname "$(readlink -f "${BASH_SOURCE[0]}")" )"
if [[ -d /etc/cron.daily ]]; then
  rm -f /etc/cron.daily/amb*-nop
  ln -fs $PWD/update.sh /etc/cron.daily/ambrosus-nop
fi
git pull origin master
yarn
yarn build
if [[ -f output/docker-compose.yml ]]; then
  yarn start update
  docker-compose -f output/docker-compose.yml pull
  docker-compose -f output/docker-compose.yml up -d
fi
