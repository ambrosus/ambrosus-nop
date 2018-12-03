/*
Copyright: Ambrosus Technologies GmbH
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
  let actions;

  const startPhase = async () => selectActionPhase(actions, selectActionDialogStub)();

  beforeEach(async () => {
    selectActionDialogStub = sinon.stub();
    actions = {
      first: {
        name: 'First action'
      },
      second: {
        name: 'Second action'
      }
    };
  });

  it('assembles action list and shows select action dialog', async () => {
    selectActionDialogStub.resolves({action: 'first'});

    await startPhase();

    expect(selectActionDialogStub).to.have.been.calledOnceWith(
      [
        {
          name: 'First action',
          value: 'first'
        }, {
          name: 'Second action',
          value: 'second'
        }
      ]);
  });

  it('returns the selected action', async () => {
    selectActionDialogStub.resolves({action: 'second'});

    await expect(startPhase()).to.be.eventually.fulfilled.and.equal(actions.second);
  });
});
