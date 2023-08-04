/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const messages = {
  networkQuestion: 'Which network do you want to be onboarded to?',
  nodeTypeQuestion: `Which node do you want to run?`,
  apolloName: 'Apollo',
  noPrivateKeyQuestion: `No private key setup yet. What do you want to do?`,
  privateKeyManualInputAnswer: 'Input existing key manually',
  privateKeyAutoGenerationAnswer: 'Generate new key automatically',
  privateKeyInputInstruction: `Please provide your private key (in hex form):`,
  privateKeyInputError: (wrongValue) => `${wrongValue} is not a valid private key`,
  dockerInstalledInfo: '✅ Docker is installed',
  dockerMissingInfo: '⛔ Docker is required, and was not found. Please verify your installation',
  privateKeyInfo: (address) => `✅ Private key verified. Your address is ${address}`,
  roleSelectionInfo: (role) => `${role} has been selected`,
  nodeIPInputInstruction: 'Please provide the IP address, which you will be using for your node:',
  nodeIPInputError:  (wrongValue) => `${wrongValue} is not a valid IP address`,
  nodeIPInfo: (ip) => `Node IP defined as ${ip}`,
  onboardChannel: '#onboarding',
  unitAmb: 'AMB',
  continueConfirmation: 'Do you want to continue?',
  onboardingSuccessful: '🎉 You are now successfully onboarded !!! 🎉',
  alreadyOnboarded: (role) => `✅ Onboarded as ${role}`,
  networkSelected: (network) => `Network: ${network}`,
  dockerComposeInfo: (outputDir, command) => `Your node configuration is ready.\nIn order to start it, enter the ${outputDir} directory from the command line and run ${command}`,
  dockerComposeCommand: 'docker-compose up -d',
  dockerDownCommand: 'docker-compose down',
  yes: 'Yes',
  no: 'No',
  continue: 'Continue',

  genericError: (message) => `An error occurred: ${message}`,
  selectActionQuestion: 'You can now perform one of the following actions',
  nectarWarning: '⚠️ WARNING! ⚠️ This operation will cost you some nectar (usually less than 0.05 AMB).',
  availablePayouts: (availableAmount) => `You can withdraw ${availableAmount} AMB`,
  confirmWithdraw: 'Would you like to withdraw now?',
  withdrawalSuccessful: (withdrawnAmount) => `Great! 💰 ${withdrawnAmount} AMB (minus small nectar fee) has been transferred to your account.`,

  warningMessage: '⚠️ WARNING! ⚠️',
  dockerRestartRequired: 'Changes in network have been detected. Please restart the docker containers with',
  actions: {
    payouts: 'Payouts',
    quit: 'Finish NOP'
  }
};

export default messages;
