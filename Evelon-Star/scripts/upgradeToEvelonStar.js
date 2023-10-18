const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
  [owner, ...addr] = await ethers.getSigners();

  console.log("Deploying with address: ", owner.address);

  evelonStar = await ethers.getContractFactory("EvelonStar");

  evelonRigel = await upgrades.upgradeProxy(
    "0x64E9289eD7Ae1837086E82396566F685c5254136",
    evelonStar
  );

  console.log("Rigel ugraded");

  evelonSirius = await upgrades.upgradeProxy(
    "0x55289987015DD022AC179A6EC00ABFE49D2732aB",
    evelonStar
  );

  console.log("Sirius upgraded");

  evelonVega = await upgrades.upgradeProxy(
    "0x5152F9bEAE5c701085BdCE30F647a80e0d50EBdd",
    evelonStar
  );

  console.log("Vega upgraded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
