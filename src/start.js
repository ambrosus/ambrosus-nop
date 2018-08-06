/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Builder from './builder';
import config from '../config/config';

import getPrivateKeyPhase from './phases/get_private_key_phase';
import askForPrivateKeyDialog from './dialogs/ask_for_private_key_dialog';

const start = async () => {
  const builder = new Builder();
  const {store, crypto} = await builder.build(config);

  await getPrivateKeyPhase(store, crypto, askForPrivateKeyDialog(crypto))();
};

start()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

