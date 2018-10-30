[![Build Status](https://travis-ci.com/ambrosus/ambrosus-nop.svg?token=3AeQ6aqcxJ7ZUnsz6KJt&branch=master)](https://travis-ci.com/ambrosus/ambrosus-nop)

# The Ambrosus Node Onboarding Package
The Ambrosus Node Onboarding Package (NOP) is a command-line tool which makes it easier for Ambrosus Masternodes operators to register, onboard and operate new nodes on AMB-NET (Apollo, Atlas and Hermes nodes).

**ATTENTION:** Although anyone will be able to setup a virtual environment and run NOP, the last step (running the masternode application) will require your node to have been whitelisted. For this, you must have first [applied via our official form](http://tech.ambrosus.com/apply) and then be formally invited to join an onboarding wave per email. Sending us your whitelisting details before you have applied and been invited will simply be ignored at this stage.

## Table of Contents
  - **[Overview](#overview)**
  - **[Installation](#installation)**
    - **[Prebuilt Machine Images](#prebuilt-machine-images)**
        - **[Amazon Web Services](#amazon-web-services)**
    - **[Custom Machine Image](#custom-machine-image)**
  - **[Using the NOP](#using-the-nop)**
  - **[Running the Masternode](#running-the-masternode)**
  - **[Insight and Statistics of the node](#insight-and-statistics-of-the-node)**
  - **[Troubleshooting](#troubleshooting)**
  - **[Developing and contributing](#running-tests-and-linting)**

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

### Prebuilt Machine Images
Currently a prebuilt image is only supported on Amazon Web Services.

#### Amazon Web Services
Go to [Amazon Web Services](https://aws.amazon.com) and log in or create an account. When you have logged in press services -> ec2. Then chose a region that suits you, which can found in the top right of your screen. Now you should press a blue button which says 'Launch Instance'. Now search for the machine image 'ambrosus-nop' and it should appear in the section community AMIs. This should lead to the below picture:
![Ambrosus](https://i.imgur.com/er9ohSX.png)
Press select and chose your desired instance type. There is no configuration needed after chosing instance type and the default values should work, same goes for the storage (although larger storage the the default 8 gb is recommended). The tags are optional as well, a tip would be to add a tag with the key 'Name' and a custom name for it (could be the name of the node you are running).  The 6th step configuring security group is important as it is the ports needed to be opened for incoming connections to the node. The following ports are needed for each different node:

 - Hermes & Atlas:
    - Port range: 9876
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

For all ports add the source 0.0.0.0/0.

A sample below for hermes/atlas:
![Ambrosus](https://i.imgur.com/ltqZRAI.png)
Now you can proceed and launch the instance. A prompt should pop up asking you for a key pair. This is used to access the instance through ssh, either create a new on or use a existing one if you have used ssh previously. If you create a new PEM file, store it somewhere securely and do not lose it as it is needed to access the instance.
You can access the instance by typing ```ssh -i <Location of your PEM file> ubuntu@<The public ip address of the instance>```

Now a instance should be created and you can carry on to the **[Using the NOP](#using-the-nop)** section.

### Custom Machine Image
You can launch an Ambrosus node from any cloud provider but you will have to install the prerequisites yourself. We will go through a clean installation on a DigitalOcean machine image.

##### Creating a Droplet
Create an account and log in. Press 'Droplets' and then 'Create Droplet'. Use the OS Ubuntu and then choose what machine preferences and which data center suits you. Then either create a SSH key which you will use to access the instance or if you do not choose one you will get a password to your email. Write a hostname that suits you and launch the instance.

Now lets setup a firewall for the instance to make sure the instance is accessible only through specific ports. Your instance should be launched and you should see it by pressing 'Droplets'. Click on the instance you launched and then press 'Networking' -> 'Manage Firewalls'.
Add rules for the following ports according to the node you are running:
 - Hermes & Atlas:
    - Port range: 9876
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

##### Installation requirements
To access the instance type the following command:
###### Without SSH key
``` ssh root@<The instances IP address>```
Now enter the password that you received by Email from digital ocean.
###### With SSH key
```ssh -i <The SSH key you specified> root@<The IP address>```

Now it would be recommeneded that you create an user account with sudo privileges instead of running from root. Enter the following commands in your terminal:
```
adduser <your desired username>
```
Fill in your details and then continue with:
```
usermod -aG sudo <your username>
su - <your username>
```
Test if you can run sudo commands from the user you created
```
sudo ls -la /root
````
If you have the correct permission and a directory gets listed everything went fine. If it did not work you can check [this guide](https://www.digitalocean.com/community/tutorials/how-to-create-a-sudo-user-on-ubuntu-quickstart).

If you have created an user it would be advised to add the user to a docker group to not have to use sudo. Enter the following commands in your terminal:
```
sudo groupadd docker
sudo usermod -aG docker $USER
```
Restart your virtual machine to make sure the changes take effect. When you have restarted run ```docker run hello-world``` and it should work without sudo.

You will need to run a few commands (see below) to install the various tools, packages, and dependencies to execute NOP and we have put a [video online that show how it should look like](https://www.youtube.com/watch?v=VCVwLIoiti8).

Once you're logged in on your virtual machine, run the following commands (1 line per command):
```
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt install git
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
npm install -g yarn
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
sudo apt install docker-ce
sudo curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```
If you've made it until here, your environment should be ready to run NOP. You can now run ```sudo systemctl status docker``` to check if docker is running fine. Your should see something like this:

```
root@ubuntu-s-1vcpu-1gb-ams3-01:~# systemctl status docker
● docker.service - Docker Application Container Engine
   Loaded: loaded (/lib/systemd/system/docker.service; enabled;
   Active: active (running) since Mon 2018-10-08 11:30:21 UTC;
     Docs: https://docs.docker.com
 Main PID: 9496 (dockerd)
    Tasks: 18
   CGroup: /system.slice/docker.service
           ├─9496 /usr/bin/dockerd -H fd://
           └─9517 docker-containerd --config /var/run/docker/co
```

## Using the NOP

Now your environment is ready, you can clone the NOP repo and build it using the following commands:
```
git clone https://github.com/ambrosus/ambrosus-nop.git
cd ambrosus-nop
yarn install
yarn build
```
Now, you can run NOP using the following commands:

```
cd ~/ambrosus-nop
yarn start
```

*Note: the location can vary depending on where you cloned the repository.*

NOP performs two key steps: 1. whitelisting of your address, and 2. onboarding of your node. The aim of the first step is to whitelist your node, which is done manually by the Ambrosus team, and for that you will have to send your node details to us (the text displayed in your terminal when your run NOP the first time), which looks like this:

![Alt text](docs/nop-output.png?raw=true "NOP Output")

**This first step will generate a file called ```state.json```, which contains your private key (you can see the contents with this command ```less ~/ambrosus-nop/state.json```). Please save that private key somewhere safe (outside the virtual machine) and DO NOT send this file to anyone!**

If you have been invited in one of the waves, we will rapidly whitelist your address (and send you test token if you're on test-net) and confirm you're ready to onboard.

The aim of the second step is to onboard your node so you can actually run it. This can only be done once your address has been whitelisted and the address of your node has sufficient Amber Tokens required for the node type. For this, all you need to do is to run again NOP using ```yarn start```.

When the onboarding is complete, the NOP will fill out variables in the docker-compose file specific to your onboarded node, and you'll be able to run it.

If you want to reset the process you will have to type the following command.

```
cd ~/ambrosus-nop
rm state.json
```

**Warning: this deletes state.json and the private key generated! Make sure you have stored your private key somewhere safe before**.

##### Ambrosus prebuilt machine image
If you're using a ready-made machine image, you can run NOP simply with ```ambrosus-nop```.

If you want to restart the process run ```ambrosus-nop-reset``` .

**Warning: this deletes state.json and the private key generated! Make sure you have stored your private key somewhere safe before**.

## Running the Masternode

Now that your machine has been successfully setup and NOP has completed, you're now finally able to start the masternode application.

### Ambrosus pre-built machine image
You can run the following command for starting your node:
-  ```start-node```

And stopping the node with
- ```stop-node```

### Custom image
Enter the directory where you cloned the repository, we will assume you followed this guide and it is in the home directory.
``` cd ~/ambrosus-nop```.
Run ```docker-compose up -d``` to start the node you onboarded.

You can run ```docker-compose stop``` to stop the node.

## Insight and statistics of the node
To check statistics and get insights of the node you are running you will be able in the future to visit the Ambrosus dashboard.

For further details of what is happening within the docker containers you can use ```docker ps``` to find container IDs and then write ```docker logs <container id>``` to see the logs.

## Running tests and linting

Install the dependencies
```sh
yarn install
```

Run the tests
```sh
yarn test
```

Run the linter:
```sh
yarn dev:lint
```

## Building an clean-up
Building consists of transpiling the source code. It is performed by running:
```sh
yarn build
```

## Running in development mode

Running in development mode (transpiled on the run with debugging enabled):
```sh
yarn dev:start
```

## Contribution
We will accept contributions of good code that we can use from anyone.
Please see [CONTRIBUTION.md](CONTRIBUTION.md)

Before you issue pull request:
* Make sure all tests pass.
* Make sure you have test coverage for any new features.

## Troubleshooting
If you are having docker issues [DigitalOcean has a indepth guide for installing docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04).
