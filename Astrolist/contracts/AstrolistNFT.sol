// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';

contract Astrolists is
    Initializable,
    ERC721Upgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    using StringsUpgradeable for uint256;
    bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');
    bytes32 public constant UPGRADER_ROLE = keccak256('UPGRADER_ROLE');

    string public baseUri;
    string public suffix;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC721_init('Astrolists', 'ASTRO');
        __AccessControl_init();
        __UUPSUpgradeable_init();
        baseUri = 'https://olive-realistic-shrew-608.mypinata.cloud/ipfs/QmZ8M55MKThUD8KQLAguFdjNbi7XFQ7AcGPohngPbGe91D/';
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseUri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), suffix))
                : '';
    }

    function safeMint(
        address to,
        uint256 tokenId
    ) public onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
    }

    function batchMint(
        address[] memory to,
        uint256[] memory tokenIds
    ) external onlyRole(MINTER_ROLE) {
        require(to.length == tokenIds.length);
        for (uint i; i < to.length; i++) {
            _safeMint(to[i], tokenIds[i]);
        }
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(UPGRADER_ROLE) {}

    // The following functions are overrides required by Solidity.

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function updateBaseURIAndSuffix(
        string memory newUri,
        string memory newSuffix
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseUri = newUri;
        suffix = newSuffix;
    }
}
