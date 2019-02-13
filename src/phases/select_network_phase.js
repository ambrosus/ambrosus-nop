/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const hasNetworkChanged = (existingNetwork, availableNetwork) => !availableNetwork || Object.entries(availableNetwork)
  .some(([key, value]) => existingNetwork[key] !== value);

async function askForNetwork(availableNetworks, askForNetworkDialog) {
  const availableNetworksNames = Object.keys(availableNetworks);

  if (availableNetworksNames.length === 0) {
    throw new Error('No networks are defined');
  } else if (availableNetworksNames.length === 1) {
    return availableNetworksNames[0];
  } else {
    const answers = await askForNetworkDialog(availableNetworksNames);
    return answers.network;
  }
}

const selectNetwork = async (availableNetworks, stateModel, askForNetworkDialog, dockerRestartRequiredDialog) => {
  const existingNetwork = await stateModel.getNetwork();
  if (existingNetwork && !hasNetworkChanged(existingNetwork, availableNetworks[existingNetwork.name])) {
    return existingNetwork;
  }
  let selectedNetwork;
  if (existingNetwork && availableNetworks[existingNetwork.name]) {
    selectedNetwork = existingNetwork.name;
  } else {
    selectedNetwork = await askForNetwork(availableNetworks, askForNetworkDialog);
  }
  const networkToStore = {...availableNetworks[selectedNetwork], name: selectedNetwork};
  await stateModel.storeNetwork(networkToStore);
  if (existingNetwork) {
    dockerRestartRequiredDialog();
  }
  return networkToStore;
};

const selectNetworkPhase = (availableNetworks, stateModel, askForNetworkDialog, networkSelectedDialog, dockerRestartRequiredDialog) => async () => {
  const selectedNetwork = await selectNetwork(availableNetworks, stateModel, askForNetworkDialog, dockerRestartRequiredDialog);
  networkSelectedDialog(selectedNetwork.name);
  return selectedNetwork;
};

export default selectNetworkPhase;
