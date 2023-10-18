const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");

async function main() {
  [owner, ...addr] = await ethers.getSigners();

  console.log("Deploying with address: ", owner.address);

  busdFactory = await ethers.getContractFactory("FakeBusd");
  busd = await busdFactory.deploy();

  Fintraker = await ethers.getContractFactory("FintrakerBatchTransfer");
  fintraker = await Fintraker.deploy();

  console.log("Fintraker contract address: ", fintraker.address);

  await busd.approve(fintraker.address, ethers.constants.MaxUint256);

  await owner.sendTransaction({
    to: addr[1].address,
    value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
  });
  await busd.transfer(addr[0].address, ethers.utils.parseEther("1"));

  let arr = [];

  for (var i = 0; i < 1; i++) {
    arr.push({
      receiver_address: owner.address,
      amount: ethers.utils.parseEther("1"),
      something: "abhi",
    });
  }

  // let arr1 = [];
  // arr1.push(arr);

  await fintraker.batchTokenTransfer(busd.address, arr);
  await fintraker.batchNativeTransfer(arr, {
    value: ethers.utils.parseEther("500"),
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// 7177

// for one token 1 - 58747
// 2 - 65924
// 3 - 73125
// 4 - 80314
// 5 - 87504
// 6 - 94693
// 7 - 101882
// 8 - 109072
