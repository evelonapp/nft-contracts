require('@nomicfoundation/hardhat-toolbox');
require('@openzeppelin/hardhat-upgrades');
const { mnemonic, api, alchemyApiKey } = require('./secrets.json');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.4.22',
      },
      {
        version: '0.8.17',
      },
    ],
  },
  networks: {
    mainnetETH: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
      chainId: 1,
      accounts: { mnemonic: mnemonic },
    },

    gorile: {
      url: `https://eth-goerli.g.alchemy.com/v2/hi1QfAqt1tNAQ99bSH6PJeMfbJMHeHM6`,
      chainId: 5,
      accounts: { mnemonic: mnemonic },
      gasPrice: 60000000000,
    },

    testnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic: mnemonic },
    },
    polygon: {
      url: 'https://polygon-rpc.com/',
      chainId: 137,
      accounts: { mnemonic: mnemonic },
    },
  },

  etherscan: {
    apiKey: api,
  },
};
