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

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Perform onboarding Phase', () => {
  const exampleAddress = '0xc0ffee';
  const exampleUrl = 'http://url';
  const exampleApolloDeposit = '150';
  let stateModelStub;
  let smartContractsModelStub;
  let notEnoughBalanceDialogStub;
  let alreadyOnboardedDialogStub;
  let onboardingConfirmationDialogStub;
  let onboardingSuccessfulDialogStub;
  let insufficientFundsDialogStub;
  let genericErrorDialogStub;
  let askForApolloDepositDialogStub;

  const exampleWhitelistingStatus = {
    roleAssigned: 'bar',
    requiredDeposit: '123'
  };

  const call = async (whitelistingStatus) => performOnboardingPhase(stateModelStub, smartContractsModelStub, notEnoughBalanceDialogStub, alreadyOnboardedDialogStub, askForApolloDepositDialogStub, onboardingConfirmationDialogStub, onboardingSuccessfulDialogStub, insufficientFundsDialogStub, genericErrorDialogStub)(whitelistingStatus);

  beforeEach(async () => {
    stateModelStub = {
      getAddress: sinon.stub().resolves(exampleAddress),
      getNodeUrl: sinon.stub().resolves(exampleUrl)
    };
    smartContractsModelStub = {
      hasEnoughBalance: sinon.stub().resolves(true),
      performOnboarding: sinon.stub(),
      getOnboardedRole: sinon.stub().resolves(null)
    };
    notEnoughBalanceDialogStub = sinon.stub().returns();
    alreadyOnboardedDialogStub = sinon.stub().returns();
    onboardingConfirmationDialogStub = sinon.stub().resolves({onboardingConfirmation: true});
    askForApolloDepositDialogStub = sinon.stub().resolves(exampleApolloDeposit);
    onboardingSuccessfulDialogStub = sinon.stub().returns();
    insufficientFundsDialogStub = sinon.stub();
    genericErrorDialogStub = sinon.stub();
  });

  it('onboarding successful: displays dialogs and calls performOnboarding', async () => {
    await call(exampleWhitelistingStatus);
    expect(stateModelStub.getAddress).to.be.calledOnce;
    expect(smartContractsModelStub.getOnboardedRole).to.be.calledOnceWith(exampleAddress);
    expect(smartContractsModelStub.hasEnoughBalance).to.be.calledOnceWith(exampleAddress, exampleWhitelistingStatus.requiredDeposit);
    expect(onboardingConfirmationDialogStub).to.be.calledOnceWith(exampleAddress, exampleWhitelistingStatus.roleAssigned, exampleWhitelistingStatus.requiredDeposit);
    expect(stateModelStub.getNodeUrl).to.be.calledOnceWith;
    expect(smartContractsModelStub.performOnboarding).to.be.calledOnceWith(exampleAddress, exampleWhitelistingStatus.roleAssigned, exampleWhitelistingStatus.requiredDeposit, exampleUrl);
    expect(onboardingSuccessfulDialogStub).to.be.calledOnce;
  });

  it('onboarding failed: already onboarded', async () => {
    smartContractsModelStub.getOnboardedRole.resolves('Hermes');
    await call(exampleWhitelistingStatus);
    expect(alreadyOnboardedDialogStub).to.be.calledOnceWith('Hermes');
    expect(smartContractsModelStub.performOnboarding).to.be.not.called;
  });

  it('onboarding failed: not enough balance', async () => {
    smartContractsModelStub.hasEnoughBalance.resolves(false);
    await call(exampleWhitelistingStatus);
    expect(notEnoughBalanceDialogStub).to.be.calledOnceWith(exampleWhitelistingStatus.requiredDeposit);
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
    expect(insufficientFundsDialogStub).to.be.calledOnce;
    expect(onboardingSuccessfulDialogStub).to.be.not.called;
  });

  it('onboarding failed: unknown error', async () => {
    smartContractsModelStub.performOnboarding.throws(new Error('Error: Something is not working'));
    await call(exampleWhitelistingStatus);
    expect(genericErrorDialogStub).to.be.calledOnce;
    expect(onboardingSuccessfulDialogStub).to.be.not.called;
  });

  it('asks apollo for a deposit', async () => {
    await call({...exampleWhitelistingStatus, roleAssigned: 'Apollo'});
    expect(askForApolloDepositDialogStub).to.be.calledOnceWith(exampleWhitelistingStatus.requiredDeposit);
    expect(smartContractsModelStub.hasEnoughBalance).to.be.calledOnceWith(exampleAddress, exampleApolloDeposit);
    expect(onboardingConfirmationDialogStub).to.be.calledOnceWith(exampleAddress, 'Apollo', exampleApolloDeposit);
    expect(smartContractsModelStub.performOnboarding).to.be.calledOnceWith(exampleAddress, 'Apollo', exampleApolloDeposit, exampleUrl);
  });
});
