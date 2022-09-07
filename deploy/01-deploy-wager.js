const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let mockAggregator;

  log("----------------START-01-------------------------------");
  if (developmentChains.includes(network.name)) {
    log("Getting address for locally deployed MockAggregator contract...");
    mockAggregator = await ethers.getContract("MockAggregator", deployer);
  } else {
    log("Trying non-local test network; nothing coded will fail...");
  }
  log("Deploying Wager and waiting for confirmations...");
  const keepersUpdateInterval = networkConfig[chainId]["keepersUpdateInterval"] || "20";
  const arguments = [mockAggregator.address, keepersUpdateInterval];
  const wager = await deploy("Wager", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("----------------END-01---------------------------------");
};

module.exports.tags = ["all", "wager"];
