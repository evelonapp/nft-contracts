const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { upgrades, ethers } = require("hardhat");

describe("Lock", function () {
  async function deployEvelon() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Evelon = await ethers.getContractFactory("EvelonNFTs");
    const evelon = await upgrades.deployProxy(
      Evelon,
      [owner.address, owner.address, owner.address],
      {
        initializer: "initialize",
      },
      { kind: "uups" }
    );

    const Factory = await ethers.getContractFactory("EvelonFactory");
    const factory = await upgrades.deployProxy(
      Factory,
      [
        owner.address,
        owner.address,
        evelon.target,
        evelon.target,
        owner.address,
        owner.address,
        0,
        0,
      ],
      {
        initializer: "initialize",
      },
      { kind: "uups" }
    );
    await evelon.grantRole(await evelon.MINTER_ROLE(), factory.target);

    return { evelon, factory, owner };
  }

  describe("Deployment", async function () {
    it("Evelon contract should show the uri to nft", async function () {
      const { evelon, factory, owner } = await deployEvelon();
      console.log("Trigger");
      await evelon.setURI("abhi", "prefix");
      await factory.mint(owner.address, 1, 1);
      console.log(await evelon.uri(1));
    });
  });
});
