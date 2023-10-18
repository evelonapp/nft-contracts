require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

  networks: {
    gorile: {
      url: `https://eth-goerli.g.alchemy.com/v2/hi1QfAqt1tNAQ99bSH6PJeMfbJMHeHM6`,
      chainId: 5,
      gasPrice: 60000000000,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },

    // mainnetETH: {
    //   url: `https://eth-mainnet.g.alchemy.com/v2/EyJTCH4IKh9oVz4fQiUV8iJDjmIBF6wX`,
    //   chainId: 1,
    //   gasPrice: "auto",
    //   accounts: { mnemonic: process.env.MNEMONIC },
    // },

    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: { mnemonic: process.env.MNEMONIC },
    },
    
     mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/ge0yV5tcDgNRr6pcYC06RDEgOiMNX4Ff",
      chainId: 80001,
      accounts: { mnemonic: process.env.MNEMONIC },
    },

    polygon: {
      url: "https://rpc-mumbai.maticvigil.com/",
      chainId: 80001,
      accounts: { mnemonic: process.env.MNEMONIC },
    },

    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: { mnemonic: process.env.MNEMONIC },
    },
  },
  mocha: {
    timeout: 10000000000000000,
  },
  etherscan: {
    apiKey: process.env.RINKEBY_RPC_URL,
  },
};
