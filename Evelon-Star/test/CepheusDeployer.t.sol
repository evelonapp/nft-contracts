// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "forge-std/Test.sol";

import "../contracts/CepheusDeployer.sol";
import "../contracts/FakeBusd.sol";

// import "./Utils/ByteCodes.sol";

contract CepheusDeployerTest is Test {
    CepheusDeployer cepheusDeployer;
    FakeBusd fakeBusd;
    uint8 decimal = 18;
    uint256 totalSupply = 1000;
    address deployerAddress = address(this);

    function setUp() public {
        uint256[] memory contractTypes = new uint256[](1);
        contractTypes[0] = 1;

        uint256[] memory prices = new uint256[](1);
        prices[0] = 500 * 10**6;

        // Deploying Stable token
        fakeBusd = new FakeBusd();

        // Deploying Deployer contract
        cepheusDeployer = new CepheusDeployer(
            1337,
            address(fakeBusd),
            address(1337),
            contractTypes,
            prices
        );

        // Giving allowance to the Deployer contract
        fakeBusd.approve(address(cepheusDeployer), ~uint256(0));
    }

    function test_SetUp() public {
        assertEq(
            fakeBusd.allowance(address(this), address(cepheusDeployer)),
            ~uint256(0),
            "Allowance"
        );

        assertEq(cepheusDeployer.getChainId(), 1337, "ChainId");

        assertEq(
            (cepheusDeployer.getDeploymentPrice(1))[0],
            500 * 10**6,
            "Price"
        );

        assertEq(
            cepheusDeployer.getCollectorAddress(),
            address(1337),
            "Collector address"
        );

        assertEq(
            cepheusDeployer.getTokenAddress(),
            address(fakeBusd),
            "ERC20 Token"
        );
    }
}
