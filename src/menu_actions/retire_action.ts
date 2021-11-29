/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {constants} from 'ambrosus-node-contracts';
import Dialog from '../models/dialog_model';
import AtlasModeModel from '../models/atlas_mode_model';
import SmartContractsModel from '../models/smart_contracts_model';

const isAtlasWithBundles = async () => {
  const role = await SmartContractsModel.onboardActions.rolesWrapper.onboardedRole(SmartContractsModel.onboardActions.rolesWrapper.defaultAddress);
  if (role === constants.ATLAS) {
    return await SmartContractsModel.onboardActions.atlasStakeWrapper.isShelteringAny(SmartContractsModel.onboardActions.atlasStakeWrapper.defaultAddress);
  }
  return false;
};

const retireAction = () => async () => {
  if (await isAtlasWithBundles()) {
    const retireMode = (await AtlasModeModel.getMode()).mode === 'retire';
    if (retireMode) {
      if ((await Dialog.continueAtlasRetirementDialog()).continueConfirmation) {
        Dialog.retirementContinueDialog();
      } else {
        if (await AtlasModeModel.setMode('normal')) {
          Dialog.retirementStopDialog();
          return true;
        }
        Dialog.genericErrorDialog('Can not set normal mode: I/O error');
        return false;
      }
      return true;
    }
    if (!(await Dialog.confirmRetirementDialog()).retirementConfirmation) {
      return false;
    }
    if (await AtlasModeModel.setMode('retire')) {
      Dialog.retirementStartSuccessfulDialog();
      return true;
    }
    Dialog.genericErrorDialog('Can not set retire mode: I/O error');
    return false;
  }
  if (!(await Dialog.confirmRetirementDialog()).retirementConfirmation) {
    return false;
  }
  await SmartContractsModel.onboardActions.retire();
  Dialog.retirementSuccessfulDialog();
  return true;
};

export default retireAction;
