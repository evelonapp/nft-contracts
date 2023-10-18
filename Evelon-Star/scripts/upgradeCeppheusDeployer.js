const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");

async function main() {
  // We get the contract to deploy
  [deployer, ...addrAll] = await ethers.getSigners(); // Those addresses should be different for mainnet
  console.log("Deployer address: ", deployer.address);
  Presale = await ethers.getContractFactory("CepheusDeployer");

  presale = await upgrades.upgradeProxy(
    "0x253Dd1cBDDcaDB377bC00480E61daE4DA66E97f9",
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
