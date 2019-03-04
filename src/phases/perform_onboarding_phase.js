/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {APOLLO} from '../consts';

const performOnboardingPhase = (
  stateModel, smartContractsModel, notEnoughBalanceDialog, alreadyOnboardedDialog, askForApolloDepositDialog, onboardingConfirmationDialog, onboardingSuccessfulDialog, insufficientFundsDialog, genericErrorDialog) =>
  async (whitelistingStatus) => {
    const userAddress = await stateModel.getAddress();
    const onboardedRole = await smartContractsModel.getOnboardedRole(userAddress);
    if (onboardedRole) {
      await alreadyOnboardedDialog(onboardedRole);
      return true;
    }
    const onboardDeposit = whitelistingStatus.roleAssigned === APOLLO ?
      await askForApolloDepositDialog(whitelistingStatus.requiredDeposit) :
      whitelistingStatus.requiredDeposit;
    if (!await smartContractsModel.hasEnoughBalance(userAddress, onboardDeposit)) {
      await notEnoughBalanceDialog(onboardDeposit);
      return false;
    }
    const dialogResult = await onboardingConfirmationDialog(userAddress, whitelistingStatus.roleAssigned, onboardDeposit);
    if (!dialogResult.onboardingConfirmation) {
      return false;
    }

    try {
      await smartContractsModel.performOnboarding(userAddress, whitelistingStatus.roleAssigned,
        onboardDeposit, await stateModel.getNodeUrl());
    } catch (error) {
      if (error.message.includes('Insufficient funds')) {
        await insufficientFundsDialog();
      } else {
        await genericErrorDialog(error.message);
      }
      return false;
    }

    await onboardingSuccessfulDialog();
    return true;
  };

export default performOnboardingPhase;
