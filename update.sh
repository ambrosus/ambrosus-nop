#!/usr/bin/env bash
set -e
cd "$( dirname "$(readlink -f "${BASH_SOURCE[0]}")" )"
if [[ -d /etc/cron.daily ]]; then
  rm -f /etc/cron.daily/amb*-nop
  ln -fs $PWD/update.sh /etc/cron.daily/ambrosus-nop
fi

cat > /etc/sysctl.d/10-ambrosus.conf <<-END
net.ipv6.conf.all.disable_ipv6=1
END
sysctl -p /etc/sysctl.d/10-ambrosus.conf

git checkout yarn.lock
git pull origin master

chmod +x run-update.sh
source run-update.sh
