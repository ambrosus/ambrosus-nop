/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {constants} from 'ambrosus-node-contracts';

const isAtlasWithBundles = async (onboardActions) => {
  const role = await onboardActions.rolesWrapper.onboardedRole(onboardActions.rolesWrapper.defaultAddress);
  if (role === constants.ATLAS) {
    return await onboardActions.atlasStakeWrapper.isShelteringAny(onboardActions.atlasStakeWrapper.defaultAddress);
  }
  return false;
};

const retireAction = (atlasModeModel, onboardActions, confirmRetirementDialog, retirementSuccessfulDialog, continueAtlasRetirementDialog, retirementStartSuccessfulDialog, retirementContinueDialog, retirementStopDialog, genericErrorDialog) => async () => {
  if (await isAtlasWithBundles(onboardActions)) {
    const retireMode = (await atlasModeModel.getMode()).mode === 'retire';
    if (retireMode) {
      if ((await continueAtlasRetirementDialog()).continueConfirmation) {
        await retirementContinueDialog();
      } else {
        if (await atlasModeModel.setMode('normal')) {
          await retirementStopDialog();
          return true;
        }
        await genericErrorDialog('Can not set normal mode: I/O error');
        return false;
      }
      return true;
    }
    if (!(await confirmRetirementDialog()).retirementConfirmation) {
      return false;
    }
    if (await atlasModeModel.setMode('retire')) {
      await retirementStartSuccessfulDialog();
      return true;
    }
    await genericErrorDialog('Can not set retire mode: I/O error');
    return false;
  }
  if (!(await confirmRetirementDialog()).retirementConfirmation) {
    return false;
  }
  await onboardActions.retire();
  await retirementSuccessfulDialog();
  return true;
};

export default retireAction;
