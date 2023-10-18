const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");

async function main() {
  [owner, ...addr] = await ethers.getSigners();

  console.log("Deploying with address: ", owner.address);

  Fintraker = await ethers.getContractFactory("TestETH");
  fintraker = await Fintraker.deploy();

  console.log("Fintraker contract address: ", fintraker.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// 1: https://mint.cepheus.cloud/0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6
// 2: https://mint.cepheus.cloud/0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace
// 3: https://mint.cepheus.cloud/0xc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b
// 4: https://mint.cepheus.cloud/0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b
// 5: https://mint.cepheus.cloud/0x036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0
// 6: https://mint.cepheus.cloud/0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f
// 7: https://mint.cepheus.cloud/0xa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c688
// 8: https://mint.cepheus.cloud/0xf3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3
// 9: https://mint.cepheus.cloud/0x6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af
// 10:https://mint.cepheus.cloud/0xc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a8

// [
//   0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6,
//   0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace,
//   0xc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b,
//   0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b,
//   0x036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0,
//   0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f,
//   0xa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c688,
//   0xf3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3,
//   0x6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af,
//   0xc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a8,
// ];
