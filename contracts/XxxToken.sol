pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/token/MintableToken.sol";


contract XxxToken is MintableToken {
    // Token Info.
    string public constant name = "XXX Token";
    string public constant symbol = "XXX";
    uint8 public constant decimals = 18;
}

contract XxxTokenSale is Ownable {
    using SafeMath for uint256;

    // Sale period.
    uint256 public startDate;
    uint256 public endDate;

    // Cap USD 25mil @ 200 ETH/USD
    uint256 public cap;

    // Address where funds are collected.
    address public wallet;

    // Amount of raised money in wei.
    uint256 public weiRaised;

    // Actual Token contract
    XxxToken public token;

    // Event
    event TokenPurchase(address indexed purchaser, address indexed beneficiary,
                        uint256 value, uint256 amount);
    event TokenReserveMinted(uint256 amount);

    // Modifiers
    modifier initialized() {
        require(address(token) != 0x0);
        _;
    }

    function XxxTokenSale() {
    }

    function initialize(XxxToken _token, address _wallet,
                        uint256 _start, uint256 _end,
                        uint256 _cap) onlyOwner {
        require(address(token) == address(0));
        require(_token.owner() == address(this));
        require(_start >= getCurrentTimestamp());
        require(_start < _end);
        require(_wallet != 0x0);

        token = _token;
        wallet = _wallet;
        startDate = _start;
        endDate = _end;
        cap = _cap;
    }

    function getCurrentTimestamp() internal returns (uint256) {
        return now;
    }

    // fallback function can be used to buy tokens
    function () payable {
        buyTokens(msg.sender);
    }

    function getRateAt(uint256 at) constant returns (uint256) {
        if (at < startDate) {
            return 0;
        } else if (at < (startDate + 7 days)) {
            return 2000;
        } else if (at < (startDate + 14 days)) {
            return 1800;
        } else if (at < (startDate + 21 days)) {
            return 1700;
        } else if (at < (startDate + 28 days)) {
            return 1600;
        } else if (at < (startDate + 35 days)) {
            return 1500;
        } else if (at < (startDate + 49 days)) {
            return 1400;
        } else if (at < (startDate + 63 days)) {
            return 1300;
        } else if (at < (startDate + 77 days)) {
            return 1200;
        } else if (at <= endDate) {
            return 1100;
        } else {
            return 0;
        }
    }

    function buyTokens(address beneficiary) payable {
        require(beneficiary != 0x0);
        require(msg.value != 0);
        require(saleActive());

        uint256 weiAmount = msg.value;
        uint256 updatedWeiRaised = weiRaised.add(weiAmount);

        // Can not exceed cap.
        require(updatedWeiRaised <= cap);

        // calculate token amount to be created
        uint256 actualRate = getRateAt(getCurrentTimestamp());
        uint256 tokens = weiAmount.mul(actualRate);

        // Update state.
        weiRaised = updatedWeiRaised;

        // Mint Token and give it to sender.
        token.mint(beneficiary, tokens);
        TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);

        // Forward the fund to fund collection wallet.
        wallet.transfer(msg.value);
    }

    function finalize() onlyOwner {
        require(!saleActive());

        // Allocate 20% for AirPorn (for development, marketing, etc...)
        uint256 xxxToReserve = SafeMath.div(token.totalSupply(), 5);
        token.mint(wallet, xxxToReserve);
        TokenReserveMinted(xxxToReserve);

        // Finish minting as we no longer want to mint any new token after the
        // sale.
        token.finishMinting();
    }

    function saleActive() public constant returns (bool) {
        return (getCurrentTimestamp() >= startDate &&
                getCurrentTimestamp() <= endDate && weiRaised < cap);
    }
}
