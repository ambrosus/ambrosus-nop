/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import * as fs from 'fs';

const writeFile = (path, data, opts = {}) => fs.promises.writeFile(path, data, opts);
const readFile = (path): Promise<string> => fs.promises.readFile(path).then((buffer) => buffer.toString());
const removeFile = (path) => fs.promises.unlink(path);
const removeDirectory = (path) => fs.promises.rmdir(path);
const makeDirectory = (path) => fs.promises.mkdir(path);
const checkFileExists = (path): Promise<boolean> => fs.promises.access(path).then(() => true)
  .catch(() => false);
const getPath = (path): Promise<fs.Stats> => fs.promises.lstat(path);

export {writeFile, readFile, removeFile, checkFileExists, removeDirectory, makeDirectory, getPath};
