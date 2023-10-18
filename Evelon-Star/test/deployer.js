const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const {
  SimpleERC20,
  SimpleERC20ConstructorArgs,
} = require("./Utils/SimpleERC20BytecodeAndConstructorArgs.json");

const chainId = "1337";
const price = ethers.utils.parseUnits("500", "6");

describe("Deployer contract", function () {
  beforeEach(async function () {
    [owner, collector, ...addr] = await ethers.getSigners();

    FakeBusd = await ethers.getContractFactory("FakeBusd");
    fakeBusd = await FakeBusd.deploy();

    Deployer = await ethers.getContractFactory("CepheusDeployer");
    deployer = await upgrades.deployProxy(
      Deployer,
      [chainId, fakeBusd.address, collector.address, [1], [price]],
      { initializer: "initialize" },
      { kind: "uups" }
    );

    fakeBusd.approve(deployer.address, ethers.constants.MaxUint256);
  });

  describe("Informative function", async function () {
    it("Contract should show right chain ID", async function () {
      expect(await deployer.getChainId()).to.be.equal(1337);
    });

    it("Contract should show right price of the contract", async function () {
      expect((await deployer.getDeploymentPrice(1))[0]).to.be.equal(price);
    });

    it("Contract should show right collector address", async function () {
      expect(await deployer.getCollectorAddress()).to.be.equal(
        collector.address
      );
    });

    it("Contract should show right ERC20 Token address", async function () {
      expect(await deployer.getTokenAddress()).to.be.equal(fakeBusd.address);
    });
  });

  describe("Testing deployment", function () {
    it("Contract shoudl not deploy if lenth of the price is mismatch", async function () {
      await expect(
        upgrades.deployProxy(
          Deployer,
          [chainId, fakeBusd.address, collector.address, [1, 2], [price]],
          { initializer: "initialize" },
          { kind: "uups" }
        )
      ).to.be.reverted;
    });
  });

  describe("Deploy related function", function () {
    async function deploy(
      bytecode,
      constructorArgs,
      deployerAddress,
      contractName,
      contractType,
      amount,
      mintable,
      burnable,
      capped,
      role,
      baseURI
    ) {
      await deployer.deploy(
        bytecode,
        constructorArgs,
        deployerAddress,
        contractName,
        contractType,
        amount,
        mintable,
        burnable,
        capped,
        role,
        baseURI
      );
    }

    it("User should be able to deploy contract with the deployer contract and all data should be right", async function () {
      expect(
        (await deployer.getUserContracts(owner.address))[0].length
      ).to.be.equal(0);
      await deploy(
        SimpleERC20,
        SimpleERC20ConstructorArgs,
        owner.address,
        "SimpleERC20",
        1,
        price,
        false,
        false,
        false,
        false,
        false
      );

      const userData = await deployer.getUserContracts(owner.address);

      expect(
        (await deployer.getUserContracts(owner.address))[0].length
      ).to.be.equal(1);

      expect(userData[0][0].deployer).to.be.equal(owner.address);
      expect(userData[0][0].contractAddress).not.to.be.empty;
      expect(userData[0][0].chainId).to.be.equal(1337);
      expect(userData[0][0].contractIndex).to.be.equal(0);
      expect(userData[0][0].contractName).to.be.equal("SimpleERC20");
      expect(userData[0][0].mintable).to.be.equal(false);
      expect(userData[0][0].burnable).to.be.equal(false);
      expect(userData[0][0].capped).to.be.equal(false);
      expect(userData[0][0].role).to.be.equal(false);
      expect(userData[0][0].baseURI).to.be.equal(false);

      const contractData = await deployer.getContractByUserAndIndex(
        owner.address,
        userData[0][0].contractIndex,
        1,
        [false, false, false, false]
      );

      expect(contractData[1]).to.be.equal("Test Token");
      expect(contractData[2]).to.be.equal("Test");
      expect(contractData[3]).to.be.equal(18);
      expect(contractData[4]).to.be.equal(ethers.utils.parseEther("1000"));
    });

    it("User should not deploy any token if he provide invalid price", async function () {
      await expect(
        deploy(
          SimpleERC20,
          SimpleERC20ConstructorArgs,
          owner.address,
          "SimpleERC20",
          1,
          ethers.utils.parseUnits("400", "6"),
          false,
          false,
          false,
          false,
          false
        )
      ).to.be.revertedWith("Invalid price");
    });

    it("User should be able to transfer his ownership of his deployer contract panel", async function () {
      expect(
        (await deployer.getUserContracts(owner.address))[0].length
      ).to.be.equal(0);
      await deploy(
        SimpleERC20,
        SimpleERC20ConstructorArgs,
        owner.address,
        "SimpleERC20",
        1,
        price,
        false,
        false,
        false,
        false,
        false
      );
      var userData = await deployer.getUserContracts(owner.address);
      expect(
        (await deployer.getUserContracts(owner.address))[0].length
      ).to.be.equal(1);

      const contractAddress = userData[0][0].contractAddress;
      await deployer.transferDeployerOwnership(
        1,
        contractAddress,
        owner.address,
        addr[0].address,
        userData[0][0].contractIndex
      );

      userData = await deployer.getUserContracts(owner.address);

      expect(userData[0].length).to.be.equal(0);

      const newUserData = await deployer.getUserContracts(addr[0].address);

      expect(newUserData[0].length).to.be.equal(1);

      expect(newUserData[0][0].deployer).to.be.equal(addr[0].address);
      expect(newUserData[0][0].contractAddress).to.be.equal(contractAddress);
      expect(newUserData[0][0].chainId).to.be.equal(1337);
      expect(newUserData[0][0].contractIndex).to.be.equal(0);
      expect(newUserData[0][0].contractName).to.be.equal("SimpleERC20");
      expect(newUserData[0][0].mintable).to.be.equal(false);
      expect(newUserData[0][0].burnable).to.be.equal(false);
      expect(newUserData[0][0].capped).to.be.equal(false);
      expect(newUserData[0][0].role).to.be.equal(false);
      expect(newUserData[0][0].baseURI).to.be.equal(false);
    });

    it("Only Owner of the contract should be able to transfer his ownership", async function () {
      await deploy(
        SimpleERC20,
        SimpleERC20ConstructorArgs,
        owner.address,
        "SimpleERC20",
        1,
        price,
        false,
        false,
        false,
        false,
        false
      );

      const contractAddress = (
        await deployer.getUserContracts(owner.address)
      )[0][0].contractAddress;

      await expect(
        deployer
          .connect(addr[0])
          .transferDeployerOwnership(
            1,
            contractAddress,
            owner.address,
            addr[0].address,
            0
          )
      ).to.be.revertedWith("Address is not the owner of contract");
    });

    it("User should be able to transfer one of his contract if he have multiple contracts", async function () {
      await deploy(
        SimpleERC20,
        SimpleERC20ConstructorArgs,
        owner.address,
        "SimpleERC20",
        1,
        price,
        false,
        false,
        false,
        false,
        false
      );

      await deploy(
        SimpleERC20,
        SimpleERC20ConstructorArgs,
        owner.address,
        "SimpleERC20",
        1,
        price,
        false,
        false,
        false,
        false,
        false
      );

      var userData = await deployer.getUserContracts(owner.address);
      expect(
        (await deployer.getUserContracts(owner.address))[0].length
      ).to.be.equal(2);

      const contractAddress = userData[0][0].contractAddress;
      await deployer.transferDeployerOwnership(
        1,
        contractAddress,
        owner.address,
        addr[0].address,
        userData[0][0].contractIndex
      );

      const newUserData = await deployer.getUserContracts(addr[0].address);

      expect(newUserData[0].length).to.be.equal(1);

      expect(newUserData[0][0].deployer).to.be.equal(addr[0].address);
      expect(newUserData[0][0].contractAddress).to.be.equal(contractAddress);
      expect(newUserData[0][0].chainId).to.be.equal(1337);
      expect(newUserData[0][0].contractIndex).to.be.equal(0);
      expect(newUserData[0][0].contractName).to.be.equal("SimpleERC20");
      expect(newUserData[0][0].mintable).to.be.equal(false);
      expect(newUserData[0][0].burnable).to.be.equal(false);
      expect(newUserData[0][0].capped).to.be.equal(false);
      expect(newUserData[0][0].role).to.be.equal(false);
      expect(newUserData[0][0].baseURI).to.be.equal(false);
    });

    it("User should enter right index of the contract address when transfering ownership", async function () {
      await deploy(
        SimpleERC20,
        SimpleERC20ConstructorArgs,
        owner.address,
        "SimpleERC20",
        1,
        price,
        false,
        false,
        false,
        false,
        false
      );

      await deploy(
        SimpleERC20,
        SimpleERC20ConstructorArgs,
        owner.address,
        "SimpleERC20",
        1,
        price,
        false,
        false,
        false,
        false,
        false
      );

      const contractAddress = (
        await deployer.getUserContracts(owner.address)
      )[0][0].contractAddress;

      await expect(
        deployer.transferDeployerOwnership(
          1,
          contractAddress,
          owner.address,
          addr[0].address,
          1
        )
      ).to.be.revertedWith("Invalid Contract at index");
    });
  });

  describe("Admin related functions", async function () {
    it("Only Admin address should be able to set the chain Id of the contract", async function () {
      await deployer.setChainId(12);
      expect(await deployer.getChainId()).to.be.equal(12);

      await expect(deployer.connect(addr[0]).setChainId(12)).to.be.reverted;
    });

    it("Only Admin address should be able to set the price to any contract", async function () {
      expect((await deployer.getDeploymentPrice(1))[0]).to.be.equal(price);
      await deployer.setPriceOfContractType(
        1,
        ethers.utils.parseUnits("600", "6")
      );
      expect((await deployer.getDeploymentPrice(1))[0]).to.be.equal(
        ethers.utils.parseUnits("600", "6")
      );

      await expect(
        deployer
          .connect(addr[0])
          .setPriceOfContractType(1, ethers.utils.parseUnits("600", "6"))
      ).to.be.reverted;
    });

    it("Only Admin address should be abel to set the collector address", async function () {
      expect(await deployer.getCollectorAddress()).to.be.equal(
        collector.address
      );
      await deployer.setCollectorAddress(addr[0].address);
      expect(await deployer.getCollectorAddress()).to.be.equal(addr[0].address);

      await expect(
        deployer.connect(addr[0]).setCollectorAddress(addr[0].address)
      ).to.be.reverted;
    });

    it("Only Admin address should be able to set the ERC20 Token address", async function () {
      expect(await deployer.getTokenAddress()).to.be.equal(fakeBusd.address);
      await deployer.setTokenAddress(addr[1].address);
      expect(await deployer.getTokenAddress()).to.be.equal(addr[1].address);

      await expect(deployer.connect(addr[0]).setTokenAddress(fakeBusd.address))
        .to.be.reverted;
    });

    it("Only Admin address should be able to set new contract for any address", async function () {
      await deployer.setNewContractOfDeployer(
        owner.address,
        addr[1].address,
        "SimpleERC20",
        1,
        false,
        false,
        false,
        false,
        false
      );

      const userData = await deployer.getUserContracts(owner.address);

      expect(
        (await deployer.getUserContracts(owner.address))[0].length
      ).to.be.equal(1);

      expect(userData[0][0].deployer).to.be.equal(owner.address);
      expect(userData[0][0].contractAddress).not.to.be.empty;
      expect(userData[0][0].chainId).to.be.equal(1337);
      expect(userData[0][0].contractIndex).to.be.equal(0);
      expect(userData[0][0].contractName).to.be.equal("SimpleERC20");
      expect(userData[0][0].mintable).to.be.equal(false);
      expect(userData[0][0].burnable).to.be.equal(false);
      expect(userData[0][0].capped).to.be.equal(false);
      expect(userData[0][0].role).to.be.equal(false);
      expect(userData[0][0].baseURI).to.be.equal(false);

      await expect(
        deployer
          .connect(addr[0])
          .setNewContractOfDeployer(
            owner.address,
            addr[1].address,
            "SimpleERC20",
            1,
            false,
            false,
            false,
            false,
            false
          )
      ).to.be.reverted;
    });
  });

  describe("Upgrade related function", async function () {
    it("initialize function should be run for only one time", async function () {
      await expect(
        deployer.initialize(
          chainId,
          fakeBusd.address,
          collector.address,
          [1],
          [price]
        )
      ).to.be.reverted;
    });
    it("Only admin address should be able to upgrade the contract", async function () {
      await upgrades.upgradeProxy(deployer.address, Deployer);

      await deployer.transferOwnership(collector.address);

      await expect(upgrades.upgradeProxy(deployer.address, Deployer)).to.be
        .reverted;
    });
  });
});
