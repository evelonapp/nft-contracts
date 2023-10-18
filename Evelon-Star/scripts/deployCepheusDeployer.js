const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
  [owner, ...addr] = await ethers.getSigners();

  console.log("Deploying with address: ", owner.address);

  Deployer = await ethers.getContractFactory("CepheusDeployer");
  deployer = await upgrades.deployProxy(
    Deployer,
    [
      1,
      "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "0xa3472bDf508E0d05Db0513c09A34EfF3572e0E5e",
      [1, 2, 3, 4, 5, 6],
      [
        ethers.utils.parseUnits("50", "6"),
        ethers.utils.parseUnits("50", "6"),
        ethers.utils.parseUnits("50", "6"),
        ethers.utils.parseUnits("50", "6"),
        ethers.utils.parseUnits("50", "6"),
        ethers.utils.parseUnits("50", "6"),
      ],
    ],
    { initializer: "initialize" },
    { kind: "uups" }
  );

  console.log("Deployer address: ", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//0x253Dd1cBDDcaDB377bC00480E61daE4DA66E97f9
