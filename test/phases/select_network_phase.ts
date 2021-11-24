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

import selectNetworkPhase from '../../src/phases/select_network_phase';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Select Network Phase', () => {
  let stateModelStub;
  let askForNetworkDialogStub;
  let networkSelectedDialogStub;
  let dockerRestartReuiredDialogStub;

  const exampleAvailableNetworks = {
    test: {
      rpc: 'test',
      chainspec: 'https://chainspec.ambrosus-test.io',
      headContractAddress: '0x0',
      dockerTag: '1'
    },
    dev: {
      rpc: 'dev',
      chainspec: 'https://chainspec.ambrosus-dev.io',
      headContractAddress: '0x1',
      dockerTag: '2'
    }
  };
  const exampleStoredNetwork = {
    ...exampleAvailableNetworks.test,
    name: 'test'
  };

  const call = async (networks) => selectNetworkPhase(networks, stateModelStub, askForNetworkDialogStub, networkSelectedDialogStub, dockerRestartReuiredDialogStub)();

  beforeEach(async () => {
    stateModelStub = {
      storeNetwork: sinon.stub(),
      getNetwork: sinon.stub().resolves(null)
    };
    askForNetworkDialogStub = sinon.stub().resolves({
      network: exampleStoredNetwork.name
    });
    networkSelectedDialogStub = sinon.stub();
    dockerRestartReuiredDialogStub = sinon.stub();
  });

  it('stores selected network', async () => {
    const phaseResult = await call(exampleAvailableNetworks);

    expect(stateModelStub.getNetwork).to.have.been.calledOnce;
    expect(askForNetworkDialogStub).to.have.been.calledOnceWith(['test', 'dev']);
    expect(stateModelStub.storeNetwork).to.have.been.calledOnceWith(exampleStoredNetwork);
    expect(networkSelectedDialogStub).to.have.been.calledOnceWith(exampleStoredNetwork.name);
    expect(dockerRestartReuiredDialogStub).to.be.not.called;
    expect(phaseResult).to.deep.equal(exampleStoredNetwork);
  });

  it('skips selection dialog if correct network is already in the store', async () => {
    stateModelStub.getNetwork.resolves(exampleStoredNetwork);

    const phaseResult = await call(exampleAvailableNetworks);

    expect(stateModelStub.getNetwork).to.have.been.calledOnce;
    expect(askForNetworkDialogStub).to.not.have.been.called;
    expect(stateModelStub.storeNetwork).to.not.have.been.called;
    expect(networkSelectedDialogStub).to.have.been.calledOnceWith(exampleStoredNetwork.name);
    expect(dockerRestartReuiredDialogStub).to.be.not.called;
    expect(phaseResult).to.deep.equal(exampleStoredNetwork);
  });

  for (const field of ['rpc', 'chainspec', 'headContractAddress', 'dockerTag']) {
    // eslint-disable-next-line no-loop-func
    it(`stores network without showing selection dialog when network without ${field} was stored`, async () => {
      stateModelStub.getNetwork.resolves({...exampleStoredNetwork, [field]: null});
      const phaseResult = await call(exampleAvailableNetworks);
      expect(askForNetworkDialogStub).to.be.not.called;
      expect(stateModelStub.storeNetwork).to.have.been.calledOnceWith(exampleStoredNetwork);
      expect(dockerRestartReuiredDialogStub).to.be.calledOnce;
      expect(phaseResult).to.deep.equal(exampleStoredNetwork);
    });
  }

  for (const field of ['rpc', 'chainspec', 'headContractAddress', 'dockerTag']) {
    // eslint-disable-next-line no-loop-func
    it(`stores network without showing selection dialog when ${field} has changed in config before`, async () => {
      stateModelStub.getNetwork.resolves({...exampleStoredNetwork, [field]: 12});
      const phaseResult = await call(exampleAvailableNetworks);
      expect(askForNetworkDialogStub).to.be.not.called;
      expect(dockerRestartReuiredDialogStub).to.be.calledOnce;
      expect(stateModelStub.storeNetwork).to.have.been.calledOnceWith(exampleStoredNetwork);
      expect(phaseResult).to.deep.equal(exampleStoredNetwork);
    });
  }

  it('shows selection dialog when network with same name as currently stored one is not available anymore', async () => {
    stateModelStub.getNetwork.resolves({...exampleStoredNetwork, name: 'bar'});

    const phaseResult = await call(exampleAvailableNetworks);

    expect(stateModelStub.getNetwork).to.have.been.calledOnce;
    expect(askForNetworkDialogStub).to.have.been.calledOnceWith(['test', 'dev']);
    expect(stateModelStub.storeNetwork).to.have.been.calledOnceWith(exampleStoredNetwork);
    expect(networkSelectedDialogStub).to.have.been.calledOnceWith(exampleStoredNetwork.name);
    expect(dockerRestartReuiredDialogStub).to.be.calledOnce;
    expect(phaseResult).to.deep.equal(exampleStoredNetwork);
  });

  it('shows selection dialog when network with missing name was stored', async () => {
    stateModelStub.getNetwork.resolves({...exampleStoredNetwork, name: undefined});

    const phaseResult = await call(exampleAvailableNetworks);

    expect(stateModelStub.getNetwork).to.have.been.calledOnce;
    expect(askForNetworkDialogStub).to.have.been.calledOnceWith(['test', 'dev']);
    expect(stateModelStub.storeNetwork).to.have.been.calledOnceWith(exampleStoredNetwork);
    expect(networkSelectedDialogStub).to.have.been.calledOnceWith(exampleStoredNetwork.name);
    expect(dockerRestartReuiredDialogStub).to.be.calledOnce;
    expect(phaseResult).to.deep.equal(exampleStoredNetwork);
  });

  it('skips selection dialog if only one network is available', async () => {
    const phaseResult = await call({test: exampleAvailableNetworks.test});

    expect(stateModelStub.getNetwork).to.have.been.calledOnce;
    expect(askForNetworkDialogStub).to.not.have.been.called;
    expect(stateModelStub.storeNetwork).to.have.been.calledOnceWith(exampleStoredNetwork);
    expect(dockerRestartReuiredDialogStub).to.be.not.called;
    expect(networkSelectedDialogStub).to.have.been.calledOnceWith(exampleStoredNetwork.name);
    expect(phaseResult).to.deep.equal(exampleStoredNetwork);
  });

  it('throws error if no networks are available and network is not stored', async () => {
    await expect(call({})).to.be.rejected;
  });
});
