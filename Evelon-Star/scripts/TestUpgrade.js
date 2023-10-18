const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
  [owner, ...addr] = await ethers.getSigners();

  console.log("Deploying with address: ", owner.address);

  CepheusRigel = await ethers.getContractFactory("EvelonStar");

  rigel = await upgrades.deployProxy(
    CepheusRigel,
    ["Abhi", "abhi", "baseURI/", ".json"],
    { initializer: "initialize" },
    { kind: "uups" }
  );
  let name = await rigel.name();
  let symbol = await rigel.symbol();

  console.log("old name and symbol: ", name, symbol);
  await rigel.changeNameAndSymbol("Evelon Rigel", "Rigel");

  name = await rigel.name();
  symbol = await rigel.symbol();

  console.log("old name and symbol: ", name, symbol);

  name = await rigel.name();
  symbol = await rigel.symbol();

  await rigel.safeMint(owner.address);

  let ownerAddress = await rigel.ownerOf(1);

  console.log("owner of token id 1: ", ownerAddress);

  await rigel.transferFrom(ownerAddress, addr[0].address, 1);

  ownerAddress = await rigel.ownerOf(1);

  console.log("owner of token id 1: ", ownerAddress);

  await rigel.updateBaseURIAndSuffix(
    "https://evelon.s3.eu-central-1.amazonaws.com/EvelonStar+Metadata/Sirius+Metadata/",
    ".json"
  );

  const tokenUri = await rigel.tokenURI(1);

  console.log("TokenUri: ", tokenUri);
  // cepheusRigel = await upgrades.upgradeProxy(
  //   "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  //   CepheusRigel
  // );

  // console.log("CepheusRigel contract address: ", cepheusRigel.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Deploying with address:  0x02F4Db4adeA0E1E84e3Ff4901c4Af3DB4Cca2f80
// CepheusRigel contract address:  0x1bd663E4726B55e6e6413936D90210DbD4EF314e
// CepheusSirius contract address:  0x3BD2B27e880248703A795f9214dbD1E7CeF12CAD
// CepheusVega contract address:  0xc3D2334B9921C79CE6A5B462d1002D21AdD787D5
// Presale token:  0xAB452D22d70dE764EdFE475BFEaBE87BFD833B29

// 6/12/2022
// CepheusRigel contract address:  0x00702f8360d212FD489EeE67C7a15a48c99ffEdb
// CepheusSirius contract address:  0x1b910543E95faDF27c214A14D55A60339aC40474
// CepheusVega contract address:  0x7A981Aab21070cF25a9Ef648487adce44992eAcE
// Presale token:  0x01f3564166205CeBa1f33E689A4281cD99C3d399
