/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const chooseNodeTypePhase = (stateModel, askForNodeTypeDialog) => async () => {
  const answers = await askForNodeTypeDialog();
  const {nodeType} = answers;

  if (nodeType === 'atlas') {
    const {atlasType} = answers;
    await stateModel.storeRole(atlasType);
    return atlasType;
  }
  await stateModel.storeRole(nodeType);
  return nodeType;
};

export default chooseNodeTypePhase;
