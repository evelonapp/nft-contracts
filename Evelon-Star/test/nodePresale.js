const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

const firstReferral =
  "0x0000000000000000000000000000000000000000000000000000000000000001";
const secondReferral =
  "0x0000000000000000000000000000000000000000000000000000000000000002";
const thirdReferral =
  "0x0000000000000000000000000000000000000000000000000000000000000003";
const invalidReferral =
  "0x0000000000000000000000000000000000000000000000000000000000000004";
const fourthReferral =
  "0x0000000000000000000000000000000000000000000000000000000000000005";
const frstReferral =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

const customAddress = "0x000000000000000000000000000000000000dEaD";
// const taxForBuyBack = 20;

// const rigelNFTType = 1;
// const siriusNFTType = 2;
// const vegaNFTType = 3;

// const rigelRewardAmount = ethers.utils.parseEther("0.15");
// const siriusRewardAmount = ethers.utils.parseEther("0.45");
// const vegaRewardAmount = ethers.utils.parseEther("5");

// const rigelBuyPrice = ethers.utils.parseEther("500");
// const siriusBuyPrice = ethers.utils.parseEther("1000");
// const vegaBuyPrice = ethers.utils.parseEther("5000");

// const rigelTotal = 50;
// const siriusTotal = 50;
// const vegaTotal = 50;

// const rigelLockPeriod = ethers.BigNumber.from(90).mul(86400); //(90 * 86400).toString();
// const siriusLockPeriod = ethers.BigNumber.from(60).mul(86400); //(60 * 86400).toString();
// const vegaLockPeriod = ethers.BigNumber.from(30).mul(86400); //(30 * 86400).toString();

const rigelURI = "Qmbi9Ee7gEnRhjxPXDq8w8QyDEb3EzaftnsopcQvwGWyFc/Rigel";
const siriusURI = "Qmbi9Ee7gEnRhjxPXDq8w8QyDEb3EzaftnsopcQvwGWyFc/Sirius";
const vegaURI = "Qmbi9Ee7gEnRhjxPXDq8w8QyDEb3EzaftnsopcQvwGWyFc/vega";

const deci1 = ethers.BigNumber.from(10).pow(18);

