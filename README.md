[![Build Status](https://travis-ci.com/ambrosus/ambrosus-nop.svg?token=3AeQ6aqcxJ7ZUnsz6KJt&branch=master)](https://travis-ci.com/ambrosus/ambrosus-nop)

# The Ambrosus Node Onboarding Package
Software package for assisting perspective node operators with the registration, onboarding and instalation of new nodes. 

## Table of Contents
  - **[Installation](#installation)**
    - **[Prebuilt Machine Images](#prebuilt-machine-images)**
        - **[Amazon Web Services](#amazon-web-services)**
        - Google Cloud
    - **[Custom Machine Image](#custom-machine-image)**
  - **[Using the NOP](#using-the-nop)**
  - **[Insight and Statistics of the node](#insight-and-statistics-of-the-node)**
  - **[Troubleshooting](#troubleshooting)**
  - **[Developing and contributing](#running-tests-and-linting)**

## Installation
The installation covers two different types of images prebuilt images and custom images. Prebuilt images are recommended by us, they are built by us and have all of the requirements already installed. Custom images are your own images that you want to use, or fresh images with nothing on them. 
### Prebuilt Machine Images
Currently we have a public image on Amazon Web Services, but soon on other clouds as well. Only some clouds have public images supported, as soon as other clouds have the functionality supported we will add machine images there too. 

#### Amazon Web Services
Go to aws.amazon.com and log in if you have an account, otherwise create an account. When you have logged in press services -> ec2. Then chose a region that suits you, this can found in the top right of your screen. Now you should press a blue button which says 'Launch Instance'. Now search for the machine image 'ambrosus-nop' and it should appear in the section community AMIs. This should lead to the below picture:
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
Now you can proceed and launch the instance. A prompt should pop up asking you for a key pair. This is used to access the instance through ssh, either create a new on or use a existing one if you have used ssh previously. You can access the instance by typing ```ssh -i <Location of your PEM file> ubuntu@<The public ip address of the instance>```

Now a instance should be created and you can carry on to the **[Using the NOP](#using-the-nop)** section.

#### Google Cloud
*No machine image yet, will be added soon*

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

The source can have the default values.

Every cloud should have a similar setup.

##### Installation requirements
To access the instance type the following command:
###### Without SSH key
``` ssh root@<The instances IP address>```
Now enter the password that you received by Email from digital ocean.
###### With SSH key
```ssh -i <The SSH key you specified> root@<The IP address>```

[Now it would be recommeneded that you create an user account with sudo privileges instead of running from root.](https://www.digitalocean.com/community/tutorials/how-to-create-a-sudo-user-on-ubuntu-quickstart)
And if you create an user it would be advised to [add the user to a docker group to not have to use sudo](https://docs.docker.com/install/linux/linux-postinstall/).

Run the following commands to install the prerequisites for running a node:
```
sudo apt-get update
sudo apt-get install python-pip
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
sudo apt install docker-ce
pip install docker-compose
```

Run ```sudo systemctl status docker``` to check if docker is running fine.
A output like this indicates that docker is running fine:
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
All prerequirements are installed. Now clone the NOP repo, build it and then install it.
```
git clone https://github.com/ambrosus/ambrosus-nop.git
cd ambrosus-nop
npm install
npm run-script build
```

## Using the NOP
The NOP has two different stages, the aim of the first stage is to whitelist your node. The whitelisting is done by Ambrosus but you will have to send your node details to us. The node details are generated by the NOP. The aim of the second stage is to onboard your node, this can only be done upon being whitelisted. If the node is whitelisted you can run the NOP again to onboard your node. When the onboarding is complete, the NOP will fill out variables in the docker-compose file specific to your onboarded node.
##### Ambrosus prebuilt machine image
Run ```ambrosus-nop``` to start the NOP.
If you want to restart the process run ```ambrosus-nop-reset```.
##### Custom image
Run the following commands:
```
cd ~/ambrosus-nop*
npm start
```
*this location can vary, it depends on where you cloned the repository.
If you want to reset the process you will have to type the following command.
```
cd ~/ambrosus-nop
rm state.json
```
Then you can run the NOP again with a clean state by ```npm start```

### Starting a Node
##### Ambrosus prebuilt machine image
You can run the following commands for starting nodes
- For an Apollo node run: ```start-apollo```
- For an Hermes node run: ```start-hermes```
- For and Atlas node run: ```start-atlas```
##### Custom image
Enter the directory where you cloned the repository, we will assume you followed this guide and it is in the home directory.
``` cd ~/ambrosus-nop```
In this directory you should have the following directory structure. Notice the docker-compose directory and it's subdirectories.
     
     .
    ├── config                   
    ├── dist                    
    ├── docker-compose    
    │   ├── atlas
    │   ├── apollo         
    │   └── hermes           
    ├── test                    
    ├── node_modules            
    ├── src
    └── test
Now enter the directory for the node you want to start and then run docker-compose up -d. If it is an **Atlas** node the command would be:
```
cd docker-compose/atlas
docker-compose up -d
```
Commands are similar for all three nodes, the directory the commands get executed in diffrentiates them. 

## Insight and statistics of the node
To check statistics and get insights of the node you are running please visit the Ambrosus dashboard.

For further details of what is happening within the docker containers you can use ```docker ps``` to find container IDs and then write ```docker logs <container id>``` to see the logs.
## Troubleshooting
If you are having docker issues [DigitalOcean has a indepth guide for installing docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04).

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

## Todos

 - Google Cloud Machine Image
