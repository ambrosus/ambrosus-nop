/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import inquirer from 'inquirer';
import chalk from 'chalk';
import validations from '../services/validations';
import messages from '../messages';
import utils from '../utils/web3_utils';
import {APOLLO, ATLAS_1, ATLAS_2, ATLAS_3, HERMES} from '../consts';
import {config} from '../../config/config';

class Dialog {
    output = (data: string) => console.log(data);

    logoDialog() {
      this.output(chalk.blue(`           
                               (((////*****,,,,,                               
                           ((((  /  ******,  ,. ....                           
                         (((   / //         ,. ..  /,,,                        
                       ((     / /    ,,,,,    .  .    ,,,                      
                     ((      / /     ,,,,.*    . ,,     ,,                     
                    ((       * *      ,..      ,         ,,/                   
                     ((      * *      ....     , ,      ,,                     
                       //.    * ,    ,....    , .,    ,,,                      
                         ***   , ,.         ., ,,  .,,,                        
                           *,,,.,.  ....,,,  ,  ,,,,                           
                               ........,,,,,,,,,                               
                                                                               
    ..                     ..                                                  
 ..   ,..                  ..                 ..                               
 ..    ..    ..........    ......     ....   ....     .....   ..   ..    ..... 
 ..    ..   ..   ..   ..   ..    .   ..    ..    ..  ..       ..   ..   .      
 ........   ..   ..   ..   ..    .   ..    ..    ..   ....    ..   ..   .....   
 ..    ..   ..   ..   ..   ..    .   ..    ..    ..       ..  ..   ..        . 
 ..    ..   ..   ..   ..   .......   ..     ..  ..   ......   .......   ...... 
                                              ..                               
                                              ..                               
        `));
    }

    addressIsNotWhitelistedDialog = () => this.output(chalk.red(messages.addressNotWhitelisted));
    dockerDetectedDialog = () => this.output(chalk.green(messages.dockerInstalledInfo));
    dockerMissingDialog = () => this.output(chalk.red(messages.dockerMissingInfo));
    healthCheckUrlDialog = () => this.output(chalk.green(messages.healthCheckUrl()));
    insufficientFundsDialog = () => this.output(chalk.red(messages.insufficientFunds));
    nectarWarningDialog = () => this.output(chalk.red(messages.nectarWarning));
    onboardingSuccessfulDialog = () => this.output(chalk.green.bold(messages.onboardingSuccessful));
    retirementContinueDialog = () => this.output(chalk.green(messages.retirementContinues));
    retirementStartSuccessfulDialog = () => this.output(chalk.green(messages.retirementStartSuccessful));
    retirementStopDialog = () => this.output(chalk.green(messages.retirementStop));
    retirementSuccessfulDialog = () => this.output(chalk.green(messages.retirementSuccessful(chalk.yellow(messages.dockerDownCommand), chalk.yellow(config.outputDirectory))));
    networkSelectedDialog = (network) => this.output(chalk.green(messages.networkSelected(chalk.yellow(network))));
    nodeIPDetectedDialog = (nodeUrl) => this.output(chalk.green(messages.nodeIPInfo(chalk.yellow(nodeUrl))));
    nodeUrlDetectedDialog = (nodeUrl) => this.output(chalk.green(messages.nodeUrlInfo(chalk.yellow(nodeUrl))));
    privateKeyDetectedDialog = (address) => this.output(chalk.green(messages.privateKeyInfo(chalk.yellow(address))));
    genericErrorDialog = (message) => this.output(chalk.red(messages.genericError(message)));
    roleSelectedDialog = (role) => this.output(chalk.green(messages.roleSelectionInfo(chalk.yellow(role))));
    userEmailDetectedDialog = (userEmail) => this.output(chalk.green(messages.userEmailInfo(chalk.yellow(userEmail))));
    withdrawalSuccessfulDialog = (withdrawnAmount) => this.output(chalk.green(messages.withdrawalSuccessful(chalk.yellow(withdrawnAmount))));
    alreadyOnboardedDialog = (onboardedRole) => this.output(chalk.green.bold(messages.alreadyOnboarded(chalk.yellow(onboardedRole))));
    availablePayoutDialog = (availablePayout) => this.output(chalk.green(messages.availablePayouts(chalk.yellow(availablePayout))));
    changeUrlSuccessfulDialog = (newUrl) => this.output(chalk.green.bold(messages.changeUrlSuccessful(chalk.yellow.bold(newUrl))));

    askForNetworkDialog = async(networks) => inquirer.prompt(
      [
        {
          type: 'list',
          name: 'network',
          message: messages.networkQuestion,
          choices: networks
        }
      ]);

