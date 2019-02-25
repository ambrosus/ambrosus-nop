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

import SystemModel from '../../src/models/system_model';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('System Model', () => {
  let systemStub;
  let systemModel;

  beforeEach(async () => {
    systemStub = {
      isDockerAvailable: sinon.stub()
    };
    systemModel = new SystemModel(systemStub);
  });

  describe('isDockerAvailable', () => {
    it('returns true if docker is available', async () => {
      systemStub.isDockerAvailable.resolves(true);
      await expect(systemModel.isDockerAvailable()).to.be.eventually.fulfilled.with.true;
      await expect(systemStub.isDockerAvailable).to.have.been.calledOnce;
    });

    it('returns false if docker is not available', async () => {
      systemStub.isDockerAvailable.resolves(false);
      await expect(systemModel.isDockerAvailable()).to.be.eventually.fulfilled.with.false;
      await expect(systemStub.isDockerAvailable).to.have.been.calledOnce;
    });
  });
});
