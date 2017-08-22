const HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = process.env.MNEMONIC;

const providerMainnet = new HDWalletProvider(
    mnemonic, 'https://mainnet.infura.io');
const providerRinkeby = new HDWalletProvider(
    mnemonic, 'https://rinkeby.infura.io');
const providerDevelopment = new HDWalletProvider(
    mnemonic, 'http://localhost:8545', 0);

module.exports = {
  networks: {
    mainnet: {
      network_id: 1,
      gas: 4000000,
      gasPrice: 20e9,
      provider: providerMainnet,
    },
    rinkeby: {
      network_id: 3,
      gas: 4000000,
      gasPrice: 20e9,
      provider: providerRinkeby,
    },
    development: {
      network_id: 4242,
      host: "localhost",
      port: 8545,
      gas: 4000000,
      provider: providerDevelopment
    },
    test: {
      network_id: '*',
      host: "localhost",
      port: 8545,
      gas: 4000000
    }
  }
};
