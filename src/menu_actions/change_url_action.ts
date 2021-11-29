/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/
import Dialog from '../models/dialog_model';
import StateModel from '../models/state_model';
import SmartContractsModel from '../models/smart_contracts_model';

const changeUrlAction = async () => {
  Dialog.nectarWarningDialog();
  const oldUrl = await StateModel.getNodeUrl();
  const {nodeUrl: newUrl} = await Dialog.askForNodeUrlDialog();
  if (await Dialog.changeUrlConfirmationDialog(oldUrl, newUrl)) {
    await SmartContractsModel.rolesWrapper.setNodeUrl(await StateModel.getAddress(), newUrl);
    await StateModel.storeNodeUrl(newUrl);
    Dialog.changeUrlSuccessfulDialog(newUrl);
  }
  return false;
};

export default changeUrlAction;
