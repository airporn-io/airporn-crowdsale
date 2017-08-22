const MultiSigWallet = artifacts.require("MultiSigWallet");
const XxxToken = artifacts.require("XxxToken");
const XxxTokenSaleMock = artifacts.require("XxxTokenSaleMock");

// Helper functions
async function assertFail(callback) {
  let web3_error_thrown = false;
  try {
    await callback();
  } catch (error) {
    if (error.message.search("invalid opcode"))
      web3_error_thrown = true;
  }
  assert.ok(web3_error_thrown, "Transaction should fail");
};

contract('XxxTokenSale', function(accounts) {
  var addressAirPorn = accounts[0];
  var addressContrib1 = accounts[1];
  var addressContrib2 = accounts[2];
  var multiSigAirPorn;
  var xxx;
  var xxxSale;

  it("Deploys all contracts", async function() {
    multiSigAirPorn = await MultiSigWallet.new([addressAirPorn], 1);

    xxx = await XxxToken.new();
    xxxSale = await XxxTokenSaleMock.new();

    await xxx.transferOwnership(xxxSale.address);
    await xxxSale.initialize(xxx.address, multiSigAirPorn.address,
                             10, 100, web3.toWei(1000000));
  });

  it("Check initial parameters", async function() {
    assert.equal(await xxxSale.wallet(), multiSigAirPorn.address);
    assert.equal(await xxxSale.token(), xxx.address);
  });

  it("Checks that nobody can buy before the sale starts", async function() {
    await assertFail(async function() {
      await xxxSale.send(web3.toWei(1));
    });
  });

  it("should give user token when they send ether", async function() {
    const timestamp = 10;
    const rate = await xxxSale.getRateAt(timestamp);
    let totalIssued = 0;
    let balance = 0;

    await xxxSale.setCurrentTimestamp(timestamp);

    // User 1
    amount = web3.toWei(1);
    await xxxSale.sendTransaction({
      from: addressContrib1,
      value: amount,
      gas: 4000000,
      gasPrice: 20e9
    });

    balance = await xxx.balanceOf(addressContrib1);
    assert.equal(balance, rate * amount);
    totalIssued = balance;

    // User 2
    amount = web3.toWei(2);
    await xxxSale.sendTransaction({
      from: addressContrib2,
      value: amount,
      gas: 4000000,
      gasPrice: 20e9
    });

    balance = await xxx.balanceOf(addressContrib2);
    assert.equal(balance, rate * amount);
    totalIssued = totalIssued.add(balance);

    // Check total supply
    assert.equal(totalIssued.toNumber(), (await xxx.totalSupply()).toNumber());
  });

  it("should give 20% reserve to airporn.io when finalized", async function() {
    const totalSupplyBeforeFinalized = await xxx.totalSupply();
    const reservedSupply = totalSupplyBeforeFinalized.mul(0.2);

    await xxxSale.setCurrentTimestamp(101);
    await xxxSale.finalize();

    assert.equal(await xxx.mintingFinished(), true);
    assert.equal((await xxx.balanceOf(multiSigAirPorn.address)).toNumber(),
                 reservedSupply.toNumber());
    assert.equal((await xxx.totalSupply()).toNumber(),
                 totalSupplyBeforeFinalized.add(reservedSupply).toNumber());
  });
});
