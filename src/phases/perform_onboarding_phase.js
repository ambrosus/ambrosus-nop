/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const performOnboardingPhase = (
  stateModel, smartContractsModel, notEnoughBalanceDialog, alreadyOnboardedDialog, onboardingConfirmationDialog, onboardingSuccessfulDialog, insufficientFundsDialog, genericErrorDialog) =>
  async (whitelistingStatus) => {
    const userAddress = await stateModel.getAddress();
    const onboardedRole = await smartContractsModel.getOnboardedRole(userAddress);
    if (onboardedRole) {
      await alreadyOnboardedDialog(onboardedRole);
      return true;
    }
    if (!await smartContractsModel.hasEnoughBalance(userAddress, whitelistingStatus.requiredDeposit)) {
      await notEnoughBalanceDialog(whitelistingStatus.requiredDeposit);
      return false;
    }
    const dialogResult = await onboardingConfirmationDialog(userAddress, whitelistingStatus.roleAssigned, whitelistingStatus.requiredDeposit);
    if (!dialogResult.onboardingConfirmation) {
      return false;
    }

    try {
      await smartContractsModel.performOnboarding(userAddress, whitelistingStatus.roleAssigned,
        whitelistingStatus.requiredDeposit, await stateModel.getNodeUrl());
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
