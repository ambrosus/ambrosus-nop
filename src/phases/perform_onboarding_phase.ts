/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {APOLLO} from '../consts';
import Dialog from '../models/dialog_model';
import StateModel from '../models/state_model';
import SmartContractsModel from '../models/smart_contracts_model';

const performOnboardingPhase = async (whitelistingStatus) => {
  const userAddress = await StateModel.getAddress();
  const onboardedRole = await SmartContractsModel.getOnboardedRole(userAddress);
  if (onboardedRole) {
    Dialog.alreadyOnboardedDialog(onboardedRole);
    return true;
  }
  const onboardDeposit = whitelistingStatus.roleAssigned === APOLLO ?
    await Dialog.askForApolloDepositDialog(whitelistingStatus.requiredDeposit) :
    whitelistingStatus.requiredDeposit;
  if (!await SmartContractsModel.hasEnoughBalance(userAddress, onboardDeposit)) {
    Dialog.notEnoughBalanceDialog(onboardDeposit);
    return false;
  }
  const dialogResult = await Dialog.onboardingConfirmationDialog(userAddress, whitelistingStatus.roleAssigned, onboardDeposit);
  if (!dialogResult.onboardingConfirmation) {
    return false;
  }

  try {
    await SmartContractsModel.performOnboarding(userAddress, whitelistingStatus.roleAssigned,
      onboardDeposit, await StateModel.getNodeUrl());
  } catch (error) {
    if (error.message.includes('Insufficient funds')) {
      Dialog.insufficientFundsDialog();
    } else {
      Dialog.genericErrorDialog(error.message);
    }
    return false;
  }

  Dialog.onboardingSuccessfulDialog();
  return true;
};

export default performOnboardingPhase;
