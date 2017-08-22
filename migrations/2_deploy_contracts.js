let MultiSigWallet = artifacts.require("MultiSigWallet");
let XxxToken = artifacts.require("XxxToken");
let XxxTokenSale = artifacts.require("XxxTokenSale");

module.exports = async function(deployer, network) {
  if (network == "development" || network == "test") return;

  let addressOwner;
  let multiSigWalletOwners;
  let AirPornMultiSigAddress;
  let startTime, endTime;
  let cap;

  if (network == "mainnet") {
    addressOwner = "0xac906c9e79c743ed329a59cf8be2e52a731e5327";
    multiSigWalletOwners = [
      "0xac906c9e79c743ed329a59cf8be2e52a731e5327",
      "0x5626d21cd721eaa2cdc6c2ae41e04666a5a22cbe",
      "0xb097df362d6fa62c605a6e9ed8a325fef6b1a192",
      "0x1cc15e6b2d339746ce53c194c5f9067666a4cc3d"
    ];
    AirPornMultiSigAddress = "0x119ed0e92ee554849916d3fe19197d286fd88dad";

    startTime = 1502668800;  // 2017-08-14 00:00:00 (UTC)
    endTime   = 1510617599;  // 2017-11-13 23:59:59 (UTC)
    cap = web3.toWei(125000);
  } else {
    addressOwner = "0x7d0C3e8f9F091330d2DC4609Afb975d0f847eccD";
    multiSigWalletOwners = [
      "0x7d0C3e8f9F091330d2DC4609Afb975d0f847eccD",
      "0xfe1ecFEff37ad9ecd7a41297F71DbC74bd0e217B",
      "0x8CC73561CD65Ae99e9D4E7520dC3c136Bc893Ba9"
    ];

    let multiSig = await MultiSigWallet.new(multiSigWalletOwners, 2);
    let timeStampNow = Math.floor(Date.now() / 1000);

    AirPornMultiSigAddress = multiSig.address;
    startTime = timeStampNow + 300;
    endTime = timeStampNow + 86400;
    cap = web3.toWei(1000000);
  }

  let xxx = await XxxToken.new();
  let xxxSale = await XxxTokenSale.new();

  await xxx.transferOwnership(xxxSale.address);
  await xxxSale.initialize(
      xxx.address, AirPornMultiSigAddress,
      startTime, endTime, cap);

  console.log("\nMultiSigWallet: " + AirPornMultiSigAddress);
  console.log("XxxToken: " + xxx.address);
  console.log("XxxTokenSale: " + xxxSale.address);
}
