/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/
import Dialog from '../models/dialog_model';
import SmartContractsModel from '../models/smart_contracts_model';
import web3Utils from '../utils/web3_utils';

const payoutAction = () => async () => {
  const availablePayout = web3Utils.fromWei(await SmartContractsModel.payoutsActions.getTotalAvailablePayout(), 'ether');
  Dialog.availablePayoutDialog(availablePayout);
  if (availablePayout !== '0' && (await Dialog.confirmPayoutWithdrawalDialog()).payoutConfirmation) {
    await SmartContractsModel.payoutsActions.withdraw();
    Dialog.withdrawalSuccessfulDialog(availablePayout);
  }
  return false;
};

export default payoutAction;
