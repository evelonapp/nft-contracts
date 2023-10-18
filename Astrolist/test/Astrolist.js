const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');

const defaultReferral =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
const firstReferral =
  '0x0000000000000000000000000000000000000000000000000000000000000001';
const secondReferral =
  '0x0000000000000000000000000000000000000000000000000000000000000002';
const thirdReferral =
  '0x0000000000000000000000000000000000000000000000000000000000000003';
const invalidReferral =
  '0x0000000000000000000000000000000000000000000000000000000000000004';
const fourthReferral =
  '0x0000000000000000000000000000000000000000000000000000000000000005';

describe('Deployer contract', function () {
  beforeEach(async function () {
    [owner, addr1, addr2, ...addr] = await ethers.getSigners();

    FakeBUSD = await ethers.getContractFactory('TetherToken');
    fakeBUSD = await FakeBUSD.deploy(
      '100000000000000000000000000',
      'abhi',
      'abhi',
      18
    );

    NFT = await ethers.getContractFactory('Astrolists');
    nft = await upgrades.deployProxy(
      NFT,
      [],
      { initializer: 'initialize' },
      { kind: 'uups' }
    );

    AstroSell = await ethers.getContractFactory('AstrolistSell');
    astroSell = await upgrades.deployProxy(
      AstroSell,
      [
        nft.address,
        fakeBUSD.address,
        addr1.address,
        'https://olive-realistic-shrew-608.mypinata.cloud/ipfs/QmZ8M55MKThUD8KQLAguFdjNbi7XFQ7AcGPohngPbGe91D/',
        ethers.utils.parseEther('50'),
      ],
      { initializer: 'initialize' },
      { kind: 'uups' }
    );

    await astroSell.setBaseURI('https://base/');

    await fakeBUSD.approve(astroSell.address, ethers.constants.MaxUint256);
    await nft.grantRole(await nft.MINTER_ROLE(), astroSell.address);
    await astroSell.setReferrals([
      firstReferral,
      secondReferral,
      thirdReferral,
    ]);
  });

  describe('Informative functions', function () {
    it('Should show given address is whitelisted or not ', async function () {
      await astroSell.whiteListAddresses([owner.address]);
      expect(await astroSell.isWhiteListed(owner.address)).to.equal(true);
    });

    it('should show all the whitelisted addresses', async function () {
      await astroSell.whiteListAddresses([
        owner.address,
        addr1.address,
        addr2.address,
      ]);

      const addresses = await astroSell.getWhitelistedAddresses();

      expect(addresses[0]).to.be.equal(owner.address);
      expect(addresses[1]).to.be.equal(addr1.address);
      expect(addresses[2]).to.be.equal(addr2.address);
    });

    it('Should show given address is eligibel to buy or claim the NFT', async function () {
      await astroSell.buyNft(1, firstReferral);
      expect(await astroSell.isNotEligible(owner.address)).to.be.equal(true);
    });

    it('Should show if the token id is taken or not', async function () {
      await astroSell.buyNft(1, firstReferral);
      expect(await astroSell.isIdTaken(1)).to.be.equal(true);
    });

    it('should show right collector address', async function () {
      expect(await astroSell.getCollectorAddress()).to.be.equal(addr1.address);
    });

    it('should show right NFT contract address', async function () {
      expect(await astroSell.getNFTAddress()).to.be.equal(nft.address);
    });

    it('should show right ERC20 contract address', async function () {
      expect(await astroSell.getERC20Address()).to.be.equal(fakeBUSD.address);
    });

    it('should show right price for the NFT', async function () {
      expect(await astroSell.getPrice()).to.be.equal(
        ethers.utils.parseEther('50')
      );
    });

    it('should show right base URI', async function () {
      expect(await astroSell.getBaseUri()).to.be.equal('https://base/');
    });

    it('Should show all the unSold NFT', async function () {
      await astroSell.buyNft(1, firstReferral);
      const nfts = await astroSell.getNfts();

      expect(nfts[0].uri).to.be.equal('https://base/2');
      expect(nfts[1].uri).to.be.equal('https://base/3');
      expect(nfts[498].uri).to.be.equal('https://base/500');
    });

    it('Should show any referral is valid referral or not', async function () {
      expect(await astroSell.isValidReferralId(firstReferral)).to.be.equal(
        true
      );
      expect(await astroSell.isValidReferralId(invalidReferral)).to.be.equal(
        false
      );
    });

    it('Should show how many user are buy/claim by the referral', async function () {
      await astroSell.whiteListAddresses([addr1.address, addr2.address]);
      await fakeBUSD.transfer(addr[0].address, ethers.utils.parseEther('50'));
      await fakeBUSD
        .connect(addr[0])
        .approve(astroSell.address, ethers.utils.parseEther('50'));
      await astroSell.buyNft(1, firstReferral);
      await astroSell.connect(addr1).claimReward(firstReferral);
      await astroSell.connect(addr[0]).buyNft(3, firstReferral);
      await astroSell.connect(addr2).claimReward(firstReferral);

      expect((await astroSell.getReferralData(firstReferral))[0]).to.be.equal(
        2
      );

      expect((await astroSell.getReferralData(firstReferral))[1]).to.be.equal(
        2
      );

      expect(
        (await astroSell.getReferralData(firstReferral))[2][0]
      ).to.be.equal(owner.address);

      expect(
        (await astroSell.getReferralData(firstReferral))[2][1]
      ).to.be.equal(addr[0].address);

      expect(
        (await astroSell.getReferralData(firstReferral))[3][0]
      ).to.be.equal(addr1.address);

      expect(
        (await astroSell.getReferralData(firstReferral))[3][1]
      ).to.be.equal(addr2.address);
    });

    it('Should be able to show all the saved referrals', async function () {
      expect((await astroSell.getAllReferrals())[0]).to.be.equal(firstReferral);
      expect((await astroSell.getAllReferrals())[1]).to.be.equal(
        secondReferral
      );
      expect((await astroSell.getAllReferrals())[2]).to.be.equal(thirdReferral);
    });

    it('Should be able to show all the default referral data', async function () {
      await astroSell.whiteListAddresses([addr1.address, addr2.address]);
      await fakeBUSD.transfer(addr[0].address, ethers.utils.parseEther('50'));
      await fakeBUSD
        .connect(addr[0])
        .approve(astroSell.address, ethers.utils.parseEther('50'));
      await astroSell.buyNft(1, defaultReferral);
      await astroSell.connect(addr1).claimReward(defaultReferral);
      await astroSell.connect(addr[0]).buyNft(3, defaultReferral);
      await astroSell.connect(addr2).claimReward(defaultReferral);

      expect((await astroSell.getReferralData(defaultReferral))[0]).to.be.equal(
        2
      );

      expect((await astroSell.getReferralData(defaultReferral))[1]).to.be.equal(
        2
      );

      expect(
        (await astroSell.getReferralData(defaultReferral))[2][0]
      ).to.be.equal(owner.address);

      expect(
        (await astroSell.getReferralData(defaultReferral))[2][1]
      ).to.be.equal(addr[0].address);

      expect(
        (await astroSell.getReferralData(defaultReferral))[3][0]
      ).to.be.equal(addr1.address);

      expect(
        (await astroSell.getReferralData(defaultReferral))[3][1]
      ).to.be.equal(addr2.address);
    });
  });

  describe('Claiming related functions', function () {
    it('Whitelisted address should claim his NFT', async function () {
      await astroSell.whiteListAddresses([owner.address]);
      await astroSell.claimReward(firstReferral);
      expect(await nft.ownerOf(1)).to.be.equal(owner.address);
    });

    it('Whitelisted address should only be able to claim his NFT with right referral', async function () {
      await astroSell.whiteListAddresses([owner.address]);
      await expect(astroSell.claimReward(invalidReferral)).to.be.revertedWith(
        'Referral is invalid'
      );
    });

    it('Only unSold nft should be available for whitelisted address', async function () {
      await fakeBUSD.transfer(addr1.address, ethers.utils.parseEther('50'));
      await fakeBUSD
        .connect(addr1)
        .approve(astroSell.address, ethers.utils.parseEther('50'));
      await astroSell.whiteListAddresses([owner.address]);

      await astroSell.connect(addr1).buyNft(1, firstReferral);
      await astroSell.claimReward(firstReferral);
      expect(await nft.ownerOf(2)).to.be.equal(owner.address);
    });

    it('Only whitelisted address should be able to claim NFT', async function () {
      await expect(astroSell.claimReward(firstReferral)).to.be.revertedWith(
        'Address is not WhiteListed'
      );
    });

    it('One address should be able to claim only one nft', async function () {
      await astroSell.buyNft(1, firstReferral);
      await astroSell.whiteListAddresses([owner.address]);
      await expect(astroSell.claimReward(firstReferral)).to.be.rejectedWith(
        'You are not eligible'
      );
    });

    it('Whitelisted address should be able to choose NFT to claim', async function () {
      await astroSell.whiteListAddresses([owner.address]);
      await astroSell.claimRewardByTokenId(1, firstReferral);
      expect(await nft.ownerOf(1)).to.be.equal(owner.address);
    });

    it('Whitelisted address should only be able to choose NFT to claim if he have right referral', async function () {
      await astroSell.whiteListAddresses([owner.address]);
      await expect(
        astroSell.claimRewardByTokenId(1, invalidReferral)
      ).to.be.revertedWith('Referral is invalid');
    });

    it('Whitelisted address sholuld not be able to choose sold NFT', async function () {
      await astroSell.whiteListAddresses([owner.address]);
      await astroSell.whiteListAddresses([addr1.address]);

      await astroSell.claimRewardByTokenId(1, firstReferral);
      expect(await nft.ownerOf(1)).to.be.equal(owner.address);

      await expect(
        astroSell.connect(addr1).claimRewardByTokenId(1, firstReferral)
      ).to.be.revertedWith('TokenId is already taken');
    });
  });

  describe('Buying related functions', function () {
    it('User should buy the NFT by the paying ERC20 token', async function () {
      await astroSell.buyNft(1, firstReferral);
      expect(await nft.ownerOf(1)).to.be.equal(owner.address);
    });

    it('User should only be able to buy the NFT if he fill right referral', async function () {
      await expect(astroSell.buyNft(1, invalidReferral)).to.be.revertedWith(
        'Referral is invalid'
      );
    });

    it('User should not be be able to buy sold nft', async function () {
      await astroSell.whiteListAddresses([addr1.address]);
      await astroSell.connect(addr1).claimRewardByTokenId(1, firstReferral);

      await expect(astroSell.buyNft(1, firstReferral)).to.be.revertedWith(
        'Token Id is already taken'
      );
    });

    it('User should not be able to buy more than one nft', async function () {
      await astroSell.buyNft(1, firstReferral);
      await expect(astroSell.buyNft(2, firstReferral)).to.be.revertedWith(
        'You are not eligible'
      );
    });
  });

  describe('Admin functions', function () {
    it('Only admin should whitelist addresses', async function () {
      await astroSell.whiteListAddresses([
        owner.address,
        addr1.address,
        addr2.address,
      ]);
      expect(await astroSell.isWhiteListed(owner.address)).to.be.equal(true);
      expect(await astroSell.isWhiteListed(addr1.address)).to.be.equal(true);
      expect(await astroSell.isWhiteListed(addr2.address)).to.be.equal(true);

      await expect(astroSell.connect(addr1).whiteListAddresses([owner.address]))
        .to.be.reverted;

      await astroSell.whiteListAddresses([owner.address]);
    });

    it('Only admin should remove whitelist addresses', async function () {
      await astroSell.whiteListAddresses([
        owner.address,
        addr1.address,
        addr2.address,
      ]);
      await astroSell.removeWhiteListedAddresses([addr1.address]);

      const addresses = await astroSell.getWhitelistedAddresses();

      expect(addresses[0]).to.be.equal(owner.address);
      expect(addresses[1]).to.be.equal(addr2.address);

      await expect(
        astroSell.connect(addr1).removeWhiteListedAddresses([addr2.address])
      ).to.be.reverted;

      await astroSell.removeWhiteListedAddresses([addr1.address]);
    });

    it('Only admin should make any address eligible or remove authority to buy of any addresses', async function () {
      await astroSell.makeAddressesEligibleOrRemoveIt([owner.address], true);
      expect(await astroSell.isNotEligible(owner.address)).to.be.equal(true);
      await expect(
        astroSell
          .connect(addr1)
          .makeAddressesEligibleOrRemoveIt([owner.address], true)
      ).to.be.reverted;
    });

    it('Only admin should change collector address', async function () {
      await astroSell.setCollectorAddress(addr2.address);
      expect(await astroSell.getCollectorAddress()).to.be.equal(addr2.address);

      await expect(astroSell.connect(addr1).setCollectorAddress(addr2.address))
        .to.be.reverted;
    });

    it('Only admin should change NFT contract address', async function () {
      await astroSell.setNFTTokenAddress(addr1.address);
      expect(await astroSell.getNFTAddress()).to.be.equal(addr1.address);
      await expect(astroSell.connect(addr1).setNFTTokenAddress(addr1.address))
        .to.be.reverted;
    });

    it('Only admin should change ERC20 contract address', async function () {
      await astroSell.setERC20TokenAddress(addr1.address);
      expect(await astroSell.getERC20Address()).to.be.equal(addr1.address);
      await expect(astroSell.connect(addr1).setERC20TokenAddress(addr1.address))
        .to.be.reverted;
    });

    it('Only admin should change price for the NFT', async function () {
      await astroSell.setPrice(ethers.utils.parseEther('60'));
      expect(await astroSell.getPrice()).to.be.equal(
        ethers.utils.parseEther('60')
      );
      await expect(
        astroSell.connect(addr1).setPrice(ethers.utils.parseEther('60'))
      ).to.be.reverted;
    });

    it('Only admin should change base URI', async function () {
      await astroSell.setBaseURI('https://base1/');
      expect(await astroSell.getBaseUri()).to.be.equal('https://base1/');
      await expect(astroSell.connect(addr1).setBaseURI('https://base1/')).to.be
        .reverted;
    });

    it('Only admin shoudl change value of any unSold token to sold', async function () {
      await astroSell.setIsIdTaken([1], true);
      expect(await astroSell.isIdTaken(1)).to.be.equal(true);
      await expect(astroSell.connect(addr1).setIsIdTaken([1], true)).to.be
        .reverted;
    });

    it('Only admin should be able to update the contract', async function () {
      astroSellV2 = await upgrades.upgradeProxy(astroSell.address, AstroSell);
      await astroSell.transferOwnership(addr1.address);
      await expect(upgrades.upgradeProxy(astroSell.address, AstroSell)).to.be
        .reverted;
    });

    it('Contract should be initialize only one time', async function () {
      await expect(
        astroSell.initialize(
          nft.address,
          fakeBUSD.address,
          addr1.address,
          'https://base/',
          ethers.utils.parseEther('50')
        )
      ).to.be.reverted;
    });

    it('Admin should be able to mint nft to other address', async function () {
      await astroSell.mintNFT(owner.address, 1);
      expect(await nft.ownerOf(1)).to.be.equal(owner.address);
      await expect(astroSell.mintNFT(owner.address, 1)).to.be.reverted;
    });

    it('Only admin should be able to mint nft to other address', async function () {
      await expect(astroSell.connect(addr1).mintNFT(owner.address, 1)).to.be
        .reverted;
    });

    it('Admin should be able to set referrals', async function () {
      expect(await astroSell.isValidReferralId(fourthReferral)).to.be.equal(
        false
      );
      await astroSell.setReferrals([fourthReferral]);

      expect(await astroSell.isValidReferralId(fourthReferral)).to.be.equal(
        true
      );

      expect((await astroSell.getAllReferrals())[0]).to.be.equal(firstReferral);
      expect((await astroSell.getAllReferrals())[1]).to.be.equal(
        secondReferral
      );
      expect((await astroSell.getAllReferrals())[2]).to.be.equal(thirdReferral);
      expect((await astroSell.getAllReferrals())[3]).to.be.equal(
        fourthReferral
      );
    });

    it('Only admin should be able to set referras', async function () {
      await expect(astroSell.connect(addr1).setReferrals([fourthReferral])).to
        .be.reverted;
    });

    it('Admin should be able to remove the referral', async function () {
      expect(await astroSell.isValidReferralId(secondReferral)).to.be.equal(
        true
      );

      await astroSell.removeReferral(secondReferral);

      expect(await astroSell.isValidReferralId(secondReferral)).to.be.equal(
        false
      );

      expect((await astroSell.getAllReferrals())[0]).to.be.equal(firstReferral);
      expect((await astroSell.getAllReferrals())[1]).to.be.equal(thirdReferral);
    });

    it('Admin should not be able remove referral that is already removed', async function () {
      await expect(astroSell.removeReferral(fourthReferral)).to.be.revertedWith(
        'Referral is already removed'
      );
    });

    it('Only admin should be able to remove the referral', async function () {
      await expect(astroSell.connect(addr1).removeReferral(firstReferral)).to.be
        .reverted;
    });

    it('Admin should be able to set the default referral data', async function () {
      await astroSell.setReferralData(
        1,
        3,
        [owner.address],
        [addr[0].address, addr1.address, addr2.address]
      );

      expect((await astroSell.getReferralData(defaultReferral))[0]).to.be.equal(
        1
      );

      expect((await astroSell.getReferralData(defaultReferral))[1]).to.be.equal(
        3
      );

      expect(
        (await astroSell.getReferralData(defaultReferral))[2][0]
      ).to.be.equal(owner.address);

      expect(
        (await astroSell.getReferralData(defaultReferral))[3][0]
      ).to.be.equal(addr[0].address);

      expect(
        (await astroSell.getReferralData(defaultReferral))[3][1]
      ).to.be.equal(addr1.address);

      expect(
        (await astroSell.getReferralData(defaultReferral))[3][2]
      ).to.be.equal(addr2.address);
    });

    it('Only admin should be able default referral', async function () {
      await expect(
        astroSell
          .connect(addr1)
          .setReferralData(
            1,
            3,
            [owner.address],
            [addr[0].address, addr1.address, addr2.address]
          )
      ).to.be.reverted;
    });
  });
});
