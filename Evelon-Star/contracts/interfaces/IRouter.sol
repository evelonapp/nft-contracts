//SPDX-License-Identifier: Unlicense
pragma solidity ^ 0.8.0;

interface IRouter {
  function taxDivision(uint256 taxTotal, address _tokenToTransfer) external;
}