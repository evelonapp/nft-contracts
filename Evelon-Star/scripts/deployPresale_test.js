const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");

async function main() {
  [owner, ...addr] = await ethers.getSigners();

  console.log("Deploying with address: ", owner.address);

  CepheusStar = await ethers.getContractFactory("CepheusStars");
  cepheusStar = await upgrades.deployProxy(
    CepheusStar,
    [],
    { initializer: "initialize" },
    { kind: "uups" }
  );

  console.log("CepheusStar contract address: ", cepheusStar.address);

  Presale = await ethers.getContractFactory("NFTStakingPresale");
  presale = await upgrades.deployProxy(
    Presale,
    [
      [
        cepheusStar.address,
        "0x0584B16E610376d141000e49B82F8CeD34f78deb",
        addr[0].address,
        "0x782f3Ef029a361d79289c9513Ae6D10E5262689F",
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
      ["Rigel", "Sirius", "Vega"],
    ],
    { initializer: "initialize" },
    { kind: "uups" }
  );

  //astrolist = await upgrades.upgradeProxy(
  //  "0x8025F4613D8A59F9dF297b1079A22f605efB2621",
  //  Astrolist
  //);

  console.log("presale contract address: ", presale.address);

  console.log("Granting Role");
  await cepheusStar.grantRole(await cepheusStar.MINTER_ROLE(), presale.address);
  console.log("Complete");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
