/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/
import {
  Contracts,
  Methods,
  ContractNames,
} from "@airdao/airdao-node-contracts";
import Dialog from "../dialogs/dialog_model";
import { ethers } from "ethers";
import { Network } from "../interfaces/network";
import Crypto from "../utils/crypto";

export default async function checkStatusInServerNodes(
  privateKey: string,
  network: Network
) {
  const currentTimeInSeconds = Date.now() / 1000;
  const provider = new ethers.providers.JsonRpcProvider(network.rpc);

  const signer = new ethers.VoidSigner(ethers.constants.AddressZero, provider);
  const { chainId } = await provider.getNetwork();

  const address = Crypto.addressForPrivateKey(privateKey);

  const contracts = new Contracts(signer, chainId);
  const validator = await Methods.getApolloInfo(contracts, address);
  if (!validator) {
    Dialog.notRegisteredDialog(network.domain);
    return;
  }

  if (validator.isOnboarded) {
    Dialog.alreadyOnboardedDialog(network.domain, address);
    return;
  } else if (!validator.isOnboarded) {
    const contract = contracts.getContractByName(
      ContractNames.ServerNodesManager
    );
    const onboardingDelay = (await contract.onboardingDelay()).toNumber();
    const timeToWait =
      onboardingDelay -
      (currentTimeInSeconds - validator.apollo.timestampStake.toNumber());

    const minutes = Math.floor(timeToWait / 60);
    const seconds = timeToWait % 60;
    Dialog.waitOnboardingDialog(minutes, seconds);
    return;
  }

  return true;
}
