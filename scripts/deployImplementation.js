// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  // const Implementation = await ethers.getContractFactory("Implementation");
  // const implementation = await Implementation.deploy();

  // console.log("implementation address: ", implementation.target);

  const Factory = await ethers.getContractFactory("EvelonFactory");
  // const factory = await upgrades.deployProxy(Factory, [
  //   owner.address,
  //   owner.address,
  //   "0x52C28a6138bA4AFA744d301f4d7a15F1284c9468",
  //   "0x69f5b5974536631582d12ed5bc270a6c20448bd9",
  // ]);
  const factory = await upgrades.upgradeProxy(
    "0xb8A9952D7BD37b96fb3890A6b83a3Febbf17F800",
    Factory
  );
  console.log("factory address: ", factory.target);

  // const Implementation = await hre.ethers.getContractFactory("Implementation");
  // const implementation = await Implementation.attach(
  //   "0x52C28a6138bA4AFA744d301f4d7a15F1284c9468"
  // );

  // console.log("Implementation uri: ", await implementation.uri(0));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
