Airporn Crowdsale Contracts
===========================

This repository contains the Airporn ICO contract source.

Contracts
---------

1. MultiSigWallet.sol: [ConsenSys MultiSigWallet](https://github.com/ConsenSys/MultiSigWallet)
2. XxxToken.sol: actual crowdsale contract.

Test
----
With `testrpc` running in the background, run

```
$ truffle test --network=test
```

Deploy
------
Setup the `MNEMONIC` environment variable, and run

```
$ truffle deploy --network=mainnet
```
