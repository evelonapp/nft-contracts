const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
  [owner, ...addr] = await ethers.getSigners();

  console.log("Deploying with address: ", owner.address);

  Cepheus = await ethers.getContractFactory("EvelonStar");

  rigel = await upgrades.deployProxy(
    Cepheus,
    [
      "Evelon Rigel",
      "Rigel",
      "https://evelon.s3.eu-central-1.amazonaws.com/EvelonStar+Metadata/Rigel+Metadata/",
      ".json",
    ],
    { initializer: "initialize" },
    { kind: "uups" }
  );

  console.log("Rigel address: ", rigel.address);

  sirius = await upgrades.deployProxy(
    Cepheus,
    [
      "Evelon Sirius",
      "Sirius",
      "https://evelon.s3.eu-central-1.amazonaws.com/EvelonStar+Metadata/Sirius+Metadata/",
      ".json",
    ],
    { initializer: "initialize" },
    { kind: "uups" }
  );

  console.log("Sirius address: ", sirius.address);

  vega = await upgrades.deployProxy(
    Cepheus,
    [
      "Evelon Vega",
      "Vega",
      "https://evelon.s3.eu-central-1.amazonaws.com/EvelonStar+Metadata/Vega+Metadata/",
      ".json",
    ],
    { initializer: "initialize" },
    { kind: "uups" }
  );

  console.log("Vega address: ", vega.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// Deploying with address:  0x1D2F71714D19e6298F599ff28109084088CFe547
// Rigel address:  0xb3c894892183aD8e84798973d5A2CAa542f78F10
// Sirius address:  0xe06C95c6969C3031d328b734B01a7838091b38Df
// Vega address:  0x5e1BE81F76e0cfdbBc500cA1c62Cb24b6201B40C
