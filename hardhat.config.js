require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("dotenv").config();
require("solidity-coverage");

const ACCOUNT1_PRIVATE_KEY = process.env.ACCOUNT1_PRIVATE_KEY;
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    localhost: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: ACCOUNT1_PRIVATE_KEY !== undefined ? [ACCOUNT1_PRIVATE_KEY] : [],
      //saveDeployments: true,
      chainId: 4,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: ACCOUNT1_PRIVATE_KEY !== undefined ? [ACCOUNT1_PRIVATE_KEY] : [],
      chainId: 5,
      //blockConfirmations: 6,
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: ACCOUNT1_PRIVATE_KEY !== undefined ? [ACCOUNT1_PRIVATE_KEY] : [],
      //saveDeployments: true,
      chainId: 1,
    },
  },
  solidity: "0.8.9",
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    player1: {
      default: 1,
    },
    player2: {
      default: 2,
    },
    player3: {
      default: 3,
    },
  },
};
