const { BigNumber } = require('ethers');
const { ethers, upgrades } = require('hardhat');

async function main() {
  // We get the contract to deploy
  [deployer, ...addrAll] = await ethers.getSigners(); // Those addresses should be different for mainnet

  AstroSell = await ethers.getContractFactory('AstrolistSell');

  AstroSellV2 = await upgrades.upgradeProxy(
    '0x5e1BE81F76e0cfdbBc500cA1c62Cb24b6201B40C',
    AstroSell
  );

  // //Contract is Deployed
  await AstroSellV2.deployed();

  console.log('Node address:', AstroSellV2.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
