#!/usr/bin/env bash
set -ex

cd "$( dirname "${BASH_SOURCE[0]}" )"
if [[ -d /etc/cron.daily ]]; then
  cronfile=/etc/cron.daily/ambrosus-nop
  cat > $cronfile <<-END
	#!/bin/sh
	~/ambrosus-nop/update.sh
	END
  chmod +x $cronfile
fi
git pull origin master
yarn
yarn build
if [[ -f output/docker-compose.yml ]]; then
  yarn start update
  docker-compose -f output/docker-compose.yml pull
  docker-compose -f output/docker-compose.yml up -d
fi
