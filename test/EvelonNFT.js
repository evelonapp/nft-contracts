const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { upgrades } = require("hardhat");

describe("Lock", function () {
  async function deployEvelon() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Evelon = await ethers.getContractFactory("EvelonNFTs");
    const evelon = await upgrades.deployProxy(
      Evelon,
      [owner.address],
      {
        initializer: "initialize",
      },
      { kind: "uups" }
    );

    return { evelon, owner };
  }

  describe("Deployment", async function () {
    it("Evelon contract should show the uri to nft", async function () {
      const { evelon, owner } = await deployEvelon();
      await evelon.setURI("abhi", "prefix");
      await evelon.mint(owner.address, 1, 1, "0x");
      console.log(await evelon.uri(1));
    });
  });
});
