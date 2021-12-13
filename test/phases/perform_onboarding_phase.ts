/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import performOnboardingPhase from '../../src/phases/perform_onboarding_phase';
import StateModel from '../../src/models/state_model';
import SmartContractsModel from '../../src/models/smart_contracts_model';
import Dialog from '../../src/models/dialog_model';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Perform onboarding Phase', () => {
  const exampleAddress = '0xc0ffee';
  const exampleUrl = 'http://url';
  const exampleApolloDeposit = '150';
  let stateModelStub;
  let smartContractsModelStub;
  let onboardingConfirmationDialogStub;
  let askForApolloDepositDialogStub;

  const exampleWhitelistingStatus = {
    roleAssigned: 'bar',
    requiredDeposit: '123'
  };

  const call = performOnboardingPhase;

  beforeEach(async () => {
    stateModelStub = {
      getAddress: sinon.stub().resolves(exampleAddress),
      getNodeUrl: sinon.stub().resolves(exampleUrl)
    };
    StateModel.getAddress = stateModelStub.getAddress;
    StateModel.getNodeUrl = stateModelStub.getNodeUrl;

    smartContractsModelStub = {
      hasEnoughBalance: sinon.stub().resolves(true),
      performOnboarding: sinon.stub(),
      getOnboardedRole: sinon.stub().resolves(null)
    };
    SmartContractsModel.hasEnoughBalance = smartContractsModelStub.hasEnoughBalance;
    SmartContractsModel.performOnboarding = smartContractsModelStub.performOnboarding;
    SmartContractsModel.getOnboardedRole = smartContractsModelStub.getOnboardedRole;

    onboardingConfirmationDialogStub = sinon.stub().resolves({onboardingConfirmation: true});
    askForApolloDepositDialogStub = sinon.stub().resolves(exampleApolloDeposit);
    Dialog.onboardingConfirmationDialog = onboardingConfirmationDialogStub;
    Dialog.askForApolloDepositDialog = askForApolloDepositDialogStub;
    Dialog.notEnoughBalanceDialog = sinon.stub().returns();
    Dialog.alreadyOnboardedDialog = sinon.stub().returns();
    Dialog.onboardingSuccessfulDialog = sinon.stub().returns();
    Dialog.insufficientFundsDialog = sinon.stub();
    Dialog.genericErrorDialog = sinon.stub();
  });

  it('onboarding successful: displays dialogs and calls performOnboarding', async () => {
    await call(exampleWhitelistingStatus);
    expect(stateModelStub.getAddress).to.be.calledOnce;
    expect(smartContractsModelStub.getOnboardedRole).to.be.calledOnceWith(exampleAddress);
    expect(smartContractsModelStub.hasEnoughBalance).to.be.calledOnceWith(exampleAddress, exampleWhitelistingStatus.requiredDeposit);
    expect(onboardingConfirmationDialogStub).to.be.calledOnceWith(exampleAddress, exampleWhitelistingStatus.roleAssigned, exampleWhitelistingStatus.requiredDeposit);
    expect(stateModelStub.getNodeUrl).to.be.calledOnceWith;
    expect(smartContractsModelStub.performOnboarding).to.be.calledOnceWith(exampleAddress, exampleWhitelistingStatus.roleAssigned, exampleWhitelistingStatus.requiredDeposit, exampleUrl);
    expect(Dialog.onboardingSuccessfulDialog).to.be.calledOnce;
  });

  it('onboarding failed: already onboarded', async () => {
    smartContractsModelStub.getOnboardedRole.resolves('Hermes');
    await call(exampleWhitelistingStatus);
    expect(Dialog.alreadyOnboardedDialog).to.be.calledOnceWith('Hermes');
    expect(smartContractsModelStub.performOnboarding).to.be.not.called;
  });

  it('onboarding failed: not enough balance', async () => {
    smartContractsModelStub.hasEnoughBalance.resolves(false);
    await call(exampleWhitelistingStatus);
    expect(Dialog.notEnoughBalanceDialog).to.be.calledOnceWith(exampleWhitelistingStatus.requiredDeposit);
    expect(smartContractsModelStub.performOnboarding).to.be.not.called;
  });

  it('onboarding failed: not confirmed', async () => {
    onboardingConfirmationDialogStub.resolves({onboardingConfirmation: false});
    await call(exampleWhitelistingStatus);
    expect(onboardingConfirmationDialogStub).to.be.calledOnce;
    expect(smartContractsModelStub.performOnboarding).to.be.not.called;
  });

  it('onboarding failed: insufficient funds', async () => {
    smartContractsModelStub.performOnboarding.throws(new Error('Error: Insufficient funds'));
    await call(exampleWhitelistingStatus);
    expect(Dialog.insufficientFundsDialog).to.be.calledOnce;
    expect(Dialog.onboardingSuccessfulDialog).to.be.not.called;
  });

  it('onboarding failed: unknown error', async () => {
    smartContractsModelStub.performOnboarding.throws(new Error('Error: Something is not working'));
    await call(exampleWhitelistingStatus);
    expect(Dialog.genericErrorDialog).to.be.calledOnce;
    expect(Dialog.onboardingSuccessfulDialog).to.be.not.called;
  });

  it('asks apollo for a deposit', async () => {
    await call({...exampleWhitelistingStatus, roleAssigned: 'Apollo'});
    expect(askForApolloDepositDialogStub).to.be.calledOnceWith(exampleWhitelistingStatus.requiredDeposit);
    expect(smartContractsModelStub.hasEnoughBalance).to.be.calledOnceWith(exampleAddress, exampleApolloDeposit);
    expect(onboardingConfirmationDialogStub).to.be.calledOnceWith(exampleAddress, 'Apollo', exampleApolloDeposit);
    expect(smartContractsModelStub.performOnboarding).to.be.calledOnceWith(exampleAddress, 'Apollo', exampleApolloDeposit, exampleUrl);
  });
});