    askForNodeIPDialog = async() => inquirer.prompt(
      [
        {
          type: 'input',
          name: 'nodeIP',
          message: messages.nodeIPInputInstruction,
          validate: (answer) => validations.isValidIP(answer) || chalk.red(messages.nodeIPInputError(chalk.yellow(answer)))
        }
      ]);

    askForNodeTypeDialog = async() => inquirer.prompt(
      [
        {
          type: 'list',
          name: 'nodeType',
          message: messages.nodeTypeQuestion,
          choices: [
            {
              name: messages.apolloName,
              value: APOLLO
            },
            {
              name: messages.hermesName,
              value: HERMES
            },
            {
              name: messages.atlasName,
              value: 'atlasSelection'
            }
          ]
        },
        {
          when: (state) => state.nodeType === 'atlasSelection',
          type: 'list',
          name: 'nodeType',
          message: messages.atlasVersionQuestion,
          choices: [
            {
              name: `${messages.atlas3Name} ${messages.atlasStakeForm(messages.atlas3Stake)}`,
              value: ATLAS_3
            },
            {
              name: `${messages.atlas2Name} ${messages.atlasStakeForm(messages.atlas2Stake)}`,
              value: ATLAS_2
            },
            {
              name: `${messages.atlas1Name} ${messages.atlasStakeForm(messages.atlas1Stake)}`,
              value: ATLAS_1
            }
          ]
        }
      ]);

    askForNodeUrlDialog = async() => inquirer.prompt(
      [
        {
          type: 'input',
          name: 'nodeUrl',
          message: messages.nodeUrlInputInstruction,
          validate: (answer) => validations.isValidUrl(answer) || chalk.red(messages.nodeUrlInputError(chalk.yellow(answer))),
          transformer: (input) => {
            const prefixRegex = /^https?:\/\//g;
            if (input.match(prefixRegex) !== null) {
              return input;
            }
            return `(${chalk.red(messages.urlPrefixWarning)}) ${input}`;
          },
          filter: (answer) => {
            const suffixRegex = /(.+?)(\/+$)/g;
            const filteredAnswer = suffixRegex.exec(answer);
            if (filteredAnswer) {
              return filteredAnswer[1];
            }
            return answer;
          }
        }
      ]);

    askForPrivateKeyDialog = async() => inquirer.prompt(
      [
        {
          type: 'list',
          name: 'source',
          message: messages.noPrivateKeyQuestion,
          choices: [
            {
              name: messages.privateKeyManualInputAnswer,
              value: 'manual'
            },
            {
              name: messages.privateKeyAutoGenerationAnswer,
              value: 'generate'
            }
          ]
        },
        {
          type: 'input',
          name: 'privateKey',
          message: messages.privateKeyInputInstruction,
          when: (state) => state.source === 'manual',
          validate: (answer) => validations.isValidPrivateKey(answer) || chalk.red(messages.privateKeyInputError(chalk.yellow(answer))),
          filter: (answer) => {
            const prefixRegex = /^0x/g;
            if (answer.match(prefixRegex) !== null) {
              return answer;
            }
            return `0x${answer}`;
          }
        }
      ]);

    askForUserEmailDialog = async() => inquirer.prompt(
      [
        {
          type: 'input',
          name: 'userEmail',
          message: messages.userEmailInputInstruction,
          validate: (answer) => validations.isValidEmail(answer) || chalk.red(messages.userEmailInputError(chalk.yellow(answer)))
        }
      ]);

    changeUrlConfirmationDialog = async(oldUrl, newUrl) => {
      const {confirmation} = await inquirer.prompt([
        {
          type: 'list',
          name: 'confirmation',
          message: messages.changeUrlConfirmation(chalk.yellow(oldUrl), chalk.yellow(newUrl)),
          choices: [
            {
              name: messages.no,
              value: false
            },
            {
              name: messages.yes,
              value: true
            }
          ]
        }
      ]);
      return confirmation;
    };

    confirmPayoutWithdrawalDialog = async() => inquirer.prompt([
      {
        type: 'list',
        name: 'payoutConfirmation',
        message: messages.confirmWithdraw,
        choices: [
          {
            name: messages.no,
            value: false
          },
          {
            name: messages.yes,
            value: true
          }
        ]
      }
    ]);

    confirmRetirementDialog = async() => inquirer.prompt([
      {
        type: 'list',
        name: 'retirementConfirmation',
        message: chalk.yellow(chalk.bold(messages.confirmRetirement)),
        choices: [
          {
            name: messages.no,
            value: false
          },
          {
            name: messages.yes,
            value: true
          }
        ]
      }
    ]);

    continueAtlasRetirementDialog = async() => inquirer.prompt([
      {
        type: 'list',
        name: 'continueConfirmation',
        message: chalk.yellow(chalk.bold(messages.continueAtlasRetirement)),
        choices: [
          {
            name: messages.continue,
            value: true
          },
          {
            name: messages.no,
            value: false
          }
        ]
      }
    ]);

