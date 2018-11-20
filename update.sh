#!/usr/bin/env bash
set -ex

cd "$( dirname "${BASH_SOURCE[0]}" )"
git pull origin master
docker pull ambrosus/ambrosus-node:latest
