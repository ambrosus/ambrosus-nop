/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Builder from './builder';
import config from '../config/config';
import {APOLLO} from './consts';

const start = async () => {
  const stage1Objects = Builder.buildStage1(config);
  const {checkDockerAvailablePhase, selectNetworkPhase, getPrivateKeyPhase} = stage1Objects;

  if (!await checkDockerAvailablePhase()) {
    return;
  }
  const network = await selectNetworkPhase();
  const privateKey = await getPrivateKeyPhase();

  const stage2Objects = Builder.buildStage2(stage1Objects, network, privateKey);
  const {checkAddressWhitelistingStatusPhase, selectNodeTypePhase, getNodeIPPhase, getNodeUrlPhase, getUserEmailPhase, manualSubmissionPhase, performOnboardingPhase, prepareDockerPhase} = stage2Objects;

  const whitelistingStatus = await checkAddressWhitelistingStatusPhase();

  const role = await selectNodeTypePhase();
  if (role === APOLLO) {
    await getNodeIPPhase();
  } else {
    await getNodeUrlPhase();
  }
  await getUserEmailPhase();

  if (whitelistingStatus === null) {
    await manualSubmissionPhase();
    return;
  }

  const isOnboarded = await performOnboardingPhase(whitelistingStatus);

  if (isOnboarded) {
    await prepareDockerPhase();
  }

  const {selectActionPhase, actions: {quit: quitAction}} = stage2Objects;

  while (!quitAction.wasPerformed) {
    const selectedAction = await selectActionPhase();
    try {
      await selectedAction.perform();
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }
};


start()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