describe("Presale contract", function () {
  beforeEach(async function () {
    [owner, addr1, ...addr] = await ethers.getSigners();

    FakeBusd = await ethers.getContractFactory("FakeBusd");
    fakeBusd = await FakeBusd.deploy();

    CepheusStar = await ethers.getContractFactory("CepheusStar");

    //Rigel = await ethers.getContractFactory("CepheusRigel");
    rigel = await upgrades.deployProxy(
      CepheusStar,
      ["Cepheus Rigel", "RIGEL", 604800],
      { initializer: "initialize" },
      { kind: "uups" }
    );

    //Sirius = await ethers.getContractFactory("CepheusSirius");
    sirius = await upgrades.deployProxy(
      CepheusStar,
      ["Cepheus Sirius", "SIRIUS", 604800],
      { initializer: "initialize" },
      { kind: "uups" }
    );

    //Vega = await ethers.getContractFactory("CepheusVega");
    vega = await upgrades.deployProxy(
      CepheusStar,
      ["Cepheus Vega", "VEGA", 604800],
      { initializer: "initialize" },
      { kind: "uups" }
    );

    AstroCon = await ethers.getContractFactory("Chepheus_Astro");
    astroCon = await AstroCon.deploy();
    const deci1 = ethers.BigNumber.from(10).pow(18);

    Astro = await ethers.getContractFactory("AstrolistSell");
    astro = await upgrades.deployProxy(
      Astro,
      [
        astroCon.address,
        fakeBusd.address,
        addr[6].address,
        "https://gateway.pinata.cloud/ipfs/",
        ethers.BigNumber.from(50).mul(deci1),
      ],
      { initializer: "initialize" },
      { kind: "uups" }
    );

    Presale = await ethers.getContractFactory("NFTStakingPresale");
    presale = await upgrades.deployProxy(
      Presale,
      [
        [
          rigel.address,
          sirius.address,
          vega.address,
          fakeBusd.address,
          addr[5].address,
          astroCon.address,
        ],
        [
          ethers.BigNumber.from(450).mul(deci1),
          ethers.BigNumber.from(2500).mul(deci1),
          ethers.BigNumber.from(5000).mul(deci1),
        ],
        [50, 50, 50],
        [
          ethers.utils.parseEther("50"),
          ethers.utils.parseEther("500"),
          ethers.utils.parseEther("500"),
        ],
        [rigelURI, siriusURI, vegaURI],
        ".json",
        true,
        "2398746293847239874",
      ],
      { initializer: "initialize" },
      { kind: "uups" }
    );

    presale.setDiscountOnPresale([
      ethers.BigNumber.from(50).mul(deci1),
      ethers.BigNumber.from(500).mul(deci1),
      ethers.BigNumber.from(500).mul(deci1),
    ]);
    presale.setReferralLinks([
      firstReferral,
      secondReferral,
      thirdReferral,
      invalidReferral,
      fourthReferral,
    ]);
    astro.setReferrals([
      firstReferral,
      secondReferral,
      thirdReferral,
      invalidReferral,
      fourthReferral,
    ]);

    const minterRole = rigel.MINTER_ROLE();
    const minterRole1 = astroCon.MINTER_ROLE();
    await rigel.grantRole(minterRole, presale.address);
    await sirius.grantRole(minterRole, presale.address);
    await vega.grantRole(minterRole, presale.address);

    await astroCon.grantRole(minterRole1, astro.address);

    await fakeBusd.approve(presale.address, ethers.constants.MaxInt256);
    await fakeBusd.approve(astro.address, ethers.constants.MaxInt256);

    // await nft.setApprovalForAll(presale.address, true);
    // await nft.setApprovalForAll(astro.address, true);

    await fakeBusd.transfer(addr[1].address, ethers.utils.parseEther("20000"));

    await fakeBusd
      .connect(addr[1])
      .approve(presale.address, ethers.constants.MaxInt256);
    await fakeBusd
      .connect(addr[1])
      .approve(astro.address, ethers.constants.MaxInt256);

    await fakeBusd.transfer(addr[2].address, ethers.utils.parseEther("20000"));

    await fakeBusd
      .connect(addr[2])
      .approve(presale.address, ethers.constants.MaxInt256);
    await fakeBusd
      .connect(addr[2])
      .approve(astro.address, ethers.constants.MaxInt256);
  });

  describe("Informative function", async function () {
    it("Contract should show the right Astrolist contract's address", async function () {
      expect((await presale.getAllAddresses())[0]).to.be.equal(
        astroCon.address
      );
    });

    it("Contract should show the right Rigel NFT contract's address", async function () {
      expect((await presale.getAllAddresses())[1]).to.be.equal(rigel.address);
    });

    it("Contract should show the right Sirius NFT contract's address", async function () {
      expect((await presale.getAllAddresses())[2]).to.be.equal(sirius.address);
    });

    it("Contract should show the right Vega NFT contract's address", async function () {
      expect((await presale.getAllAddresses())[3]).to.be.equal(vega.address);
    });

    it("Contract should show the right USDT  contract's address", async function () {
      expect((await presale.getAllAddresses())[4]).to.be.equal(
        fakeBusd.address
      );
    });

    it("Contract should show the right collector's address", async function () {
      expect((await presale.getAllAddresses())[5]).to.be.equal(addr[5].address);
    });

    it("Contract should show is Astrolist NFT is require for buying the star NFT or not", async function () {
      expect(await presale.getIsAstroNFTNeccesary()).to.be.equal(true);
    });

    it("Contract should show Total NFT to sold", async function () {
      expect((await presale.getTotalNFTs())[0]).to.be.equal(50);
      expect((await presale.getTotalNFTs())[1]).to.be.equal(50);
      expect((await presale.getTotalNFTs())[2]).to.be.equal(50);
    });

    it("Contact should show how any NFT's are sold", async function () {
      await astro.buyNft(1, firstReferral);

      await presale.batchCreateNFTs(0, 2, frstReferral);
      await presale.batchCreateNFTs(1, 3, frstReferral);
      await presale.batchCreateNFTs(2, 4, frstReferral);

      expect((await presale.getAllNFTSold())[0]).to.be.equal(2);
      expect((await presale.getAllNFTSold())[1]).to.be.equal(3);
      expect((await presale.getAllNFTSold())[2]).to.be.equal(4);
    });

    it("Contract should be able to show the discount", async function () {
      expect((await presale.getDiscountPriceOfNFTs())[0]).to.be.equal(
        ethers.utils.parseEther("50")
      );
      expect((await presale.getDiscountPriceOfNFTs())[1]).to.be.equal(
        ethers.utils.parseEther("500")
      );
      expect((await presale.getDiscountPriceOfNFTs())[2]).to.be.equal(
        ethers.utils.parseEther("500")
      );
    });

    it("Contract should show the right Base URI of the contract", async function () {
      expect((await presale.getBaseURIs())[0]).to.be.equal(rigelURI);
      expect((await presale.getBaseURIs())[1]).to.be.equal(siriusURI);
      expect((await presale.getBaseURIs())[2]).to.be.equal(vegaURI);
    });

    it("Contract should show the right suffix", async function () {
      expect(await presale.getSuffix()).to.be.equal(".json");
    });

    it("Contract should show the right price of NFT", async function () {
      expect((await presale.getPriceOfNFTs())[0]).to.be.equal(
        ethers.utils.parseEther("450")
      );
      expect((await presale.getPriceOfNFTs())[1]).to.be.equal(
        ethers.utils.parseEther("2500")
      );
      expect((await presale.getPriceOfNFTs())[2]).to.be.equal(
        ethers.utils.parseEther("5000")
      );
    });

    it("Contract should show the right stored referral", async function () {
      expect((await presale.getAllReferralLinks())[0]).to.be.equal(
        firstReferral
      );
      expect((await presale.getAllReferralLinks())[1]).to.be.equal(
        secondReferral
      );
      expect((await presale.getAllReferralLinks())[2]).to.be.equal(
        thirdReferral
      );
    });

    it("Contract should be able show wether any address has Astrolist NFT or not", async function () {
      await astro.buyNft(1, firstReferral);
      expect(await presale.isEligible(owner.address)).to.be.equal(true);
      expect(await presale.isEligible(addr[0].address)).to.be.equal(false);
    });

    it("Contract should show any referral link is valid", async function () {
      expect(await presale.isValidReferral(firstReferral)).to.be.equal(true);
    });
  });

  describe("single Buy related function", function () {
    it("User should be able to buy all three nft if he has astrolist", async function () {
      await astro.buyNft(1, firstReferral);
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await astro.connect(addr[2]).buyNft(3, thirdReferral);
      await presale.createNFT(0, firstReferral);
      await presale.createNFT(1, firstReferral);
      await presale.createNFT(2, firstReferral);
      await presale.connect(addr[1]).createNFT(0, firstReferral);
      await presale.connect(addr[1]).createNFT(1, firstReferral);
      await presale.connect(addr[1]).createNFT(2, firstReferral);
      await presale.connect(addr[2]).createNFT(0, secondReferral);
      await presale.connect(addr[2]).createNFT(1, secondReferral);
      await presale.connect(addr[2]).createNFT(2, secondReferral);
      expect(await presale.getNFTSold(0)).to.be.equal(3);
      expect(await presale.getNFTTotal(0)).to.be.equal(50);
      expect(await presale.getNFTSold(1)).to.be.equal(3);
      expect(await presale.getNFTTotal(1)).to.be.equal(50);
      expect(await presale.getNFTSold(2)).to.be.equal(3);
      expect(await presale.getNFTTotal(2)).to.be.equal(50);
      expect(await presale.getNFTRemaining(0)).to.be.equal(47);
      expect(await presale.getNFTRemaining(1)).to.be.equal(47);
      expect(await presale.getNFTRemaining(2)).to.be.equal(47);
    });

    it("User should be able to buy all three nft at discounted price", async function () {
      const deci = ethers.BigNumber.from(10).pow(18);
      await astro.buyNft(1, firstReferral);
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await astro.connect(addr[2]).buyNft(3, thirdReferral);
      await presale.connect(addr[1]).createNFT(0, firstReferral);
      await presale.connect(addr[1]).createNFT(1, firstReferral);
      await presale.connect(addr[1]).createNFT(2, firstReferral);
      await presale.connect(addr[2]).createNFT(0, secondReferral);
      await presale.connect(addr[2]).createNFT(1, secondReferral);
      await presale.connect(addr[2]).createNFT(2, secondReferral);
      expect(await presale.getNFTSold(0)).to.be.equal(2);
      expect(await presale.getNFTTotal(0)).to.be.equal(50);
      expect(await presale.getNFTSold(1)).to.be.equal(2);
      expect(await presale.getNFTTotal(1)).to.be.equal(50);
      expect(await presale.getNFTSold(2)).to.be.equal(2);
      expect(await presale.getNFTTotal(2)).to.be.equal(50);
      expect(await presale.getNFTRemaining(0)).to.be.equal(48);
      expect(await presale.getNFTRemaining(1)).to.be.equal(48);
      expect(await presale.getNFTRemaining(2)).to.be.equal(48);
      expect(await fakeBusd.balanceOf(addr[1].address)).to.equal(
        ethers.BigNumber.from(13050).mul(deci)
      );
      expect(await fakeBusd.balanceOf(addr[2].address)).to.equal(
        ethers.BigNumber.from(13050).mul(deci)
      );
      expect(await fakeBusd.balanceOf(addr[5].address)).to.equal(
        ethers.BigNumber.from(13800).mul(deci)
      );
      expect(await fakeBusd.balanceOf(addr[6].address)).to.equal(
        ethers.BigNumber.from(150).mul(deci)
      );
    });

    it("collector address should be changed", async function () {
      const deci = ethers.BigNumber.from(10).pow(18);
      await astro.buyNft(1, firstReferral);
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await astro.connect(addr[2]).buyNft(3, thirdReferral);
      await presale.changeCollectorAdd(addr[4].address);
      await presale.connect(addr[1]).createNFT(0, firstReferral);
      await presale.connect(addr[1]).createNFT(1, firstReferral);
      await presale.connect(addr[1]).createNFT(2, firstReferral);
      await presale.connect(addr[2]).createNFT(0, secondReferral);
      await presale.connect(addr[2]).createNFT(1, secondReferral);
      await presale.connect(addr[2]).createNFT(2, secondReferral);
      expect(await presale.getNFTSold(0)).to.be.equal(2);
      expect(await presale.getNFTTotal(0)).to.be.equal(50);
      expect(await presale.getNFTSold(1)).to.be.equal(2);
      expect(await presale.getNFTTotal(1)).to.be.equal(50);
      expect(await presale.getNFTSold(2)).to.be.equal(2);
      expect(await presale.getNFTTotal(2)).to.be.equal(50);
      expect(await presale.getNFTRemaining(0)).to.be.equal(48);
      expect(await presale.getNFTRemaining(1)).to.be.equal(48);
      expect(await presale.getNFTRemaining(2)).to.be.equal(48);
      expect(await fakeBusd.balanceOf(addr[1].address)).to.equal(
        ethers.BigNumber.from(13050).mul(deci)
      );
      expect(await fakeBusd.balanceOf(addr[2].address)).to.equal(
        ethers.BigNumber.from(13050).mul(deci)
      );
      expect(await fakeBusd.balanceOf(addr[4].address)).to.equal(
        ethers.BigNumber.from(13800).mul(deci)
      );
      expect(await fakeBusd.balanceOf(addr[6].address)).to.equal(
        ethers.BigNumber.from(150).mul(deci)
      );
    });

    it("should fail when other than owner is changing the address", async function () {
      await expect(
        presale.connect(addr[1]).changeCollectorAdd(addr[4].address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("it should not increase counter when invalid refferal id entered", async function () {
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await presale.connect(addr[1]).createNFT(0, frstReferral);
      expect(await presale.getNFTSold(0)).to.be.equal(1);
      expect(await presale.getNFTTotal(0)).to.be.equal(50);
      expect(await presale.getNFTSold(1)).to.be.equal(0);
      expect(await presale.getNFTTotal(1)).to.be.equal(50);
      expect(await presale.getNFTSold(2)).to.be.equal(0);
      expect(await presale.getNFTTotal(2)).to.be.equal(50);
      expect(await presale.getNFTRemaining(0)).to.be.equal(49);
      expect(await presale.getNFTRemaining(1)).to.be.equal(50);
      expect(await presale.getNFTRemaining(2)).to.be.equal(50);
      expect(await presale.getRefLinkTotalPurchaseData(firstReferral)).to.equal(
        0
      );
      expect(
        await presale.getRefLinkTotalPurchaseData(secondReferral)
      ).to.equal(0);
      expect(await presale.getRefLinkTotalPurchaseData(thirdReferral)).to.equal(
        0
      );
      expect(
        await presale.getRefLinkTotalPurchaseData(invalidReferral)
      ).to.equal(0);
      expect(
        await presale.getRefLinkTotalPurchaseData(fourthReferral)
      ).to.equal(0);
    });

    it("it should fail when user does not has astrolist", async function () {
      await expect(
        presale.connect(addr[1]).createNFT(0, firstReferral)
      ).to.be.revertedWith("Can't buy nft without Astro DNFT");
    });

    it("should show the right no of buyers for links", async function () {
      await astro.buyNft(1, firstReferral);
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await presale.createNFT(0, firstReferral);
      await presale.createNFT(1, firstReferral);
      await presale.createNFT(2, firstReferral);

      await presale.connect(addr[1]).createNFT(0, firstReferral);
      expect(
        await presale.getRefLinkPurchaseDataOfRigel(firstReferral)
      ).to.equal(2);

      expect(
        await presale.getRefLinkPurchaseDataOfSirius(firstReferral)
      ).to.equal(1);

      expect(
        await presale.getRefLinkPurchaseDataOfVega(firstReferral)
      ).to.equal(1);
    });

    it("User should be able to buy NFT is he didn't have any Astrolist NFT is admin alowed it", async function () {
      await presale.changeAstroRestriction(false);

      await presale.createNFT(0, firstReferral);
      await presale.createNFT(1, firstReferral);
      await presale.createNFT(2, firstReferral);

      expect(await rigel.balanceOf(owner.address)).to.be.equal(1);
      expect(await sirius.balanceOf(owner.address)).to.be.equal(1);
      expect(await vega.balanceOf(owner.address)).to.be.equal(1);
    });
  });

  describe("multiple buy related function", async function () {
    it("should be able to buy multile nft", async function () {
      await astro.buyNft(1, firstReferral);
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await astro.connect(addr[2]).buyNft(3, thirdReferral);
      await presale.batchCreateNFTs(0, 2, firstReferral);
      await presale.batchCreateNFTs(1, 4, firstReferral);
      await presale.batchCreateNFTs(2, 3, firstReferral);
      await presale.connect(addr[1]).batchCreateNFTs(0, 2, firstReferral);
      await presale.connect(addr[1]).batchCreateNFTs(1, 3, firstReferral);
      await presale.connect(addr[1]).batchCreateNFTs(2, 2, firstReferral);
      await presale.connect(addr[2]).batchCreateNFTs(0, 2, secondReferral);
      await presale.connect(addr[2]).batchCreateNFTs(1, 3, secondReferral);
      await presale.connect(addr[2]).batchCreateNFTs(2, 2, secondReferral);
      expect(await presale.getNFTSold(0)).to.be.equal(6);
      expect(await presale.getNFTTotal(0)).to.be.equal(50);
      expect(await presale.getNFTSold(1)).to.be.equal(10);
      expect(await presale.getNFTTotal(1)).to.be.equal(50);
      expect(await presale.getNFTSold(2)).to.be.equal(7);
      expect(await presale.getNFTTotal(2)).to.be.equal(50);
      expect(await presale.getNFTRemaining(0)).to.be.equal(44);
      expect(await presale.getNFTRemaining(1)).to.be.equal(40);
      expect(await presale.getNFTRemaining(2)).to.be.equal(43);
      expect(await presale.getRefLinkTotalPurchaseData(firstReferral)).to.equal(
        16
      );
      expect(
        await presale.getRefLinkTotalPurchaseData(secondReferral)
      ).to.equal(7);
    });

    it("should fail when all nft sold", async function () {
      await fakeBusd.transfer(
        addr[1].address,
        ethers.utils.parseEther("20000")
      );
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await astro.connect(addr[2]).buyNft(3, thirdReferral);
      await presale.connect(addr[1]).batchCreateNFTs(0, 50, firstReferral);
      await expect(
        presale.connect(addr[2]).batchCreateNFTs(0, 4, firstReferral)
      ).to.be.revertedWith("All NFT sold");
      await expect(
        presale.connect(addr[2]).createNFT(0, firstReferral)
      ).to.be.revertedWith("All NFT sold");
      expect(await presale.getNFTSold(0)).to.be.equal(50);
      expect(await presale.getNFTTotal(0)).to.be.equal(50);
      expect(await presale.getNFTRemaining(0)).to.be.equal(0);
      expect(await presale.getRefLinkTotalPurchaseData(firstReferral)).to.equal(
        50
      );
    });

    it("should fail when balance is not sufficient", async function () {
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await astro.connect(addr[2]).buyNft(3, thirdReferral);
      await expect(
        presale.connect(addr[1]).batchCreateNFTs(0, 50, firstReferral)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should be able to buy multile nft at discounted price", async function () {
      const deci = ethers.BigNumber.from(10).pow(18);
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await astro.connect(addr[2]).buyNft(3, thirdReferral);
      await presale.connect(addr[1]).batchCreateNFTs(0, 2, firstReferral);
      await presale.connect(addr[1]).batchCreateNFTs(1, 3, firstReferral);
      await presale.connect(addr[1]).batchCreateNFTs(2, 2, firstReferral);
      await presale.connect(addr[2]).batchCreateNFTs(0, 3, secondReferral);
      await presale.connect(addr[2]).batchCreateNFTs(1, 3, secondReferral);
      await presale.connect(addr[2]).batchCreateNFTs(2, 2, secondReferral);
      expect(await presale.getNFTSold(0)).to.be.equal(5);
      expect(await presale.getNFTTotal(0)).to.be.equal(50);
      expect(await presale.getNFTSold(1)).to.be.equal(6);
      expect(await presale.getNFTTotal(1)).to.be.equal(50);
      expect(await presale.getNFTSold(2)).to.be.equal(4);
      expect(await presale.getNFTTotal(2)).to.be.equal(50);
      expect(await presale.getNFTRemaining(0)).to.be.equal(45);
      expect(await presale.getNFTRemaining(1)).to.be.equal(44);
      expect(await presale.getNFTRemaining(2)).to.be.equal(46);
      expect(await presale.getRefLinkTotalPurchaseData(firstReferral)).to.equal(
        7
      );
      expect(
        await presale.getRefLinkTotalPurchaseData(secondReferral)
      ).to.equal(8);
      expect(await fakeBusd.balanceOf(addr[1].address)).to.equal(
        ethers.BigNumber.from(4150).mul(deci)
      );
      expect(await fakeBusd.balanceOf(addr[2].address)).to.equal(
        ethers.BigNumber.from(3750).mul(deci)
      );
      expect(await fakeBusd.balanceOf(addr[5].address)).to.equal(
        ethers.BigNumber.from(32000).mul(deci)
      );
      expect(await fakeBusd.balanceOf(addr[6].address)).to.equal(
        ethers.BigNumber.from(100).mul(deci)
      );
    });

    it("it should fail when user does not has astrolist", async function () {
      await expect(
        presale.connect(addr[1]).batchCreateNFTs(0, 2, firstReferral)
      ).to.be.revertedWith("Can't buy nft without Astro DNFT");
    });

    it("it should not increase counter when invalid refferal id entered", async function () {
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await presale.connect(addr[1]).batchCreateNFTs(0, 2, frstReferral);
      expect(await presale.getNFTSold(0)).to.be.equal(2);
      expect(await presale.getNFTTotal(0)).to.be.equal(50);
      expect(await presale.getNFTSold(1)).to.be.equal(0);
      expect(await presale.getNFTTotal(1)).to.be.equal(50);
      expect(await presale.getNFTSold(2)).to.be.equal(0);
      expect(await presale.getNFTTotal(2)).to.be.equal(50);
      expect(await presale.getNFTRemaining(0)).to.be.equal(48);
      expect(await presale.getNFTRemaining(1)).to.be.equal(50);
      expect(await presale.getNFTRemaining(2)).to.be.equal(50);
      expect(await presale.getRefLinkTotalPurchaseData(firstReferral)).to.equal(
        0
      );
      expect(
        await presale.getRefLinkTotalPurchaseData(secondReferral)
      ).to.equal(0);
      expect(await presale.getRefLinkTotalPurchaseData(thirdReferral)).to.equal(
        0
      );
      expect(
        await presale.getRefLinkTotalPurchaseData(invalidReferral)
      ).to.equal(0);
      expect(
        await presale.getRefLinkTotalPurchaseData(fourthReferral)
      ).to.equal(0);
    });

    it("User should be able to buy the nft if he does not have Astrolist NFT if Admin allowed it", async function () {
      await presale.changeAstroRestriction(false);

      await presale.batchCreateNFTs(0, 2, firstReferral);
      await presale.batchCreateNFTs(1, 2, firstReferral);
      await presale.batchCreateNFTs(2, 2, firstReferral);

      expect(await rigel.balanceOf(owner.address)).to.be.equal(2);
      expect(await sirius.balanceOf(owner.address)).to.be.equal(2);
      expect(await vega.balanceOf(owner.address)).to.be.equal(2);
    });
  });

  describe("link purchase counter function", function () {
    it("total number of purchase for each link should show correctly", async function () {
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await astro.connect(addr[2]).buyNft(3, thirdReferral);
      await expect(
        presale.batchCreateNFTs(0, 2, firstReferral)
      ).to.be.revertedWith("Can't buy nft without Astro DNFT");
      await expect(
        presale.batchCreateNFTs(1, 4, firstReferral)
      ).to.be.revertedWith("Can't buy nft without Astro DNFT");
      await expect(
        presale.batchCreateNFTs(2, 3, firstReferral)
      ).to.be.revertedWith("Can't buy nft without Astro DNFT");
      await presale.connect(addr[1]).batchCreateNFTs(0, 2, firstReferral);
      await presale.connect(addr[1]).batchCreateNFTs(1, 3, firstReferral);
      await presale.connect(addr[1]).batchCreateNFTs(2, 2, firstReferral);
      await presale.connect(addr[2]).batchCreateNFTs(0, 2, secondReferral);
      await presale.connect(addr[2]).batchCreateNFTs(1, 3, secondReferral);
      await presale.connect(addr[2]).batchCreateNFTs(2, 2, secondReferral);
      expect(await presale.getNFTSold(0)).to.be.equal(4);
      expect(await presale.getNFTTotal(0)).to.be.equal(50);
      expect(await presale.getNFTSold(1)).to.be.equal(6);
      expect(await presale.getNFTTotal(1)).to.be.equal(50);
      expect(await presale.getNFTSold(2)).to.be.equal(4);
      expect(await presale.getNFTTotal(2)).to.be.equal(50);
      expect(await presale.getNFTRemaining(0)).to.be.equal(46);
      expect(await presale.getNFTRemaining(1)).to.be.equal(44);
      expect(await presale.getNFTRemaining(2)).to.be.equal(46);
      expect(await presale.getRefLinkTotalPurchaseData(firstReferral)).to.equal(
        7
      );
      expect(
        await presale.getRefLinkTotalPurchaseData(secondReferral)
      ).to.equal(7);
    });

    it("should show the right no of buyers for links", async function () {
      await astro.buyNft(1, firstReferral);
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await astro.connect(addr[2]).buyNft(3, thirdReferral);
      await presale.createNFT(0, firstReferral);
      await presale.createNFT(1, firstReferral);
      await presale.createNFT(2, firstReferral);
      await presale.connect(addr[1]).createNFT(0, firstReferral);
      await presale.connect(addr[1]).createNFT(1, firstReferral);
      await presale.connect(addr[1]).createNFT(2, firstReferral);
      await presale.connect(addr[2]).createNFT(0, secondReferral);
      await presale.connect(addr[2]).createNFT(1, secondReferral);
      await presale.connect(addr[2]).createNFT(2, secondReferral);

      expect(await presale.getRefLinkTotalPurchaseData(firstReferral)).to.equal(
        6
      );
      expect(
        await presale.getRefLinkTotalPurchaseData(secondReferral)
      ).to.equal(3);
    });
  });

  describe("change discount function", function () {
    it("should be able to change the discount", async function () {
      const deci = ethers.BigNumber.from(10).pow(18);
      await presale.setDiscountOnPresale([
        ethers.BigNumber.from(100).mul(deci),
        ethers.BigNumber.from(1000).mul(deci),
        ethers.BigNumber.from(1000).mul(deci),
      ]);
      await astro.buyNft(1, firstReferral);
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await astro.connect(addr[2]).buyNft(3, thirdReferral);
      await presale.createNFT(0, firstReferral);
      await presale.createNFT(1, firstReferral);
      await presale.createNFT(2, firstReferral);
      await presale.connect(addr[1]).createNFT(0, firstReferral);
      await presale.connect(addr[1]).createNFT(1, firstReferral);
      await presale.connect(addr[1]).createNFT(2, firstReferral);
      await presale.connect(addr[2]).createNFT(0, secondReferral);
      await presale.connect(addr[2]).createNFT(1, secondReferral);
      await presale.connect(addr[2]).createNFT(2, secondReferral);
      expect(await fakeBusd.balanceOf(addr[1].address)).to.equal(
        ethers.BigNumber.from(14100).mul(deci)
      );
      expect(await fakeBusd.balanceOf(addr[2].address)).to.equal(
        ethers.BigNumber.from(14100).mul(deci)
      );
    });

    it("should fail when other than owner change the discount", async function () {
      const deci = ethers.BigNumber.from(10).pow(18);
      await expect(
        presale
          .connect(addr[1])
          .setDiscountOnPresale([
            ethers.BigNumber.from(100).mul(deci),
            ethers.BigNumber.from(1000).mul(deci),
            ethers.BigNumber.from(1000).mul(deci),
          ])
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("change quantity function", function () {
    it("should be able to change nft quantity in presale", async function () {
      await presale.setNFTPresaleQuant([70, 45, 30]);
      await astro.buyNft(1, firstReferral);
      await astro.connect(addr[1]).buyNft(2, secondReferral);
      await astro.connect(addr[2]).buyNft(3, thirdReferral);
      await presale.createNFT(0, firstReferral);
      await presale.createNFT(1, firstReferral);
      await presale.createNFT(2, firstReferral);
      await presale.connect(addr[1]).createNFT(0, firstReferral);
      await presale.connect(addr[1]).createNFT(1, firstReferral);
      await presale.connect(addr[1]).createNFT(2, firstReferral);
      await presale.connect(addr[2]).createNFT(0, secondReferral);
      await presale.connect(addr[2]).createNFT(1, secondReferral);
      await presale.connect(addr[2]).createNFT(2, secondReferral);
      expect(await presale.getNFTSold(0)).to.be.equal(3);
      expect(await presale.getNFTTotal(0)).to.be.equal(70);
      expect(await presale.getNFTSold(1)).to.be.equal(3);
      expect(await presale.getNFTTotal(1)).to.be.equal(45);
      expect(await presale.getNFTSold(2)).to.be.equal(3);
      expect(await presale.getNFTTotal(2)).to.be.equal(30);
      expect(await presale.getNFTRemaining(0)).to.be.equal(67);
      expect(await presale.getNFTRemaining(1)).to.be.equal(42);
      expect(await presale.getNFTRemaining(2)).to.be.equal(27);
    });

    it("should fail when other than owner change the discount", async function () {
      await expect(
        presale.connect(addr[1]).setNFTPresaleQuant([70, 45, 30])
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Upgrade role should upgrade the contract", async function () {
      nftNftV2 = await upgrades.upgradeProxy(presale, Presale);
    });

    it("Only upgradeable role should be upgrade contract", async function () {
      await presale.renounceOwnership();
      await expect(upgrades.upgradeProxy(presale, Presale)).to.be.rejected;
    });
  });

  describe("Admin Related functions", function () {
    it("Only Admin address should be able to change the Astrolist address", async function () {
      await presale.setAstrolistAddress(customAddress);
      expect((await presale.getAllAddresses())[0]).to.be.equal(customAddress);

      await expect(presale.connect(addr[0]).setAstrolistAddress(customAddress))
        .to.be.reverted;
    });

    it("Only Admin address should be able to change the Rigel address", async function () {
      await presale.setRigelAddress(customAddress);
      expect((await presale.getAllAddresses())[1]).to.be.equal(customAddress);
      await expect(presale.connect(addr[0]).setRigelAddress(customAddress)).to
        .be.reverted;
    });

    it("Only Admin address should be able to change the Sirius address", async function () {
      await presale.setSiriusAddress(customAddress);
      expect((await presale.getAllAddresses())[2]).to.be.equal(customAddress);
      await expect(presale.connect(addr[0]).setSiriusAddress(customAddress)).to
        .be.reverted;
    });

    it("Only Admin address should be able to change the Vega address", async function () {
      await presale.setVegaAddress(customAddress);
      expect((await presale.getAllAddresses())[3]).to.be.equal(customAddress);
      await expect(presale.connect(addr[0]).setVegaAddress(customAddress)).to.be
        .reverted;
    });

    it("Only Admin address should be able to change the ERC20 token's address", async function () {
      await presale.setERC20TokenAddress(customAddress);
      expect((await presale.getAllAddresses())[4]).to.be.equal(customAddress);
      await expect(presale.connect(addr[0]).setERC20TokenAddress(customAddress))
        .to.be.reverted;
    });

    it("Only admin address should be able to change the discount", async function () {
      await presale.setPresaleDiscount([
        ethers.utils.parseEther("60"),
        ethers.utils.parseEther("510"),
        ethers.utils.parseEther("510"),
      ]);

      expect((await presale.getDiscountPriceOfNFTs())[0]).to.be.equal(
        ethers.utils.parseEther("60")
      );
      expect((await presale.getDiscountPriceOfNFTs())[1]).to.be.equal(
        ethers.utils.parseEther("510")
      );
      expect((await presale.getDiscountPriceOfNFTs())[2]).to.be.equal(
        ethers.utils.parseEther("510")
      );

      await expect(
        presale
          .connect(addr[0])
          .setPresaleDiscount([
            ethers.utils.parseEther("60"),
            ethers.utils.parseEther("510"),
            ethers.utils.parseEther("510"),
          ])
      ).to.be.reverted;
    });

    it("Only Admin should be able to change the base uri", async function () {
      await presale.setBaseURI([
        "Coustom uri1",
        "Coustom uri2",
        "Coustom uri3",
      ]);
      expect((await presale.getBaseURIs())[0]).to.be.equal("Coustom uri1");
      expect((await presale.getBaseURIs())[1]).to.be.equal("Coustom uri2");
      expect((await presale.getBaseURIs())[2]).to.be.equal("Coustom uri3");
      await expect(
        presale
          .connect(addr[0])
          .setBaseURI(["Coustom uri1", "Coustom uri2", "Coustom uri3"])
      ).to.be.reverted;
    });

    it("Only Admin should be able to change the suffix", async function () {
      await presale.setSuffix("customSuffix");
      expect(await presale.getSuffix()).to.be.equal("customSuffix");
      await expect(presale.connect(addr[0]).setSuffix("customSuffix")).to.be
        .reverted;
    });

    it("Only Admin should be able to change the ristriction of Astrolist", async function () {
      await presale.changeAstroRestriction(false);
      expect(await presale.getIsAstroNFTNeccesary()).to.be.equal(false);
      await expect(presale.connect(addr[0]).changeAstroRestriction(false)).to.be
        .reverted;
    });

    it("Only Admin should be able to change the price to the NFT's", async function () {
      await presale.setBuyPrice([
        ethers.utils.parseEther("510"),
        ethers.utils.parseEther("2600"),
        ethers.utils.parseEther("5100"),
      ]);

      expect((await presale.getPriceOfNFTs())[0]).to.be.equal(
        ethers.utils.parseEther("510")
      );
      expect((await presale.getPriceOfNFTs())[1]).to.be.equal(
        ethers.utils.parseEther("2600")
      );
      expect((await presale.getPriceOfNFTs())[2]).to.be.equal(
        ethers.utils.parseEther("5100")
      );

      await expect(
        presale
          .connect(addr[0])
          .setBuyPrice([
            ethers.utils.parseEther("510"),
            ethers.utils.parseEther("2600"),
            ethers.utils.parseEther("5100"),
          ])
      ).to.be.reverted;
    });

    it("Only Admin should be able to remove all the referral links", async function () {
      await presale.removeAllReferralLinks();
      await expect(presale.connect(addr[0]).removeAllReferralLinks()).to.be
        .reverted;
    });

    it("Only Admin shouldb be able to set Referral links", async function () {
      await expect(presale.connect(addr[0]).setReferralLinks([firstReferral]))
        .to.be.reverted;
    });

    it("Only Admin should be able to remove single Referral links", async function () {
      await presale.removeReferralLink(firstReferral);
      await expect(presale.removeReferralLink(firstReferral)).to.be.reverted;
      await expect(presale.connect(addr[0]).removeReferralLink(firstReferral))
        .to.be.reverted;
    });

    it("Initialize should only be work for one time", async function () {
      await expect(
        presale.initialize(
          [
            rigel.address,
            sirius.address,
            vega.address,
            fakeBusd.address,
            addr[5].address,
            astroCon.address,
          ],
          [
            ethers.BigNumber.from(450).mul(deci1),
            ethers.BigNumber.from(2500).mul(deci1),
            ethers.BigNumber.from(5000).mul(deci1),
          ],
          [50, 50, 50],
          [
            ethers.utils.parseEther("50"),
            ethers.utils.parseEther("500"),
            ethers.utils.parseEther("500"),
          ],
          [rigelURI, siriusURI, vegaURI],
          ".json",
          true,
          "2398746293847239874"
        )
      ).to.be.reverted;
    });
  });
});
