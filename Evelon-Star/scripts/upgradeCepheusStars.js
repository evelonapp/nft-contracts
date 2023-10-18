const { BigNumber } = require("ethers");
// const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  [deployer, ...addrAll] = await hre.ethers.getSigners(); // Those addresses should be different for mainnet
  console.log("Deployer address: ", deployer.address);
  Presale = await hre.ethers.getContractFactory("CepheusStar");

  presale = await hre.upgrades.upgradeProxy(
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    Presale
  );

  // //Contract is Deployed
  await presale.deployed();

  console.log("Presale address:", presale.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
