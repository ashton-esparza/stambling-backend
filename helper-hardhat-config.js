const { ethers } = require("hardhat");

const networkConfig = {
  4: {
    name: "rinkeby",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    btcUsdPriceFeed: "0xECe365B379E1dD183B20fc5f022230C044d51404",
  },
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    btcUsdPriceFeed: "0xA39434A63A52E749F02807ae27335515BA4b07F7",
  },
  31337: {
    name: "hardhat",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = { networkConfig, developmentChains };
