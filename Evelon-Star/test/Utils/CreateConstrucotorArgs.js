const { ethers, upgrades } = require("hardhat");

const decimal = "18";
const totalSupply = "1000";
const name = "Test Token";
const symbole = "Test";
const deployer = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const cap = "2000";

const enCoder = ethers.utils.defaultAbiCoder;
const constructorArgs = enCoder.encode(
  ["string", "string", "uint8", "uint256", "address"],
  [name, symbole, decimal, totalSupply, deployer]
);

console.log(constructorArgs);
