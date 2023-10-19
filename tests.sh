#!/usr/bin/env bash

# set -e

errorCount=0
scripts=""
execute="mocha --require ts-node/register"

exec_script() {
  file="\n  - $1";
  $execute $1;
  if [ "$?" -ne 0 ]; then 
    scripts="$scripts$file";
    errorCount=$((errorCount + 1)) 
  fi;
}

for testfile; do
  exec_script $testfile;
done

if [ "$#" = "0" ]; then
    while read file; do 
      exec_script $file 
    done < <(find ./test -name '*.ts' -type f);
fi

if [[ "$errorCount" -gt 0 ]]; then
  echo -e "⛔ \033[0;31m$errorCount Script(s) of tests are failed:\n$scripts\033[0m\n\n";
  exit 1;
else 
  echo -e "✅ \033[0;32m All tests completed.\033[0m\n\n";
fi
