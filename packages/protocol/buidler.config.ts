import { BuidlerConfig, usePlugin } from '@nomiclabs/buidler/config';
import "./tasks/typechain";

usePlugin("@nomiclabs/buidler-etherscan");
usePlugin('@nomiclabs/buidler-waffle');
usePlugin('buidler-spdx-license-identifier');
usePlugin("solidity-coverage");


const config: BuidlerConfig = {
  solc: {
    /* https://buidler.dev/buidler-evm/#solidity-optimizer-support */
    optimizer: {
      enabled: false,
      runs: 200,
    },
    version: '0.7.1',
  },
  networks: {
    buidlerevm: {
      blockGasLimit: 10000000,
      gas: 8000000,
      hardfork: 'istanbul',
      chainId: 31337,
    },
    coverage: {
      url: "http://127.0.0.1:8555",
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${GOERLI_PRIVATE_KEY}`]
    },
    mumbai: {
      url: `https://rpc-mumbai.matic.today`,
      accounts: [`0x${GOERLI_PRIVATE_KEY}`]

    },
  },
  paths: {
    artifacts: "./src/artifacts",
    cache: "./cache",
    coverage: "./coverage",
    coverageJson: "./coverage.json",
    root: "./",
    sources: "./contracts",
    tests: "./test",
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  spdxLicenseIdentifier: {
    overwrite: true,
    runOnCompile: true,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};

export default config;
