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
  const buildObjects = await builder.build(config);
  const {getPrivateKeyPhase, checkDockerAvailablePhase, selectNodeTypePhase, getNodeUrlPhase, getUserEmailPhase, manualSubmissionPhase, checkAddressWhitelistingStatusPhase} = buildObjects;

  if (!await checkDockerAvailablePhase()) {
    return;
  }
  const privateKey = await getPrivateKeyPhase();

  await builder.augmentBuildWithPrivateKey(buildObjects, privateKey);

  const whitelistingStatus = await checkAddressWhitelistingStatusPhase();

  if (whitelistingStatus === null) {
    await selectNodeTypePhase();
    await getNodeUrlPhase();
    await getUserEmailPhase();
    await manualSubmissionPhase();
    return;
  }

  // TODO check onboarding status and proceed onboarding flow or skip to installation flow
};


start()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

