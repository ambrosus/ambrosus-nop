/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import payoutAction from '../../src/menu_actions/payout_action';
import Dialog from '../../src/models/dialog_model';
import SmartContractsModel from '../../src/models/smart_contracts_model';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const {expect} = chai;

describe('Payout actions', () => {
  let confirmPayoutWithdrawalDialogStub;
  let payoutActionCall;
  const availablePayoutInWei = '42000000000000000000';
  const availablePayoutInAmb = '42';

  beforeEach(() => {
    confirmPayoutWithdrawalDialogStub = sinon.stub().resolves({payoutConfirmation: true});
    Dialog.confirmPayoutWithdrawalDialog = confirmPayoutWithdrawalDialogStub;
    Dialog.availablePayoutDialog = sinon.stub().resolves();
    Dialog.withdrawalSuccessfulDialog = sinon.stub().resolves();
    SmartContractsModel.payoutsActions = {
      getTotalAvailablePayout: sinon.stub().resolves(availablePayoutInWei),
      withdraw: sinon.stub().resolves()
    };
    payoutActionCall = payoutAction;
  });

  it('always returns false', async () => {
    expect(await payoutActionCall()).to.be.false;
  });

  it('shows available payout dialog with amount converted to ambers', async () => {
    await payoutActionCall();
    expect(Dialog.availablePayoutDialog).to.be.calledOnceWith(availablePayoutInAmb);
  });

  it('withdraws payout when confirmation was positive', async () => {
    await payoutActionCall();
    expect(SmartContractsModel.payoutsActions.withdraw).to.be.calledOnce;
    expect(Dialog.withdrawalSuccessfulDialog).to.be.calledOnceWith(availablePayoutInAmb);
  });

  it('does not show successful dialog in case withdrawal fails', async () => {
    SmartContractsModel.payoutsActions.withdraw.rejects();
    await expect(payoutActionCall()).to.be.rejected;
    expect(Dialog.withdrawalSuccessfulDialog).to.be.not.called;
  });

  it('does not try to withdraw when available payout is 0', async () => {
    SmartContractsModel.payoutsActions.getTotalAvailablePayout.resolves('0');
    await payoutActionCall();
    expect(confirmPayoutWithdrawalDialogStub).to.be.not.called;
    expect(SmartContractsModel.payoutsActions.withdraw).to.be.not.called;
  });

  it('does not perform withdraw when confirmation was negative', async () => {
    confirmPayoutWithdrawalDialogStub.resolves({payoutConfirmation: false});
    await payoutActionCall();
    expect(SmartContractsModel.payoutsActions.withdraw).to.be.not.called;
  });
});
