/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Builder from './builder';
import config from '../config/config';

const start = async () => {
  let builderObjects = Builder.buildStage1(config);
  const {checkDockerAvailablePhase, selectNetworkPhase, getPrivateKeyPhase} = builderObjects;

  if (!await checkDockerAvailablePhase()) {
    return;
  }
  const network = await selectNetworkPhase();
  const privateKey = await getPrivateKeyPhase();

  builderObjects = Builder.buildStage2(builderObjects, network, privateKey);
  const {checkAddressWhitelistingStatusPhase, selectNodeTypePhase, getNodeUrlPhase, getUserEmailPhase, manualSubmissionPhase, performOnboardingPhase, prepareDockerPhase} = builderObjects;

  const whitelistingStatus = await checkAddressWhitelistingStatusPhase();

  await selectNodeTypePhase();
  await getNodeUrlPhase();
  await getUserEmailPhase();

  if (whitelistingStatus === null) {
    await manualSubmissionPhase();
    return;
  }

  await performOnboardingPhase(whitelistingStatus);
  await prepareDockerPhase();
};


start()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

