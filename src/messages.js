/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const messages = {
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
  privateKeyInputInstruction: `Please provide your private key in hex form:`,
  privateKeyInputError: 'The provided value is not a valid address',
  dockerInstalledInfo: 'Docker is installed.',
  dockerMissingInfo: 'Docker is required, and was not found. Please verify your installation.',
  privateKeyInfo: `Private key verified. Your address is `,
  roleSelectionInfo: ' has been selected.',
  nodeUrlInputInstruction: 'Please provide URL, which you will be using for your node:',
  nodeUrlInputError: 'The provided value is not a valid URL',
  nodeUrlInfo: 'Node URL defined as ',
  userEmailInputInstruction: 'Please provide your email address:',
  userEmailInputError: 'The provided value is not a valid email address',
  userEmailInfo: 'Your email address is ',
  submissionInfo: 'To finish requesting process copy following form and send it to ',
  submissionMail: 'tech@ambrosus.com',
  addressNotWhitelisted: 'Address is not whitelisted yet.',
  addressWhitelisted: 'Address is whitelisted as ',
  depositInfo: ' Required deposit is: ',
  unit: ' Wei'
};

export default messages;
