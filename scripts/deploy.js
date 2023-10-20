// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  const Evelon = await ethers.getContractFactory("MyToken");
  const evelon = await upgrades.deployProxy(
    Evelon,
    [owner.address],
    {
      initializer: "initialize",
    },
    { kind: "uups" }
  );

  console.log("Evelon address", evelon.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
