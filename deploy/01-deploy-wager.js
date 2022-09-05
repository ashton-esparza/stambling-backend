const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let mockAggregator;

  log("----------------START-------------------------------");
  if (developmentChains.includes(network.name)) {
    // Get locally deployed mock data feed contract
    log("Getting address for locally deployed ethUsdAggregator contract...");
    //const ethUsdAggregator = await deployments.get("MockAggregator");
    //ethUsdPriceFeedAddress = ethUsdAggregator.address;
    mockAggregator = await ethers.getContract("MockAggregator", deployer);
    log(`mockAggregator is: ${mockAggregator.address}`);
  } else {
    log("Trying non-local test network; nothing coded will fail...");
  }
  log("----------------------------------------------------");
  log("Deploying FundMe and waiting for confirmations...");
  const arguments = [mockAggregator.address];
  const wager = await deploy("Wager", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`Wager deployed at ${wager.address} on network id ${chainId}`);
  log("----------------END---------------------------------");
};

module.exports.tags = ["all", "wager"];
