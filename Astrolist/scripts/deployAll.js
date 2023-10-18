const { BigNumber } = require('ethers');
const { ethers, upgrades } = require('hardhat');

async function main() {
  [owner, ...addr] = await ethers.getSigners();

  AstroNFT = await ethers.getContractFactory('Astrolists');
  //   astroNFT = await upgrades.deployProxy(
  //     AstroNFT,
  //     [],
  //     { initializer: 'initialize' },
  //     { kind: 'uups' }
  //   );

  astroNFT = await AstroNFT.attach(
    '0x782f3Ef029a361d79289c9513Ae6D10E5262689F'
  );

  console.log('AstrolistNFT address: ', astroNFT.address);
  AstroSell = await ethers.getContractFactory('AstrolistSell');
  // prettier-ignore
  astroSell = await upgrades.deployProxy(
    AstroSell,
    [
      astroNFT.address, //Astrolist NFT address
      '0x0584B16E610376d141000e49B82F8CeD34f78deb', // busd address // collector address
      addr[0].address,
      'https://olive-realistic-shrew-608.mypinata.cloud/ipfs/QmZ8M55MKThUD8KQLAguFdjNbi7XFQ7AcGPohngPbGe91D/', //base uri
      ethers.utils.parseEther('50'), // price
    ],
    { initializer: 'initialize' },
    { kind: 'uups' },
    { timeout : 0}
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

// prettier-ignore

// [0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6,0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace,0xc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b,0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b,0x036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0,0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f,0xa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c688,0xf3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3,0x6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af,0xc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a8];


// 1. dnft-presale-jzs1ld96m-dure-cepheus.vercel.app/0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6
// 2. dnft-presale-jzs1ld96m-dure-cepheus.vercel.app/0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace
// 3. dnft-presale-jzs1ld96m-dure-cepheus.vercel.app/0xc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b
// 4. dnft-presale-jzs1ld96m-dure-cepheus.vercel.app/0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b
// 5. dnft-presale-jzs1ld96m-dure-cepheus.vercel.app/0x036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0
// 6. dnft-presale-jzs1ld96m-dure-cepheus.vercel.app/0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f
// 7. dnft-presale-jzs1ld96m-dure-cepheus.vercel.app/0xa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c688
// 8. dnft-presale-jzs1ld96m-dure-cepheus.vercel.app/0xf3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3
// 9. dnft-presale-jzs1ld96m-dure-cepheus.vercel.app/0x6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af
// 1. dnft-presale-jzs1ld96m-dure-cepheus.vercel.app/0xc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a8
