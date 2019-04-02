/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const retireAction = (onboardActions, confirmRetirementDialog, retirementSuccessfulDialog) => async () => {
  if (!(await confirmRetirementDialog()).retirementConfirmation) {
    return false;
  }
  await onboardActions.retire();
  await retirementSuccessfulDialog();
  return true;
};

export default retireAction;
