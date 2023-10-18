const { BigNumber } = require('ethers');
const { ethers, upgrades } = require('hardhat');

async function main() {
  [owner, ...addr] = await ethers.getSigners();

  AstroNFT = await ethers.getContractFactory('Astrolists');
  astroNFT = await AstroNFT.attach(
    '0xb3c894892183aD8e84798973d5A2CAa542f78F10' 
  ); // Astrolist NFT address

  AstroSell = await ethers.getContractFactory('AstrolistSell');
  // prettier-ignore
  astroSell = await upgrades.deployProxy(
    AstroSell,
    [
      astroNFT.address, //Astrolist NFT address
      '0xdAC17F958D2ee523a2206206994597C13D831ec7', // busd address // collector address
      '0x379D8cf5C13F550Fe0500094016600558B70C525',
      'https://olive-realistic-shrew-608.mypinata.cloud/ipfs/QmZ8M55MKThUD8KQLAguFdjNbi7XFQ7AcGPohngPbGe91D/', //base uri
      ethers.utils.parseEther('50'), // price
    ],
    { initializer: 'initialize' },
    { kind: 'uups' }
  );

  console.log('AstrolistSell address: ', astroSell.address);
  console.log('Giving Minter Role to AstolistSell address please wait..');

  const role = await astroNFT.MINTER_ROLE();

  await astroNFT.grantRole(role, astroSell.address);
  console.log('Completed');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// "nft address:  0xA0Df68c79DeBDe8aD6FC9EB0B7eEA2B479AA1A3C";
// Astro address:  0x522Dd68522A8a6f173d1f72f15312343B43D5789
//0x8461e60a8aEB6c5B18c01e2061416d84B43B11F0

// testnet (gorile)
//0xEEcbE7373B5575fC18125d643aFe64cF09E8F1D9

// Mainnet ETH ()
// AstrolistSell address:  0x5e1BE81F76e0cfdbBc500cA1c62Cb24b6201B40C
