/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chalk from 'chalk';

const displaySubmissionDialog = (messages) => async (submission) => {
  console.log(chalk.green(messages.submissionInfo(chalk.yellow(messages.submissionMail), chalk.yellow(messages.onboardChannel), chalk.yellow(messages.tosFilePath))));
  console.log(chalk.cyan(JSON.stringify(submission, null, 2)));
};

export default displaySubmissionDialog;
