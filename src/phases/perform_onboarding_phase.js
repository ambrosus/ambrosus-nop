/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const performOnboardingPhase = (
  stateModel, smartContractsModel, notEnoughBalanceDialog, alreadyOnboardedDialog, onboardingConfirmationDialog, onboardingSuccessfulDialog) =>
  async (whitelistingStatus) => {
    const userAddress = await stateModel.getExistingAddress();
    const onboardedRole = await smartContractsModel.getOnboardedRole(userAddress);
    if (onboardedRole) {
      alreadyOnboardedDialog(onboardedRole);
      return;
    }
    if (!await smartContractsModel.hasEnoughBalance(userAddress, whitelistingStatus.requiredDeposit)) {
      notEnoughBalanceDialog(whitelistingStatus.requiredDeposit);
      return;
    }
    const dialogResult = await onboardingConfirmationDialog(userAddress, whitelistingStatus.roleAssigned, whitelistingStatus.requiredDeposit);
    if (!dialogResult.onboardingConfirmation) {
      return;
    }

    await smartContractsModel.performOnboarding(userAddress, whitelistingStatus.roleAssigned,
      whitelistingStatus.requiredDeposit, await stateModel.getExistingNodeUrl());

    onboardingSuccessfulDialog();
  };

export default performOnboardingPhase;
