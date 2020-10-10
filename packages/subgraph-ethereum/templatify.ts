import yaml = require('js-yaml');

import Handlebars = require('handlebars');
import fs = require('fs-extra');
import path = require('path');

import typy = require('typy');

function getNetworkNameForSubgraph() {
  switch (process.env.SUBGRAPH) {
    case undefined:
    case 'tomafrench/delegated-withdrawals':
      return 'mainnet';
    case 'tomafrench/delegated-withdrawals-goerli':
      return 'goerli';
    default:
      return null;
  }
}

(async () => {
  const networksFilePath = path.join(__dirname, 'networks.yaml');
  const networks = yaml.load(
    await fs.readFile(networksFilePath, { encoding: 'utf-8' }),
  );

  const networkName = process.env.NETWORK_NAME || getNetworkNameForSubgraph();
  const network = typy.t(networks, networkName || '').safeObject;
  if (typy.t(network).isFalsy) {
    throw new Error(
      'Please set either a "NETWORK_NAME" or a "SUBGRAPH" environment variable',
    );
  }

  const subgraphTemplateFilePath = path.join(
    __dirname,
    'subgraph.template.yaml',
  );
  const source = await fs.readFile(subgraphTemplateFilePath, 'utf-8');
  const template = Handlebars.compile(source);
  const result = template(network);
  await fs.writeFile(path.join(__dirname, 'subgraph.yaml'), result);

  console.log('🎉 subgraph.yaml successfully generated');
})();
