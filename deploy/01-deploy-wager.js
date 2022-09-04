const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat.config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (developmentChains.includes(network.name)) {
  }
};
