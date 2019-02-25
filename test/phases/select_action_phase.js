/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import selectActionPhase from '../../src/phases/select_action_phase';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Select Action Phase', () => {
  let selectActionDialogStub;
  let insufficientFundsDialogStub;
  let errorDialogStub;
  let actions;

  const startPhase = async () => selectActionPhase(actions, selectActionDialogStub, insufficientFundsDialogStub, errorDialogStub)();

  beforeEach(async () => {
    selectActionDialogStub = sinon.stub();
    errorDialogStub = sinon.stub();
    insufficientFundsDialogStub = sinon.stub();
    actions = {
      'First action': sinon.stub().resolves(false),
      'Second action': sinon.stub().resolves(false),
      Quit: sinon.stub().resolves(true)
    };
  });

  it('assembles action list and shows select action dialog', async () => {
    selectActionDialogStub.onFirstCall().resolves({action: 'First action'});
    selectActionDialogStub.onSecondCall().resolves({action: 'Quit'});

    await startPhase();

    expect(selectActionDialogStub).to.have.been.calledWithExactly(['First action', 'Second action', 'Quit']);
  });

  it('exits only after Quit action was selected', async () => {
    selectActionDialogStub.resolves({action: 'Second action'});
    selectActionDialogStub.onCall(5).resolves({action: 'Quit'});

    await startPhase();

    expect(selectActionDialogStub).to.have.callCount(6);
  });

  it('calls action associated with selected key on every iteration', async () => {
    selectActionDialogStub.onFirstCall().resolves({action: 'First action'});
    selectActionDialogStub.onSecondCall().resolves({action: 'Second action'});
    selectActionDialogStub.onThirdCall().resolves({action: 'Quit'});

    await startPhase();

    expect(actions['First action']).to.be.calledOnceWith();
    expect(actions['First action']).to.be.calledBefore(actions['Second action']);
    expect(actions['Second action']).to.be.calledOnceWith();
    expect(actions['Second action']).to.be.calledBefore(actions.Quit);
    expect(actions.Quit).to.be.calledOnceWith();
  });

  describe('In case of errors', () => {
    beforeEach(() => {
      selectActionDialogStub.onFirstCall().resolves({action: 'First action'});
      selectActionDialogStub.onSecondCall().resolves({action: 'Quit'});
    });

    it('displays correct dialog when account has insufficient funds', async () => {
      actions['First action'].rejects(new Error('Error: Insufficient funds'));

      await startPhase();

      expect(insufficientFundsDialogStub).to.be.calledOnce;
    });

    it('displays generic error dialog otherwise', async () => {
      actions['First action'].rejects(new Error('TestError'));

      await startPhase();

      expect(errorDialogStub).to.be.calledOnceWith('TestError');
    });
  });
});
