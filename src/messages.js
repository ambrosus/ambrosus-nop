/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const messages = {
  networkQuestion: 'Which network do you want to be onboarded to?',
  nodeTypeQuestion: `Which node do you want to run?`,
  atlasVersionQuestion: `Which Atlas version do you want to run?`,
  apolloName: 'Apollo',
  hermesName: 'Hermes',
  atlasName: 'Atlas',
  atlas1Name: 'Zeta',
  atlas2Name: 'Sigma',
  atlas3Name: 'Omega',
  noPrivateKeyQuestion: `No private key setup yet. What do you want to do?`,
  privateKeyManualInputAnswer: 'Input existing key manually',
  privateKeyAutoGenerationAnswer: 'Generate new key automatically',
  privateKeyInputInstruction: `Please provide your private key (in hex form):`,
  privateKeyInputError: (wrongValue) => `${wrongValue} is not a valid private key`,
  dockerInstalledInfo: 'Docker is installed',
  dockerMissingInfo: 'Docker is required, and was not found. Please verify your installation',
  privateKeyInfo: (address) => `Private key verified. Your address is ${address}`,
  roleSelectionInfo: (role) => `${role} has been selected`,
  nodeUrlInputInstruction: 'Please provide URL, which you will be using for your node:',
  nodeUrlInputError:  (wrongValue) => `${wrongValue} is not a valid URL`,
  nodeUrlInfo: (url) => `Node URL defined as ${url}`,
  nodeIPInputInstruction: 'Please provide the IP address, which you will be using for your node:',
  nodeIPInputError:  (wrongValue) => `${wrongValue} is not a valid IP address`,
  nodeIPInfo: (ip) => `Node IP defined as ${ip}`,
  userEmailInputInstruction: 'Please provide your email address:',
  userEmailInputError: (wrongValue) => `${wrongValue} is not a valid email address`,
  userEmailInfo: (email) => `Your email address is ${email}`,
  submissionInfo: (submissionMail) => `To finish requesting process, copy following form and send it to ${submissionMail}`,
  submissionMail: 'tech@ambrosus.com',
  addressNotWhitelisted: 'Address is not whitelisted yet',
  addressWhitelisted: (roleAssigned, requiredDeposit) => `Address is whitelisted as ${roleAssigned}. Required deposit is: ${requiredDeposit}`,
  unitAmb: 'AMB',
  notEnoughBalance: (amount) => `Not enough balance. You need at least ${amount} in order to perform onboarding`,
  onboardingWarning: (address, nodeType, amount) => `You will now onboard ${address} as the ${nodeType} node.\nWarning: this operations will cost ${amount}!`,
  continueConfirmation: 'Do you want to continue?',
  onboardingSuccessful: 'You are now successfully onboarded!',
  alreadyOnboarded: (role) => `Onboarded as ${role}`,
  networkSelected: (network) => `Network: ${network}`,
  healthCheckUrl: (url) => `After starting your node, you can check its health by going to: ${url}`,
  dockerComposeInfo: (outputDir, command) => `Your node configuration is ready.\nIn order to start it enter the ${outputDir} directory from the command line and run ${command}`,
  dockerComposeCommand: 'docker-compose up -d',
  yes: 'Yes',
  no: 'No',
  insufficientFunds: 'You have insufficient funds to perform transaction',
  genericError: (message) => `An error occurred: ${message}`
};

export default messages;
