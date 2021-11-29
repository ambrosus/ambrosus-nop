/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Dialog from '../models/dialog_model';
import StateModel from '../models/state_model';
import {Network} from '../interfaces/network';

const hasNetworkChanged = (existingNetwork, availableNetwork) => !availableNetwork || Object.entries(availableNetwork)
  .some(([key, value]) => existingNetwork[key] !== value);

async function askForNetwork(availableNetworks) {
  const availableNetworksNames = Object.keys(availableNetworks);

  if (availableNetworksNames.length === 0) {
    throw new Error('No networks are defined');
  } else if (availableNetworksNames.length === 1) {
    return availableNetworksNames[0];
  } else {
    const answers = await Dialog.askForNetworkDialog(availableNetworksNames);
    return answers.network;
  }
}

const selectNetwork = async (availableNetworks) => {
  const existingNetwork = await StateModel.getNetwork();
  if (existingNetwork && !hasNetworkChanged(existingNetwork, availableNetworks[existingNetwork.name])) {
    return existingNetwork;
  }
  let selectedNetwork;
  if (existingNetwork && availableNetworks[existingNetwork.name]) {
    selectedNetwork = existingNetwork.name;
  } else {
    selectedNetwork = await askForNetwork(availableNetworks);
  }
  const networkToStore = {...availableNetworks[selectedNetwork], name: selectedNetwork};
  await StateModel.storeNetwork(networkToStore);
  if (existingNetwork) {
    Dialog.dockerRestartRequiredDialog();
  }
  return networkToStore;
};

const selectNetworkPhase = async (availableNetworks) => {
  const selectedNetwork = await selectNetwork(availableNetworks);
  Dialog.networkSelectedDialog(selectedNetwork.name);
  return selectedNetwork as Network;
};

export default selectNetworkPhase;
