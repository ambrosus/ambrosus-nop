#!/usr/bin/env bash

set -e

execute="mocha --require ts-node/register"

for testfile; do
  $execute "$testfile"
done

if [ "$#" = "0" ]; then
  $execute "test/**/*.ts"
fi
