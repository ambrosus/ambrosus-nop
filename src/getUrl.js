const Web3 = require('web3');
const fs = require('fs');
const {
  HeadWrapper,
  RolesWrapper
} = require('ambrosus-node-contracts');

const headContractAddress = '0x0000000000000000000000000000000000000F10';

const readFile = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

async function readConfig() {
  try {
    return JSON.parse(await readFile('state.json'));
  } catch (err) {
    console.log('Read config file error:', err);
  }
  return undefined;
}

async function getUrl()
{
  try {
    const config = await readConfig();
    if (config === undefined) {
      return;
    }
    const web3 = new Web3();
    web3.setProvider(new Web3.providers.HttpProvider(config.network.rpc));
    const account = web3.eth.accounts.privateKeyToAccount(config.privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    //console.log('Default address:', web3.eth.defaultAccount);
    const headWrapper = new HeadWrapper(headContractAddress, web3, web3.eth.defaultAccount);
    const rolesWrapper = new RolesWrapper(headWrapper, web3, web3.eth.defaultAccount);
    const url = await rolesWrapper.nodeUrl(account.address);
    console.log(url);
  } catch (err) {
    console.log('Error:', err);
  }
}

getUrl();
