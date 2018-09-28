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

import selectNetworkPhase from '../../src/phases/select_network_phase';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Select Network Phase', () => {
  let stateModelStub;
  let askForNetworkDialogStub;
  let networkSelectedDialogStub;

  const exampleAvailableNetworks = {
    test: {
      rpc: 'test',
      headContractAddress: '0x0'
    },
    dev: {
      rpc: 'dev',
      headContractAddress: '0x1'
    }
  };
  const exampleStoredNetwork = {
    ...exampleAvailableNetworks.test,
    name: 'test'
  };

  const call = async (networks) => selectNetworkPhase(networks, stateModelStub, askForNetworkDialogStub, networkSelectedDialogStub)();

  beforeEach(async () => {
    stateModelStub = {
      storeNetwork: sinon.stub(),
      getExistingNetwork: sinon.stub().resolves(null)
    };
    askForNetworkDialogStub = sinon.stub().resolves({
      network: exampleStoredNetwork.name
    });
    networkSelectedDialogStub = sinon.stub();
  });

  it('stores selected network', async () => {
    const phaseResult = await call(exampleAvailableNetworks);

    expect(stateModelStub.getExistingNetwork).to.have.been.calledOnce;
    expect(askForNetworkDialogStub).to.have.been.calledOnceWith(['test', 'dev']);
    expect(stateModelStub.storeNetwork).to.have.been.calledOnceWith(exampleStoredNetwork);
    expect(networkSelectedDialogStub).to.have.been.calledOnceWith(exampleStoredNetwork.name);
    expect(phaseResult).to.deep.equal(exampleStoredNetwork);
  });

  it('skips selection dialog if network is already in the store', async () => {
    stateModelStub.getExistingNetwork.resolves(exampleStoredNetwork);

    const phaseResult = await call(exampleAvailableNetworks);

    expect(stateModelStub.getExistingNetwork).to.have.been.calledOnce;
    expect(askForNetworkDialogStub).to.not.have.been.called;
    expect(networkSelectedDialogStub).to.have.been.calledOnceWith(exampleStoredNetwork.name);
    expect(phaseResult).to.deep.equal(exampleStoredNetwork);
  });

  it('skips selection dialog if only one network is available', async () => {
    const phaseResult = await call({test: exampleAvailableNetworks.test});

    expect(stateModelStub.getExistingNetwork).to.have.been.calledOnce;
    expect(askForNetworkDialogStub).to.not.have.been.called;
    expect(stateModelStub.storeNetwork).to.have.been.calledOnceWith(exampleStoredNetwork);
    expect(networkSelectedDialogStub).to.have.been.calledOnceWith(exampleStoredNetwork.name);
    expect(phaseResult).to.deep.equal(exampleStoredNetwork);
  });

  it('throws error if no networks are available and network is not stored', async () => {
    await expect(call({})).to.be.rejected;
  });
});