    selectActionDialog = async(availableActions) => inquirer.prompt(
      [
        {
          type: 'list',
          name: 'action',
          message: messages.selectActionQuestion,
          choices: availableActions
        }
      ]);

    notEnoughBalanceDialog (requiredBalance) {
      const requiredBalanceInAmb = utils.fromWei(requiredBalance, 'ether');
      this.output(chalk.red(messages.notEnoughBalance(chalk.yellow(`${requiredBalanceInAmb} ${messages.unitAmb}`))));
    }

    displaySubmissionDialog (submission) {
      this.output(chalk.green(messages.submissionInfo(chalk.yellow(messages.submissionMail), chalk.yellow(messages.onboardChannel), chalk.yellow(messages.tosFilePath))));
      this.output(chalk.cyan(JSON.stringify(submission, null, 2)));
    }

    dockerRestartRequiredDialog() {
      const center = (text, consoleWidth) => text.padStart((consoleWidth / 2) + (text.length / 2));
      const consoleWidth = process.stdout.columns;
      this.output(chalk.yellow('='.repeat(consoleWidth)));
      this.output(chalk.yellow(center(messages.warningMessage, consoleWidth)));
      this.output(chalk.yellow(center(messages.dockerRestartRequired, consoleWidth)));
      this.output(chalk.yellow(center(messages.dockerComposeCommand, consoleWidth)));
      this.output(chalk.yellow('='.repeat(consoleWidth)));
    }

    async acceptTosDialog(tosText: string) {
      this.output(chalk.red(messages.acceptTos));
      this.output(tosText);
      return inquirer.prompt(
        [
          {
            type: 'input',
            name: 'acceptanceSentence',
            message: messages.tosConfirmationInputInstruction,
            validate: (answer) => validations.isValidTosConfirmation(answer) || chalk.red(messages.tosConfirmationInputError(chalk.yellow(answer)))
          }
        ]);
    }

    addressIsWhitelistedDialog(requiredDeposit, roleAssigned) {
      const requiredDepositInAmb = utils.fromWei(requiredDeposit, 'ether');
      this.output(chalk.green(messages.addressWhitelisted(chalk.yellow(roleAssigned), `${chalk.yellow(requiredDepositInAmb)} ${messages.unitAmb}`)));
    }

    async askForApolloDepositDialog(minimalDeposit: string): Promise<string> {
      const minimalDepositInAmb = utils.fromWei(minimalDeposit, 'ether');
      const {deposit} = await inquirer.prompt(
        [
          {
            type: 'input',
            name: 'deposit',
            message: messages.apolloDepositInputInstruction(chalk.yellow(minimalDepositInAmb)),
            validate: (answer) => {
              if (!validations.isValidNumber(answer)) {
                return chalk.red(messages.depositNumberError(chalk.yellow(answer)));
              }
              if (utils.toBN(answer).lt(utils.toBN(minimalDepositInAmb))) {
                return chalk.red(messages.depositTooSmallError(chalk.yellow(minimalDepositInAmb), chalk.yellow(answer)));
              }
              return true;
            }
          }
        ]);
      return utils.toWei(String(deposit), 'ether').toString();
    }

    async askForApolloMinimalDepositDialog() {
      const MINIMAL_DEPOSIT = 1000000;
      const {deposit} = await inquirer.prompt(
        [
          {
            type: 'input',
            name: 'deposit',
            message: messages.apolloMinimalDepositInputInstruction,
            validate: (answer) => {
              if (!validations.isValidNumber(answer)) {
                return chalk.red(messages.depositNumberError(chalk.yellow(answer)));
              }
              if (parseInt(answer, 10) < MINIMAL_DEPOSIT) {
                return chalk.red(messages.depositTooSmallError(chalk.yellow(MINIMAL_DEPOSIT), chalk.yellow(answer)));
              }
              return true;
            }
          }
        ]);
      return deposit;
    }

    async onboardingConfirmationDialog(address, role, deposit) {
      const depositInAmb = utils.fromWei(deposit, 'ether');
      console.log(chalk.green(messages.onboardingInfo(chalk.yellow(address), chalk.yellow(role), chalk.red(messages.onboardingWarning(chalk.yellow(`${depositInAmb} ${messages.unitAmb}`))))));
      return inquirer.prompt([
        {
          type: 'list',
          name: 'onboardingConfirmation',
          message: messages.continueConfirmation,
          choices: [
            {
              name: messages.no,
              value: false
            },
            {
              name: messages.yes,
              value: true
            }
          ]
        }
      ]);
    }
}

export default new Dialog();
