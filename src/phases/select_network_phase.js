/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const selectNetwork = async (availableNetworks, stateModel, askForNetworkDialog) => {
  const existingNetwork = await stateModel.getNetwork();
  if (existingNetwork !== null) {
    return existingNetwork;
  }
  const availableNetworksNames = Object.keys(availableNetworks);
  let selectedNetwork;
  if (availableNetworksNames.length === 0) {
    throw new Error('No networks are defined');
  } else if (availableNetworksNames.length === 1) {
    [selectedNetwork] = availableNetworksNames;
  } else {
    const answers = await askForNetworkDialog(availableNetworksNames);
    ({network: selectedNetwork} = answers);
  }
  const networkToStore = {...availableNetworks[selectedNetwork], name: selectedNetwork};
  await stateModel.storeNetwork(networkToStore);
  return networkToStore;
};

const selectNetworkPhase = (availableNetworks, stateModel, askForNetworkDialog, networkSelectedDialog) => async () => {
  const selectedNetwork = await selectNetwork(availableNetworks, stateModel, askForNetworkDialog);
  networkSelectedDialog(selectedNetwork.name);
  return selectedNetwork;
};

export default selectNetworkPhase;
