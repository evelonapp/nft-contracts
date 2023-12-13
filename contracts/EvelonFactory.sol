// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {NFTData} from "./EvelonNFT/utils/nftStruct.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IERC1155 {
    function mint(address account, uint256 amount, bytes memory data) external;

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external;

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external;

    function mintBatch(
        address to,
        uint256[] memory amounts,
        bytes memory data
    ) external;

    function getAllTokens(
        address creator
    ) external view returns (NFTData[] memory);

    function uri(uint256 id) external view returns (string memory);

    function getTokenId() external view returns (uint256);

    function upgradeToAndCall(
        address newImplementation,
        bytes memory data
    ) external;
}

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external;
}

error EvelonInvalidIndex(uint256 currentIndex, uint256 indexEntered);

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
    address public implementation;
    struct NFTDatas {
        NFTData[] allNFTDatas;
        address contractAddress;
        string contractName;
    }

    struct UserData {
        address[] contractAddresses;
    }

    struct ContractData {
        string name;
        string uri;
        address creator;
        uint256 tokenId;
    }

    mapping(address => UserData) private userData;
    mapping(address => ContractData) public contractData;
    mapping(address => bool) public isUserRegistered;
    address[] public userAddresses;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address defaultAdmin,
        address upgrader,
        address evelonNFT_,
        address usdt_
    ) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, upgrader);

        evelonNFT = IERC1155(evelonNFT_);
        usdt = IERC20(usdt_);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(UPGRADER_ROLE) {}

    function getUserAddresses() external view returns (address[] memory) {
        return userAddresses;
    }

    function getAllTokens(
        address creator
    ) external view returns (NFTDatas[] memory) {
        UserData memory data = userData[creator];
        NFTDatas[] memory nftDatas = new NFTDatas[](
            data.contractAddresses.length + 1
        );
        nftDatas[0] = NFTDatas(
            evelonNFT.getAllTokens(creator),
            address(evelonNFT),
            "EvelonBetaCollection"
        );
        for (uint256 i; i < data.contractAddresses.length; i++) {
            nftDatas[i + 1] = NFTDatas(
                IERC1155(data.contractAddresses[i]).getAllTokens(creator),
                data.contractAddresses[i],
                contractData[data.contractAddresses[i]].name
            );
        }
        return nftDatas;
    }

    function userCollection(
        address creator
    ) external view returns (ContractData[] memory) {
        UserData memory _userData = userData[creator];
        ContractData[] memory _contracData = new ContractData[](
            _userData.contractAddresses.length
        );
        for (uint i; i < _userData.contractAddresses.length; i++) {
            _contracData[i] = contractData[_userData.contractAddresses[i]];
            _contracData[i].uri = IERC1155(_userData.contractAddresses[i]).uri(
                0
            );
            _contracData[i].creator = _userData.contractAddresses[i];
            _contracData[i].tokenId = IERC1155(_userData.contractAddresses[i])
                .getTokenId();
        }

        return _contracData;
    }

    function createCollection(string memory name) external {
        address user = msg.sender;
        ERC1967Proxy erc1967 = new ERC1967Proxy(
            implementation,
            abi.encodeWithSignature(
                "initialize(address,address,address)",
                address(this),
                address(this),
                address(this)
            )
        );
        if (!isUserRegistered[user]) {
            isUserRegistered[user] = true;
            userAddresses.push(user);
        }
        userData[user].contractAddresses.push(address(erc1967));
        contractData[address(erc1967)].name = name;
        contractData[address(erc1967)].creator = user;
    }

    function mint(
        address account,
        address contractAddtess,
        uint256 amount
    ) public {
        _transferFee(1);
        IERC1155(contractAddtess).mint(account, amount, "0x");
    }

    function mintBatch(
        address to,
        address contractAddtess,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external {
        require(
            contractData[contractAddtess].creator == msg.sender,
            "Not Owner"
        );
        _transferFee(ids.length);
        if (contractAddtess == address(evelonNFT)) {
            evelonNFT.mintBatch(to, amounts, "0x");
        } else {
            IERC1155(contractAddtess).mintBatch(to, ids, amounts, "0x");
        }
    }

    function _transferFee(uint256 mintAmount) internal {
        uint256 totalPrice = price * mintAmount;
        uint256 buyback = (totalPrice * buybackPercent) / 10000;

        usdt.transferFrom(msg.sender, collectionWallet, totalPrice - buyback);
        usdt.transferFrom(msg.sender, buybackWallet, buyback);
    }

    function updateAddresses(
        address evelonNFT_,
        address usdt_,
        address buybackWallet_,
        address collectionWallet_,
        address implementation_
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
        if (implementation != implementation_) {
            implementation = implementation_;
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

    function updateImplementations(
        uint256 startIndex,
        uint256 endIndex
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (endIndex > userAddresses.length) {
            revert EvelonInvalidIndex(userAddresses.length, endIndex);
        }
        for (uint256 i = startIndex; i <= endIndex; i++) {
            UserData memory uData = userData[userAddresses[i]];
            for (uint256 j = 0; j < uData.contractAddresses.length; j++) {
                IERC1155(uData.contractAddresses[j]).upgradeToAndCall(
                    implementation,
                    ""
                );
            }
        }
    }
}
