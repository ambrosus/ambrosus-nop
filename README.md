[![Build Status](https://travis-ci.com/ambrosus/ambrosus-nop.svg?token=3AeQ6aqcxJ7ZUnsz6KJt&branch=master)](https://travis-ci.com/ambrosus/ambrosus-nop)

# The Ambrosus Node Onboarding Package
The Ambrosus Node Onboarding Package (NOP) is a command-line tool which makes it easier for Ambrosus Masternodes operators to register, onboard and operate new nodes on AMB-NET (Apollo, Atlas and Hermes nodes).

**ATTENTION:** Although anyone will be able to setup a virtual environment and run NOP, the last step (running the masternode application) will require your node to have been whitelisted. Request will be send automatically at the end of setup script.

## Table of Contents
  - **[Overview](#overview)**
  - **[Installation](#installation)**
  - **[Setting up the NOP](#setting-up-the-nop)**
  - **[Troubleshooting](#troubleshooting)**
  - **[Contribution](#contribution)**
  - **[Alternative community guide](#alternative-community-guide)**

## Overview

Running an AMB-NET masternode is a three-step process:
1. Prepare a virtual machine environment
2. Run NOP to configure your Masternode
3. Run the masternode application

## Installation

There are two ways to seup your virtual machine environment to run an Ambrosus masternode:

1. Use a ready-made machine image build and maintained by the Ambrosus team
2. Install the software and dependencies yourself on a machine

The first option is simpler as it requires less technical experience. However, for obvious security reasons setting a machine from scratch is a more secure approach.

##### Creating a Droplet

Typical DigitalOcean node (2 GB / 2 CPUs, 60 GB SSD disk, 3 TB transfer) should be good for any type of node

There is detailed step by step information how to setup droplet on digitalocean https://www.digitalocean.com/docs/droplets/how-to/create/

Our brief instructions:

Create an account and log in. Press 'Droplets' and then 'Create Droplet'. Use the OS Ubuntu and then choose what machine preferences and which data center suits you. Then either create a SSH key which you will use to access the instance or if you do not choose one you will get a password to your email. Write a hostname that suits you and launch the instance.

Now lets setup a firewall for the instance to make sure the instance is accessible only through specific ports. Your instance should be launched and you should see it by pressing 'Droplets'. Click on the instance you launched and then press 'Networking' -> 'Manage Firewalls'.
Add rules for the following ports according to the node you are running:
 - Hermes & Atlas:
    - Port range: 80
        Protocol: **TCP**
    - Port range: 443
        Protocol: **TCP**
    - Port range: 30303
        Protocol: **TCP**
    - Port range: 30303
        Protocol: **UDP**
 - Apollo:
    - Port range: 30303
        Protocol: **TCP**
    - Port range: 30303
        Protocol: **UDP**

The source can have the default values. When you have added the ports apply them to your droplet and then create the firewall.

Every cloud should have a similar setup.

## Setting up the NOP

##### Important notice

To avoid issues with installation process, we strongly encourage you to use PC (not android or similar terminals) to install NOP.

##### Accessing the Virtual Machine
To access the instance type the following command:
###### Without SSH key
``` ssh root@<The instances IP address>```
Now enter the password that you received by Email from digital ocean.
###### With SSH key
```ssh -i <The SSH key you specified> root@<The IP address>```

Once you're logged in on your virtual machine, run the following commands (1 line per command):
```

```
1. source <(curl -s https://nop.ambrosus.io/setup.sh)

Choose the necessary options:
- network (main);
- input already existing private key or create a new one;
- add IP URL of your droplet (Atlas only)
- enter your email

Enter manually the required sentence with your name in it (don’t forget to add period in the end of the sentence).

Afterwards wait till you get whitelisted

```
2. NB! Please note that you need to have successfully transferred your stake in AMB for it to get whitelisted. 

First you need to connect Metamask to AMB-Net. Instructions are here 
https://blog.ambrosus.io/how-to-connect-to-amb-net-9e4d6d002009.
Your address in ETH network = your address in AMB network.

Amount to transfer = X AMB (your desired stake amount) 
+ 100 AMB (for challenge before first 28 days period) 

You will be notified once your node gets whitelisted and afterwards you may proceed to step 3.


```
3. Once your node whitelisted

Run ./setup2.sh

Choose the necessary options on the menu;
Choose “Finish NOP” on menu.

You are successfully onboarded.

## Contribution
We will accept contributions of good code that we can use from anyone.
Please see [CONTRIBUTION.md](CONTRIBUTION.md)

Before you issue pull request:
* Make sure all tests pass.
* Make sure you have test coverage for any new features.

## Troubleshooting
If you are having docker issues [DigitalOcean has a indepth guide for installing docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04).

## Alternative community guide

There also detailed alternative intructions made by our community: https://www.reddit.com/r/ambrosus/comments/c8lnrf/mainnet_onboarding_guide/
