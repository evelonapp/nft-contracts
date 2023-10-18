const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
  [owner, ...addr] = await ethers.getSigners();

  console.log("Deploying with address: ", owner.address);

  FakeBUSD = await ethers.getContractFactory("FakeBusd");
  fakeBUSD = await FakeBUSD.deploy();

  AstroNFT = await ethers.getContractFactory("Chepheus_Astro");
  astroNFT = await AstroNFT.deploy();

  CepheusRigel = await ethers.getContractFactory("CepheusRigel");
  cepheusRigel = await upgrades.deployProxy(
    CepheusRigel,
    [604800],
    { initializer: "initialize" },
    { kind: "uups" }
  );

  console.log("CepheusRigel contract address: ", cepheusRigel.address);

  CepheusSirius = await ethers.getContractFactory("CepheusSirius");
  cepheusSirius = await upgrades.deployProxy(
    CepheusSirius,
    [604800],
    { initializer: "initialize" },
    { kind: "uups" }
  );

  console.log("CepheusSirius contract address: ", cepheusSirius.address);

  CepheusVega = await ethers.getContractFactory("CepheusVega");
  cepheusVega = await upgrades.deployProxy(
    CepheusVega,
    [604800],
    { initializer: "initialize" },
    { kind: "uups" }
  );

  console.log("CepheusVega contract address: ", cepheusVega.address);

  Presale = await ethers.getContractFactory("NFTStakingPresale");
  presale = await upgrades.deployProxy(
    Presale,
    [
      [
        cepheusRigel.address,
        cepheusSirius.address,
        cepheusVega.address,
        fakeBUSD.address,
        addr[0].address,
        astroNFT.address,
      ],
      [
        ethers.utils.parseEther("500"),
        ethers.utils.parseEther("2500"),
        ethers.utils.parseEther("5000"),
      ],
      [50, 50, 50],
      [
        ethers.utils.parseEther("50"),
        ethers.utils.parseEther("500"),
        ethers.utils.parseEther("500"),
      ],
      [
        "https://cepheus-nfts.s3.eu-central-1.amazonaws.com/CepheusStar+Metadata/Rigel+Metadata/",
        "https://cepheus-nfts.s3.eu-central-1.amazonaws.com/CepheusStar+Metadata/Sirius+Metadata/",
        "https://cepheus-nfts.s3.eu-central-1.amazonaws.com/CepheusStar+Metadata/Vega+Metadata/",
      ],
      ".json",
      true,
    ],
    { initializer: "initialize" },
    { kind: "uups" }
  );

  console.log("Presale token: ", presale.address);

  console.log("Granting Role");
  await cepheusRigel.grantRole(
    await cepheusRigel.MINTER_ROLE(),
    presale.address
  );
  await cepheusSirius.grantRole(
    await cepheusSirius.MINTER_ROLE(),
    presale.address
  );
  await cepheusVega.grantRole(await cepheusVega.MINTER_ROLE(), presale.address);

  console.log("Complete");

  console.log("minting one nft for you");
  await astroNFT.safeMint(owner.address, 1);

  console.log("Completed");

  const addresses = {
    busdAddress: fakeBUSD.address,
    presaleAddress: presale.address,
  };

  fs.writeFileSync("address.json", JSON.stringify(addresses));
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
