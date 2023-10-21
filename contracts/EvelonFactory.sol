// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IERC1155 {
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external;
}

contract EvelonFactory is
    Initializable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    IERC1155 public evelonNFT;
    IERC20 public usdt;
    address public buybackWallet;
    address public collectionWallet;
    uint256 public price;
    uint256 public buybackPercent;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address defaultAdmin,
        address upgrader,
        address evelonNFT_,
        address usdt_,
        address collectionWallet_,
        address buybackWallet_,
        uint256 buybackPercent_,
        uint256 price_
    ) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, upgrader);

        evelonNFT = IERC1155(evelonNFT_);
        usdt = IERC20(usdt_);
        buybackWallet = buybackWallet_;
        collectionWallet = collectionWallet_;
        buybackPercent = buybackPercent_;
        price = price_;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(UPGRADER_ROLE) {}

    function mint(address account, uint256 id, uint256 amount) public {
        uint256 buyback = (price * buybackPercent) / 10000;
        usdt.transferFrom(msg.sender, collectionWallet, price - buyback);
        usdt.transferFrom(msg.sender, buybackWallet, buyback);
        evelonNFT.mint(account, id, amount, "0x");
    }

    function updateAddresses(
        address evelonNFT_,
        address usdt_,
        address buybackWallet_,
        address collectionWallet_
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (address(evelonNFT) != evelonNFT_) {
            evelonNFT = IERC1155(evelonNFT_);
        }
        if (address(usdt) != usdt_) {
            usdt = IERC20(usdt_);
        }
        if (buybackWallet != buybackWallet_) {
            buybackWallet = buybackWallet_;
        }
        if (collectionWallet != collectionWallet_) {
            collectionWallet = collectionWallet_;
        }
    }

    function updatePriceAndBuyback(
        uint256 price_,
        uint256 buybackPercent_
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (price != price_) {
            price = price_;
        }
        if (buybackPercent != buybackPercent_) {
            buybackPercent = buybackPercent_;
        }
    }
}
