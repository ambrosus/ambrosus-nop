/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import inquirer from "inquirer";
import chalk from "chalk";
import messages from "./messages";
import { isValidIP, isValidPrivateKey } from "../utils/validations";

class Dialog {
  output = (data: string) => console.log(data);

  logoDialog() {
    this.output(
      chalk.blue(`
                   ,lc,..                                                      
                    'cx0K0xoc,..                                                
                       .;o0WMWX0xoc,..                                          
                          .cOWMMMMMWX0xolc,..                                   
                            .lXMMMMMMMMMMMWX0koc,..                             
                              :XMMMMMMMMMMMMMMMMWX0koc,..                       
                              .dWMMMMMMMMMMMMMMMMMMMMMWX0ko;                    
                               oWMMMMMMMMMMMMMMMMMMMMMMMWN0o.                   
                              'OMMMMMMMMMMMMMMMMMMWN0kdc;..                     
                             'kWMMMMMMMMMMMMWX0kdc;..                           
                           .lKMMMMMMMWX0Okoc;..                                 
                        .,dKWMMWX0koc;..                                        
                     .:d0XX0koc;..                                              
                    ;xxoc;..                                                    
                                                                              
                                                                                
                                                                                
    10001      1x1   1000000001    1x000000001.      10001       .100000001.
   00  x00     1x1   10       001  1x1        1x1   00  x00     10        101 
  000xxxx000   1x1   1O0xxxx001    1x1        1x1  000xxxx000   101        01
 000      000  1x1   10     1111   1x100000001x   000      000   '100000001'
`)
    );
  }

  dockerDetectedDialog = () =>
    this.output(chalk.green(messages.dockerInstalledInfo));
  dockerMissingDialog = () =>
    this.output(chalk.red(messages.dockerMissingInfo));
  networkSelectedDialog = (network) =>
    this.output(chalk.green(messages.networkSelected(chalk.yellow(network))));
  nodeIPDetectedDialog = (nodeUrl) =>
    this.output(chalk.green(messages.nodeIPInfo(chalk.yellow(nodeUrl))));
  privateKeyDetectedDialog = (address) =>
    this.output(chalk.green(messages.privateKeyInfo(chalk.yellow(address))));

  askForNetworkDialog = async (networks) =>
    inquirer.prompt([
      {
        type: "list",
        name: "network",
        message: messages.networkQuestion,
        choices: networks,
      },
    ]);

  askForNodeIPDialog = async (ipGuess) =>
    inquirer.prompt([
      {
        type: "confirm",
        name: "useGuess",
        when: () => ipGuess !== null,
        message: messages.nodeIPGuessQuestion(ipGuess),
      },
      {
        type: "input",
        name: "nodeIP",
        when: (answers) => !answers.useGuess,
        message: messages.nodeIPInputInstruction,
        validate: (answer) =>
          isValidIP(answer) ||
          chalk.red(messages.nodeIPInputError(chalk.yellow(answer))),
      },
    ]);

  askForPrivateKeyDialog = async () =>
    inquirer.prompt([
      {
        type: "list",
        name: "source",
        message: messages.noPrivateKeyQuestion,
        choices: [
          {
            name: messages.privateKeyManualInputAnswer,
            value: "manual",
          },
          {
            name: messages.privateKeyAutoGenerationAnswer,
            value: "generate",
          },
        ],
      },
      {
        type: "input",
        name: "privateKey",
        message: messages.privateKeyInputInstruction,
        when: (state) => state.source === "manual",
        validate: (answer) =>
          isValidPrivateKey(answer) ||
          chalk.red(messages.privateKeyInputError(chalk.yellow(answer))),
        filter: (answer) => {
          const prefixRegex = /^0x/g;
          if (answer.match(prefixRegex) !== null) {
            return answer;
          }
          return `0x${answer}`;
        },
      },
    ]);

  setupCompleteDialog = () =>
    this.output(chalk.blue(messages.dockerSetupComplete));
  dockerStartingDialog = () => this.output(chalk.blue(messages.dockerStarting));
  dockerStartedDialog = () => this.output(chalk.green(messages.dockerStarted));
  dockerErrorDialog = () => this.output(chalk.red(messages.dockerError));

  dockerRestartRequiredDialog() {
    const center = (text, consoleWidth) =>
      text.padStart(consoleWidth / 2 + text.length / 2);
    const consoleWidth = process.stdout.columns;
    this.output(chalk.yellow("=".repeat(consoleWidth)));
    this.output(chalk.yellow(center(messages.warningMessage, consoleWidth)));
    this.output(
      chalk.yellow(center(messages.dockerRestartRequired, consoleWidth))
    );
    this.output(
      chalk.yellow(center(messages.dockerComposeCommand, consoleWidth))
    );
    this.output(chalk.yellow("=".repeat(consoleWidth)));
  }

  alreadyOnboardedDialog = (explorerUrl, nodeAddress) =>
    this.output(
      chalk.green(messages.alreadyOnboarded(explorerUrl, nodeAddress))
    );
  notOnboardedDialog = () => this.output(chalk.red(messages.notOnboarded));
  waitOnboardingDialog = (timetoUnboard) =>
    this.output(
      chalk.yellow(messages.waitOnboarding(chalk.yellow(timetoUnboard)))
    );
  notRegisteredDialog = (explorerUrl) =>
    this.output(chalk.red(messages.notRegisteredNode(explorerUrl)));
}

export default new Dialog();
