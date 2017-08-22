pragma solidity ^0.4.11;

import "../XxxToken.sol";

contract XxxTokenSaleMock is XxxTokenSale {
    uint256 timestamp = 0;

    function XxxTokenSaleMock() XxxTokenSaleMock() {}

    function getCurrentTimestamp() internal returns (uint256) {
        return timestamp;
    }

    function setCurrentTimestamp(uint256 ts) public {
        timestamp = ts;
    }
}
