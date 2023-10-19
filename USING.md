# Using Ambrosus NOP

After having successfully installed Ambrosus Node, you have an `ambrosus-nop`
directory that contains all files related to the Node. To run configuration
script you have to change the directory first:

    cd ~/ambrosus-nop

and then run configuration script:

    yarn start

The script checks basic node details, shows notifications if something is wrong
and offers several options:
- **Change node URL** - if you hold an Atlas, you can change its URL
- **Payouts** - request Atlas reward payout
- **Retire** - retire Node
- **Finish NOP** - exit configuration console

Current status of the Node can be viewed at /nodeinfo URL (if you hold an Atlas), 
for example https://my-cool-amb-node.com/nodeinfo

To update Ambrosus node software, run the script:

    cd ~/ambrosus-nop
    ./update.sh

## Directories and important files

- **state.json** - this file contains all your node configuration, including
  private key, _do not share this file with anyone_.
- **output** (directory) - contains files that were created during the
  installation process.
- **output/parity\_config.toml** - Parity config. NB! Please change this file
  only if you know what you're doing.
- **output/docker-compose.yml** - Docker Compose config. Each part of Ambrosus
  Node runs in its own docker container. This file defines what and how will be
  run.
- **output/chain.json** - AMB-NET blockchain specification. NB! Please do
  not change this file.
- **output/chains** (directory) - Blockchain data.
- **output/data** (directory) - Mongo DB data.

## Diagnostics

We provided a script to diagnose common problems. Run it and follow its
instructions.

    source <(curl -s https://nop.ambrosus.io/check.sh)

In order to see diagnostics results and try to solve problems by oneself, one
can use the following:

### Nodeinfo

**/nodeinfo** URL (for Atlas nodes) is the primary source of
information.  If it fails to open or returns some error - the Node is not
operating properly. Example /nodeinfo output:

```json
{
  "commit": "995579b",
  "version": "1.1.1",
  "nodeAddress": "0x4b8987bAb7d87bAb7d4b898aa0e7587bAb7d8aa0",
  "mode": {
    "mode": "normal"
  },
  "workerLogs": [
    {
      "timestamp": "2019-09-10T11:52:22.734Z",
      "message": "Bundle fetched",
      "blockNumber": 2399834,
      "logIndex": 0,
      "transferId": "0x9048cfae83b83bea6a7cf9bf9956237cf9ea6a7cf9bf9956237cf9380d0ac41c",
      "donorId": "0x87bAb7d4b89887bAb7d87bA98aa0e7587bAb7d81",
      "bundleId": "0x85f430add511074c7a1cb341eadbc5dfdb123f9956237cf9feaa610f894cbd42",
      "count": 1
    },
    "more messages.."
  ]
}
```

**commit** - git commit hash of Ambrosus Node software  
**version** - Ambrosus Node version  
**workerLogs** - latest log messages. _Please note_, errors in this log don't
mean that something is wrong, this log is mainly for developers.  

### Logs

    cd ~/ambrosus-nop/output
    docker-compose logs --tail 25

This command shows logs of all components. You can specify number of log
messages to output in **--tail** argument.

There are several components (for Atlas):

- atlas\_worker - downloads and stores bundles
- atlas\_server - provides public API, shows /nodeinfo
- mongod - Mongo database stores bundles and other data for Atlas
- parity - blockchain node, atlas\_worker use it to interact with AMB-NET

Let's talk about Parity logs.

    parity     | 2019-09-10 12:32:05 UTC Verifier #0 INFO import  Imported #1912475 0xdaf2…be13 (1 txs, 0.02 Mgas, 2 ms, 0.67 KiB)
    parity     | 2019-09-10 12:32:10 UTC Verifier #0 INFO import  Imported #1912476 0x3871…6230 (0 txs, 0.00 Mgas, 4 ms, 0.56 KiB)

As you can see Parity imports blocks from network. If everything goes fine, you
should see new block every 5 seconds. And the latest block number in your
Parity logs should match the one in
[Ambrosus Explorer](https://explorer.ambrosus.io/).
If it doesn't - your Parity is not in sync and the Node is not operating.

## Problems and their fixes

First of all **check.sh** script provides some fixes. If it doesn't help or you
want to try manual fixes, you can try the following:

### Parity not in sync

When you see in Parity logs that it stoped syncing (the same block number
repeats at least for several minutes), run the following:

    cd ~/ambrosus-nop/output
    docker stop parity
    rm -rf chains
    curl -s https://backup.ambrosus.io/blockchain.tgz | tar zxpf -
    docker start parity

### Useful docker-compose commands

Show container status:

    docker-compose ps

Show container logs:

    docker-compose logs parity

Watch logs:

    docker-compose logs -f

Restart all containers:

    docker-compose restart

Restart specific container:

    docker-compose restart parity

Recreate containers (safe, but do it if you're sure that you need it):

    docker-compose down
    docker-compose up -d

### Out of memory

If logs contain messages about memory issues, it means that your instance or
server don't hold enough memory. Try to increase it. We recommend at least 2GB
of memory to run an Ambrosus Node.

### Instance not responding

You can't access /nodeinfo url or login via ssh - restart your instance.

### No challenge resolution on Atlas, no block reward on Apollo

Atlas: first check if Parity is in sync (see above)

Apollo: also check Parity. If it's fine, wait for reward to appear (it could
take up to 24 hours). Don't stop and try not to restart Apollo, it has to be
always online.

## Terminology

- **Ambrosus Node** - Ambrosus Atlas or Apollo.
- **Atlas** - node that stores bundles and earns ambers.
- **Apollo** - validator node, it creates blocks.
- **Asset** - object, for example product
- **Events** - events that happen to Assets
- **Challenge** - Atlas "request" to store a bundle, if smart-contract confirms
  this request, challenge turns into "resolved".
