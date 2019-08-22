/*
Copyright: Ambrosus Inc.
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
  atlas1Stake: '10k',
  atlas2Stake: '30k',
  atlas3Stake: '75k',
  atlasStakeForm: (amount) => `(${amount} AMB)`,
  noPrivateKeyQuestion: `No private key setup yet. What do you want to do?`,
  privateKeyManualInputAnswer: 'Input existing key manually',
  privateKeyAutoGenerationAnswer: 'Generate new key automatically',
  privateKeyInputInstruction: `Please provide your private key (in hex form):`,
  privateKeyInputError: (wrongValue) => `${wrongValue} is not a valid private key`,
  dockerInstalledInfo: '✅ Docker is installed',
  dockerMissingInfo: '⛔ Docker is required, and was not found. Please verify your installation',
  privateKeyInfo: (address) => `✅ Private key verified. Your address is ${address}`,
  roleSelectionInfo: (role) => `${role} has been selected`,
  nodeUrlInputInstruction: 'Please provide URL, which you will be using for your node:',
  nodeUrlInputError:  (wrongValue) => `${wrongValue} is not a valid URL`,
  nodeUrlInfo: (url) => `Node URL defined as ${url}`,
  urlPrefixWarning: `start with 'http://' or 'https://'`,
  nodeIPInputInstruction: 'Please provide the IP address, which you will be using for your node:',
  nodeIPInputError:  (wrongValue) => `${wrongValue} is not a valid IP address`,
  nodeIPInfo: (ip) => `Node IP defined as ${ip}`,
  apolloDepositInputInstruction: (minimalDeposit) => `Please provide the deposit (in AMB). Minimal deposit is: ${minimalDeposit}`,
  apolloMinimalDepositInputInstruction: 'Please provide the amount (in AMB) that you would like to deposit.',
  depositNumberError: (wrongValue) => `${wrongValue} is not a number`,
  depositTooSmallError: (minimalDeposit, wrongValue) => `${wrongValue} must be not smaller than ${minimalDeposit}`,
  userEmailInputInstruction: 'Please provide your email address:',
  userEmailInputError: (wrongValue) => `${wrongValue} is not a valid email address`,
  userEmailInfo: (email) => `Your email address is ${email}`,
  submissionInfo: (submissionMail, onboardChannel, tosFilePath) => `To finish requesting process, copy following form and mail it to ${submissionMail} or send to ${onboardChannel} in Slack.
  Additionally attach your signed Terms of Service file (${tosFilePath})`,
  tosFilePath: 'output/TOS.txt',
  submissionMail: 'tech@ambrosus.com',
  onboardChannel: '#onboarding',
  addressNotWhitelisted: 'Address is not whitelisted yet',
  addressWhitelisted: (roleAssigned, requiredDeposit) => `✅ Address is whitelisted as ${roleAssigned}. Required deposit is: ${requiredDeposit}`,
  unitAmb: 'AMB',
  notEnoughBalance: (amount) => `Not enough balance 💸  You need at least ${amount} in order to perform onboarding 💸`,
  onboardingInfo: (address, nodeType, warning) => `You will now onboard ${address} as the ${nodeType} node.\n${warning}`,
  onboardingWarning: (amount) => `⚠️ WARNING! ⚠️ This operations will cost ${amount}!`,
  continueConfirmation: 'Do you want to continue?',
  onboardingSuccessful: '🎉 You are now successfully onboarded !!! 🎉',
  alreadyOnboarded: (role) => `✅ Onboarded as ${role}`,
  networkSelected: (network) => `Network: ${network}`,
  healthCheckUrl: () => `After starting your node, you can check its health by going to Explorer: https://explorer.ambrosus.com/`,
  dockerComposeInfo: (outputDir, command) => `Your node configuration is ready.\nIn order to start it, enter the ${outputDir} directory from the command line and run ${command}`,
  dockerComposeCommand: 'docker-compose up -d',
  dockerDownCommand: 'docker-compose down',
  yes: 'Yes',
  no: 'No',
  continue: 'Continue',
  continueAtlasRetirement: 'Do you want to continue retarement?',
  retirementContinues: 'Retirement continues.',
  insufficientFunds: 'You have insufficient funds to perform transaction 💸\n Top up with small amount and retry',
  genericError: (message) => `An error occurred: ${message}`,
  selectActionQuestion: 'You can now perform one of the following actions',
  changeUrlConfirmation: (oldUrl, newUrl) => `You will now change your node URL from ${oldUrl} to ${newUrl}. Do you wish to continue?`,
  nectarWarning: '⚠️ WARNING! ⚠️ This operation will cost you some nectar (usually less than 0.05 AMB).',
  changeUrlSuccessful: (newUrl) => `Success! Node URL changed to ${newUrl}`,
  availablePayouts: (availableAmount) => `You can withdraw ${availableAmount} AMB`,
  confirmWithdraw: 'Would you like to withdraw now?',
  withdrawalSuccessful: (withdrawnAmount) => `Great! 💰 ${withdrawnAmount} AMB (minus small nectar fee) has been transferred to your account.`,
  retirementStartSuccessful: 'Retirement process for you Atlas was started.',
  retirementStop: 'You Atlas was switched to normal operational mode.',
  confirmRetirement: `After retirement this node will stop being part of the network.
  You will still be able to onboard it again.
  Do you want to continue?`,
  retirementSuccessful: (dockerDownCommand, outputDir) => `
  Your node has retired. 
  Don't forget to turn off the node. You can do it by running ${dockerDownCommand} inside the ${outputDir} directory.
  See you later!`,
  warningMessage: '⚠️ WARNING! ⚠️',
  dockerRestartRequired: 'Changes in network have been detected. Please restart the docker containers with',
  acceptTos: 'In order to get whitelisted you must accept the Terms of Service',
  tosConfirmationInputInstruction: 'Please write the following sentence: "I, [firstname lastname], read and agreed with the terms and conditions above."',
  tosConfirmationInputError: (wrongValue) => `${wrongValue} is not a valid confirmation`,
  actions: {
    payouts: 'Payouts',
    changeUrl: 'Change node URL',
    retire: 'Retire',
    quit: 'Finish NOP'
  }
};

export default messages;
