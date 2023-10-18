const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");

async function main() {
  // We get the contract to deploy
  [deployer, ...addrAll] = await ethers.getSigners(); // Those addresses should be different for mainnet

  Presale = await ethers.getContractFactory("NFTStakingPresale");

  presale = await upgrades.upgradeProxy(
    "0x01f3564166205CeBa1f33E689A4281cD99C3d399",
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
