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
import {selectActionPhase} from '../../src/phases/select_action_phase';
import prepareAction from '../../src/menu_actions/prepare_action';
import {ATLAS_CODE, HERMES_CODE, HERMES, ATLAS_1} from '../../src/consts';
import Dialog from '../../src/models/dialog_model';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Select Action Phase', () => {
  let selectActionDialogStub;
  let insufficientFundsDialogStub;
  let errorDialogStub;
  let actions;

  const startPhase = async (role) => selectActionPhase(role, actions);

  beforeEach(async () => {
    selectActionDialogStub = sinon.stub();
    errorDialogStub = sinon.stub();
    insufficientFundsDialogStub = sinon.stub();
    Dialog.selectActionDialog = selectActionDialogStub;
    Dialog.genericErrorDialog = errorDialogStub;
    Dialog.insufficientFundsDialog = insufficientFundsDialogStub;

    actions = {
      'First action': prepareAction(sinon.stub().resolves(false), [HERMES_CODE, ATLAS_CODE]),
      'Second action': prepareAction(sinon.stub().resolves(false), [ATLAS_CODE]),
      Quit: prepareAction(sinon.stub().resolves(true))
    };
  });

  it(`assembles hermes' action list and shows select action dialog`, async () => {
    selectActionDialogStub.resolves({action: 'First action'});
    selectActionDialogStub.resolves({action: 'Quit'});

    await (await startPhase(HERMES))();

    expect(selectActionDialogStub).to.have.been.calledWithExactly(['First action', 'Quit']);
  });

  it(`assembles atlas' action list and shows select action dialog`, async () => {
    selectActionDialogStub.onFirstCall().resolves({action: 'First action'});
    selectActionDialogStub.onSecondCall().resolves({action: 'Quit'});

    await (await startPhase(ATLAS_1))();

    expect(selectActionDialogStub).to.have.been.calledWithExactly(['First action', 'Second action', 'Quit']);
  });

  it('exits only after Quit action was selected', async () => {
    selectActionDialogStub.resolves({action: 'Second action'});
    selectActionDialogStub.onCall(5).resolves({action: 'Quit'});

    await (await startPhase(ATLAS_1))();

    expect(selectActionDialogStub).to.have.callCount(6);
  });

  it('calls action associated with selected key on every iteration', async () => {
    selectActionDialogStub.onFirstCall().resolves({action: 'First action'});
    selectActionDialogStub.onSecondCall().resolves({action: 'Second action'});
    selectActionDialogStub.onThirdCall().resolves({action: 'Quit'});

    await (await startPhase(ATLAS_1))();

    expect(actions['First action'].performAction).to.be.calledOnceWith();
    expect(actions['First action'].performAction).to.be.calledBefore(actions['Second action']);
    expect(actions['Second action'].performAction).to.be.calledOnceWith();
    expect(actions['Second action'].performAction).to.be.calledBefore(actions.Quit);
    expect(actions.Quit.performAction).to.be.calledOnceWith();
  });

  describe('In case of errors', () => {
    beforeEach(() => {
      selectActionDialogStub.onFirstCall().resolves({action: 'First action'});
      selectActionDialogStub.onSecondCall().resolves({action: 'Quit'});
    });

    it('displays correct dialog when account has insufficient funds', async () => {
      actions['First action'].performAction.rejects(new Error('Error: Insufficient funds'));

      await (await startPhase(ATLAS_1))();

      expect(insufficientFundsDialogStub).to.be.calledOnce;
    });

    it('displays generic error dialog otherwise', async () => {
      actions['First action'].performAction.rejects(new Error('TestError'));

      await (await startPhase(ATLAS_1))();

      expect(errorDialogStub).to.be.calledOnceWith('TestError');
    });
  });
});
