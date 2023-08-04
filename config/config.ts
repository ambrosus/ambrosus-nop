/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

export const DOCKER_FILE_NAME = 'docker-compose.yml';
export const PARITY_CONFIG_FILE_NAME = 'parity_config.toml';

export const PASSWORD_FILE_NAME = 'password.pwds';
export const KEY_FILE_NAME = 'keyfile';
export const CHAIN_DESCRIPTION_FILE_NAME = 'chain.json';

export const STATE_PATH = process.env.STORE_PATH || 'state.json';
export const TEMPLATE_DIRECTORY = process.env.TEMPLATE_DIRECTORY || './setup_templates/';
export const OUTPUT_DIRECTORY = process.env.OUTPUT_DIRECTORY || './output';
