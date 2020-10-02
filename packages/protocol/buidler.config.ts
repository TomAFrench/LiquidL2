import { BuidlerConfig, usePlugin } from '@nomiclabs/buidler/config';
import "./tasks/typechain";

usePlugin('@nomiclabs/buidler-waffle');
usePlugin("solidity-coverage");

const config: BuidlerConfig = {
  solc: {
    /* https://buidler.dev/buidler-evm/#solidity-optimizer-support */
    optimizer: {
      enabled: false,
      runs: 200,
    },
    version: '0.6.10',
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
};

export default config;
