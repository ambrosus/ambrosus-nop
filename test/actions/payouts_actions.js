/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import payoutsAction from '../../src/menu_actions/payouts_actions';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const {expect} = chai;

describe('Payouts actions', () => {
  let payoutsActionsMock;
  let availablePayoutDialogStub;
  let confirmPayoutsWithdrawalDialogStub;
  let withdrawalSuccessfulDialogStub;
  let payoutsActionCall;
  const availablePayoutInWei = '42000000000000000000';
  const availablePayoutInAmb = '42';

  beforeEach(() => {
    payoutsActionsMock = {
      getTotalAvailablePayout: sinon.stub().resolves(availablePayoutInWei),
      withdraw: sinon.stub().resolves()
    };
    availablePayoutDialogStub = sinon.stub().resolves();
    confirmPayoutsWithdrawalDialogStub = sinon.stub().resolves({payoutConfirmation: true});
    withdrawalSuccessfulDialogStub = sinon.stub().resolves();
    payoutsActionCall = payoutsAction(payoutsActionsMock, availablePayoutDialogStub, confirmPayoutsWithdrawalDialogStub, withdrawalSuccessfulDialogStub);
  });

  it('always returns false', async () => {
    expect(await payoutsActionCall()).to.be.false;
  });

  it('shows available payout dialog with amount converted to ambers', async () => {
    await payoutsActionCall();
    expect(availablePayoutDialogStub).to.be.calledOnceWith(availablePayoutInAmb);
  });

  it('withdraws payout when confirmation was positive', async () => {
    await payoutsActionCall();
    expect(payoutsActionsMock.withdraw).to.be.calledOnce;
    expect(withdrawalSuccessfulDialogStub).to.be.calledOnceWith(availablePayoutInAmb);
  });

  it('does not show successful dialog in case withdrawal fails', async () => {
    payoutsActionsMock.withdraw.rejects();
    await expect(payoutsActionCall()).to.be.rejected;
    expect(withdrawalSuccessfulDialogStub).to.be.not.called;
  });

  it('does try to withdraw when available payout is 0', async () => {
    payoutsActionsMock.getTotalAvailablePayout.resolves('0');
    await payoutsActionCall();
    expect(confirmPayoutsWithdrawalDialogStub).to.be.not.called;
    expect(payoutsActionsMock.withdraw).to.be.not.called;
  });

  it('does not perform withdraw when confirmation was negative', async () => {
    confirmPayoutsWithdrawalDialogStub.resolves({payoutConfirmation: false});
    await payoutsActionCall();
    expect(payoutsActionsMock.withdraw).to.be.not.called;
  });
});
