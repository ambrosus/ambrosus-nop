/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chalk from 'chalk';

const center = (text, consoleWidth) => text.padStart((consoleWidth / 2) + (text.length / 2));

const dockerRestartRequiredDialog = (messages) => () => {
  const consoleWidth = process.stdout.columns;
  console.log(chalk.yellow('='.repeat(consoleWidth)));
  console.log(chalk.yellow(center(messages.warningMessage, consoleWidth)));
  console.log(chalk.yellow(center(messages.dockerRestartRequired, consoleWidth)));
  console.log(chalk.yellow(center(messages.dockerComposeCommand, consoleWidth)));
  console.log(chalk.yellow('='.repeat(consoleWidth)));
};

export default dockerRestartRequiredDialog;


