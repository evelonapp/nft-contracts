require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/ge0yV5tcDgNRr6pcYC06RDEgOiMNX4Ff",
      chainId: 80001,
      allowUnlimitedContractSize: true,
      accounts: { mnemonic: process.env.MNEMONIC },
    },
  },
  etherscan: {
    apiKey: process.env.mumbaiAPI, //process.env.MOONBEAM_API, //process.env.RINKEBY_RPC_URL,
  },
};
