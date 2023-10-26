// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  const Evelon = await ethers.getContractFactory("EvelonNFTs");
  const evelon = await upgrades.deployProxy(
    Evelon,
    [owner.address, owner.address, owner.address],
    {
      initializer: "initialize",
    },
    { kind: "uups" }
  );
  console.log("Evelon address", evelon.target);

  const Factory = await ethers.getContractFactory("EvelonFactory");
  const factory = await upgrades.deployProxy(
    Factory,
    [
      owner.address,
      owner.address,
      evelon.target,
      "0x69f5b5974536631582d12ed5bc270a6c20448bd9",
      owner.address,
      otherAccount.address,
      1000,
      10000000,
    ],
    {
      initializer: "initialize",
    },
    { kind: "uups" }
  );
  console.log("Factory address", factory.target);
  console.log("Granting Role");

  await evelon.grantRole(await evelon.MINTER_ROLE(), factory.target);
  console.log("Deployment completed");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
