/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/
import Dialog from '../models/dialog_model';
import StateModel from '../models/state_model';

const getUserEmail = async () => {
  const existingUserEmail = await StateModel.getUserEmail();
  if (existingUserEmail !== null) {
    return existingUserEmail;
  }

  const answers = await Dialog.askForUserEmailDialog();
  const {userEmail} = answers;
  await StateModel.storeUserEmail(userEmail);
  return userEmail;
};

const getUserEmailPhase = async () => {
  const userEmail = await getUserEmail();
  await Dialog.userEmailDetectedDialog(userEmail);
  return userEmail;
};

export default getUserEmailPhase;
