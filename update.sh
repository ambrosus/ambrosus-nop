#!/usr/bin/env bash
set -ex

cd "$( dirname "${BASH_SOURCE[0]}" )"
git pull origin master
yarn
yarn build
if [[ -f output/docker-compose.yml ]]; then
  yarn start update
  docker-compose -f output/docker-compose.yml pull
fi
