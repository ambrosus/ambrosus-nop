# Using Ambrosus NOP

After successfully installed Ambrosus Node you have `ambrosus-nop` directory
that contains all files related to the Node. To run configuration script you
have to change directory:

    cd ~/ambrosus-nop

And run configuration script:

    yarn start

Script will checks basic node stuff, shows notification if something wrong and
propose you several options:
- **Change node URL** - if you have Atlas, you can change its URL
- **Payouts** - request Atlas reward pay out
- **Retire** - retire Node
- **Finish NOP** - exit configuration console

Current status of Node can be viewed at /nodeinfo URL (if you have Atlas or
Hermes), for example https://my-cool-amb-node.com/nodeinfo

To update Ambrosus node software, run script:

    cd ~/ambrosus-nop
    ./update.sh

## Directories and important files

- **state.json** - this file contains all your node configuration, including
  private key, _do not share this file with anyone_.
- **output** (directory) - contains files were created during the installation
  process.
- **output/parity\_config.toml** - Parity config. Please change this file only
  if you know what are you doing.
- **output/docker-compose.yml** - Docker Compose config. Each part of Ambrosus
  node run in its own docker container. This file defines what and how will be
  run.
- **output/chain.json** - Ambrosus Network blockchain specification. Please do
  not change this file.
- **output/chains** (directory) - Blockchain data.
- **output/data** (directory) - Mongo DB data.

## Diagnostics

We provided a script to diagnose common problems. Run it and follow its
instructions.

    source <(curl -s https://nop.ambrosus.com/check.sh)

In order to see diagnostics and try to solve problems by yourself, you can use
following:

### nodeinfo

**/nodeinfo** URL (for Atlas and Hermes nodes) is a first source of information.
If it fails to open or return some error - your node is not working. Example
/nodeinfo output:

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
**workerLogs** - latest log messages. _Please note_, errors in this log don't mean that something is wrong, this log is mainly for developers.

### Logs

    cd ~/ambrosus-nop/output
    docker-compose logs --tail 25

This command shows logs of all components. You can specify number of log messages to output in **--tail** argument.

There are several components (for Atlas):

- atlas\_worker - download and store bundles
- atlas\_server - provide public API, shows /nodeinfo
- mongod - Mongo database store bundles and other data for Atlas
- parity - blockchain node, atlas\_worker use it to interact with Ambrosus
  Network

Let's talk about Parity logs.

    parity     | 2019-09-10 12:32:05 UTC Verifier #0 INFO import  Imported #1912475 0xdaf2…be13 (1 txs, 0.02 Mgas, 2 ms, 0.67 KiB)
    parity     | 2019-09-10 12:32:10 UTC Verifier #0 INFO import  Imported #1912476 0x3871…6230 (0 txs, 0.00 Mgas, 4 ms, 0.56 KiB)

As you can see Parity logs imports of blocks from blockchain. If everything
goes fine you should see new block every 5 seconds. And latest block have to
correspond with block number you in
[Ambrosus Explorer](https://explorer.ambrosus.com/). If it is not, your Parity
not in sync and node in total will not work.

## Problems and their fixes

First of all **check.sh** script provide some fixes. If it doesn't help or you
want to try manual fixes, you can try following:

### Parity not in sync

When you see in Parity logs that it stop syncing (the same block number repeat
at least several minutes), do this:

    cd ~/ambrosus-nop/output
    docker stop parity
    rm -rf chains
    curl -s https://backup.ambrosus.com/blockchain.tgz | tar zxpf -
    docker start parity

### Useful docker-compose commands

Show containers status:

    docker-compose ps

Show container logs:

    docker-compose logs parity

Watch logs:

    docker-compose logs -f

Restart all containers:

    docker-compose restart

Restart specific container:

    docker-compose restart parity

Recreate containers (safe, but do it if sure that you need it):

    docker-compose down
    docker-compose up -d

### Out of memory

Logs contains messages about "memory issues", that's mean that your instance or
server have not enough memory. Try to add some memory. We recommend at least
2GB of memory to run Ambrosus Node.

### Instance not respond

You can't access /nodeinfo url or login via ssh - restart instance.

### No challenge resolution on Atlas, no block reward on Apollo

Atlas: first check that Parity in sync (see above)
Apollo: also check Parity. If it's fine, wait for reward to appear (it could
take up 24 hours). Don't stop and try not to restart Apollo, it have to be
always online.

## Terminology

- Atlas
- Hermes
- Apollo
- Bundle
- Challenge

## FAQ
