const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
  [owner, ...addr] = await ethers.getSigners();

  console.log("Deploying with address: ", owner.address);

  CepheusStar = await ethers.getContractFactory("CepheusStar");
  cepheusRigel = await upgrades.deployProxy(
    CepheusStar,
    ["Cepheus Rigel", "RIGEL", 1671386400],
    { initializer: "initialize" },
    { kind: "uups" }
  );

  console.log("CepheusRigel contract address: ", cepheusRigel.address);

  cepheusSirius = await upgrades.deployProxy(
    CepheusStar,
    ["Cepheus Sirius", "SIRIUS", 1671386400],
    { initializer: "initialize" },
    { kind: "uups" }
  );

  console.log("CepheusSirius contract address: ", cepheusSirius.address);

  cepheusVega = await upgrades.deployProxy(
    CepheusStar,
    ["Cepheus Vega", "VEGA", 1671386400],
    { initializer: "initialize" },
    { kind: "uups" }
  );

  console.log("CepheusVega contract address: ", cepheusVega.address);

  // cepheusRigel = await CepheusStar.attach(
  //   "0x64E9289eD7Ae1837086E82396566F685c5254136"
  // );

  // cepheusSirius = await CepheusStar.attach(
  //   "0x55289987015DD022AC179A6EC00ABFE49D2732aB"
  // );

  // cepheusVega = await CepheusStar.attach(
  //   "0x5152F9bEAE5c701085BdCE30F647a80e0d50EBdd"
  // );

  Presale = await ethers.getContractFactory("NFTStakingPresale");
  presale = await upgrades.deployProxy(
    Presale,
    [
      [
        cepheusRigel.address,
        cepheusSirius.address,
        cepheusVega.address,
        "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "0xa3472bDf508E0d05Db0513c09A34EfF3572e0E5e",
        "0xb3c894892183aD8e84798973d5A2CAa542f78F10",
      ],
      [
        ethers.utils.parseUnits("500", 6),
        ethers.utils.parseUnits("2500", 6),
        ethers.utils.parseUnits("5000", 6),
      ],
      [50, 50, 50],
      [
        ethers.utils.parseUnits("50", 6),
        ethers.utils.parseUnits("500", 6),
        ethers.utils.parseUnits("500", 6),
      ],
      [
        "https://cepheus-nfts.s3.eu-central-1.amazonaws.com/CepheusStar+Metadata/Rigel+Metadata/",
        "https://cepheus-nfts.s3.eu-central-1.amazonaws.com/CepheusStar+Metadata/Sirius+Metadata/",
        "https://cepheus-nfts.s3.eu-central-1.amazonaws.com/CepheusStar+Metadata/Vega+Metadata/",
      ],
      ".json",
      true,
      1671386400,
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

  const addresses = {
    rigelAddress: cepheusRigel.address,
    siriusAddress: cepheusSirius.address,
    vegaAddress: cepheusVega.address,
    presaleAddress: presale.address,
  };
  const time = new Date();
  console.log(time);

  // fs.writeFileSync(`Mainnet/${time}.json`, JSON.stringify(addresses));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// CepheusRigel contract address:  0x64E9289eD7Ae1837086E82396566F685c5254136
// CepheusSirius contract address:  0x55289987015DD022AC179A6EC00ABFE49D2732aB
// CepheusVega contract address:  0x5152F9bEAE5c701085BdCE30F647a80e0d50EBdd
// Presale token:  0x8684F69E40DAbc6a68A833b37582C3c692C38D7B
