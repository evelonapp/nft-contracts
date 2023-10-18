// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

interface IERC1155 {
    function safeMint(address to, uint256 tokenId) external;
}

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract AstrolistSellTest is Ownable {
    using Strings for uint256;
    mapping(address => bool) private _isWhiteListed;

    mapping(address => bool) private _isNotEligible;

    mapping(uint256 => bool) private _isIdTaken;

    address private _collectorAddress;

    IERC1155 private _nftToken;

    IERC20 private _erc20Token;

    uint256 private _price;

    string private _baseUri = 'https://gateway.pinata.cloud/ipfs/';

    string extendedString1 = '/Erc721_Data_';

    string extendedString2 = '.json';

    struct TokenUri {
        string uri;
        uint256 tokenId;
    }

    constructor(
        address nftAddress,
        address erc20Address,
        address collectorAddress
    ) {
        _nftToken = IERC1155(nftAddress);
        _erc20Token = IERC20(erc20Address);
        _collectorAddress = collectorAddress;
    }

    function claimReward() external {
        address to = _msgSender();
        require(_isWhiteListed[to], 'Address is not WhiteListed');
        require(!_isNotEligible[to], 'You are not eligible');
        _isWhiteListed[to] = false;
        for (uint256 i = 1; i < 501; i++) {
            if (!_isIdTaken[i]) {
                _nftToken.safeMint(to, i);
                _isIdTaken[i] = true;
                _isNotEligible[to] = true;
                break;
            }
        }
    }

    function claimRewardByTokenId(uint256 tokenId) external {
        address to = _msgSender();
        require(!_isIdTaken[tokenId], 'TokenId is already taken');
        require(_isWhiteListed[to], 'Address is not whiteListed');
        require(!_isNotEligible[to], 'You are not eligible');
        _isWhiteListed[to] = false;
        _nftToken.safeMint(to, tokenId);
        _isIdTaken[tokenId] = true;
        _isNotEligible[to] = true;
    }

    function whiteListAddresses(address[] memory userAddresses)
        external
        onlyOwner
    {
        for (uint256 i; i < userAddresses.length; i++) {
            _isWhiteListed[userAddresses[i]] = true;
        }
    }

    function removeWhiteListedAddresses(address[] memory userAddresses)
        external
        onlyOwner
    {
        for (uint256 i; i < userAddresses.length; i++) {
            _isWhiteListed[userAddresses[i]] = false;
        }
    }

    function buyNft(uint256 tokenId) external {
        require(!_isIdTaken[tokenId], 'Token Id is already taken');

        address userAddress = _msgSender();
        require(!_isNotEligible[userAddress], 'You are not eligible');

        _erc20Token.transferFrom(userAddress, _collectorAddress, _price);
        _nftToken.safeMint(userAddress, tokenId);
        _isNotEligible[userAddress] = true;
        _isIdTaken[tokenId] = true;
    }

    function getNfts() external view returns (TokenUri[] memory) {
        uint256 count;
        uint256 index;

        for (uint256 i = 1; i < 501; i++) {
            if (!_isIdTaken[i]) {
                count++;
            }
        }
        TokenUri[] memory tokenuris = new TokenUri[](count);

        for (uint256 j = 1; j < 501; j++) {
            if (!_isIdTaken[j]) {
                tokenuris[index] = TokenUri(
                    string(abi.encodePacked(_baseUri, j)),
                    j
                );
                index++;
            }
        }
        return tokenuris;
    }

    function getNFTTemp() external view returns (TokenUri[] memory) {
        uint256 count;
        uint256 index;
        uint256 tokenId;
        string memory metaData;

        for (uint256 i = 1; i < 501; i++) {
            if (!_isIdTaken[i]) {
                count++;
            }
        }
        TokenUri[] memory tokenuris = new TokenUri[](count);

        for (uint256 j = 1; j < 501; j++) {
            if (!_isIdTaken[j]) {
                tokenId = j;
                if (tokenId > 0 && tokenId < 101) {
                    metaData = 'QmayKSgyEe6xgfoVfsYhdSHSNoDP17ukfDg5b7mzqGXFCS';
                }
                if (tokenId > 100 && tokenId < 201) {
                    metaData = 'QmXqhk7tsF4uor92KCuYGepWKR2d7c3Jqz9Qmr6wBwxSBt';
                }
                if (tokenId > 200 && tokenId < 301) {
                    metaData = 'QmcxQfhbdJXoEN2KFqeZgu9JzerEe99b8tken4sbKdcdwN';
                }
                if (tokenId > 300 && tokenId < 401) {
                    metaData = 'QmdbdAyscMPK9R9efwysgoBPM2fSLNWFx2wn4rDx2CZq5q';
                }
                if (tokenId > 400 && tokenId < 501) {
                    metaData = 'QmRc8ePQD2SzQMbmNxxv9cAUcVZYNurVXyHcghX9nbFHY8';
                }

                tokenuris[index] = TokenUri(
                    string(
                        abi.encodePacked(
                            string(
                                abi.encodePacked(
                                    _baseUri,
                                    metaData,
                                    extendedString1,
                                    tokenId.toString(),
                                    extendedString2
                                )
                            )
                        )
                    ),
                    j
                );
                index++;
            }
        }
        return tokenuris;
    }

    function setIsIdTaken(uint256[] memory ids, bool value) external onlyOwner {
        for (uint256 i; i < ids.length; i++) {
            _isIdTaken[ids[i]] = value;
        }
    }

    function isWhiteListed(address userAddress) external view returns (bool) {
        return _isWhiteListed[userAddress];
    }

    function isNotEligible(address userAddress) external view returns (bool) {
        return _isNotEligible[userAddress];
    }

    function isIdTaken(uint256 tokenId) external view returns (bool) {
        return _isIdTaken[tokenId];
    }

    function getCollectorAddress() external view returns (address) {
        return _collectorAddress;
    }

    function getNFTAddress() external view returns (address) {
        return address(_nftToken);
    }

    function getERC20Address() external view returns (address) {
        return address(_erc20Token);
    }

    function getPrice() external view returns (uint256) {
        return _price;
    }

    function getBaseUri() external view returns (string memory) {
        return _baseUri;
    }
}
