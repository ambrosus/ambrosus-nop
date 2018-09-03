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
  const {getPrivateKeyPhase, checkDockerAvailablePhase, selectNodeTypePhase, getNodeUrlPhase, getUserEmailPhase} = await builder.build(config);

  await getPrivateKeyPhase();
  if (!await checkDockerAvailablePhase()) {
    return;
  }
  await selectNodeTypePhase();
  await getNodeUrlPhase();
  await getUserEmailPhase();
};

start()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

