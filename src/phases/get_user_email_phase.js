/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/


const getUserEmail = async (stateModel, askForUserEmailDialog) => {
  const existingUserEmail = await stateModel.getExistingUserEmail();
  if (existingUserEmail !== null) {
    return existingUserEmail;
  }

  const answers = await askForUserEmailDialog();
  const {userEmail} = answers;
  await stateModel.storeUserEmail(userEmail);
  return userEmail;
};

const getUserEmailPhase = (stateModel, userEmailDetectedDialog, askForUserEmailDialog) => async () => {
  const userEmail = await getUserEmail(stateModel, askForUserEmailDialog);
  await userEmailDetectedDialog(userEmail);
  return userEmail;
};

export default getUserEmailPhase;
