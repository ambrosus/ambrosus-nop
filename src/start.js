/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Builder from './builder';
import config from '../config/config';

const start = async () => {
  const builder = new Builder();
  builder.buildStage1(config.storePath);
  const {checkDockerAvailablePhase, selectNetworkPhase, getPrivateKeyPhase} = builder.objects;

  if (!await checkDockerAvailablePhase()) {
    return;
  }
  const network = await selectNetworkPhase();
  const privateKey = await getPrivateKeyPhase();

  builder.buildStage2(network, privateKey);
  const {checkAddressWhitelistingStatusPhase, selectNodeTypePhase, getNodeUrlPhase, getUserEmailPhase, manualSubmissionPhase, performOnboardingPhase} = builder.objects;

  const whitelistingStatus = await checkAddressWhitelistingStatusPhase();

  await selectNodeTypePhase();
  await getNodeUrlPhase();
  await getUserEmailPhase();

  if (whitelistingStatus === null) {
    await manualSubmissionPhase();
    return;
  }

  await performOnboardingPhase(whitelistingStatus);
};


start()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

