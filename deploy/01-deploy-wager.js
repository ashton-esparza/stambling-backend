const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let ethUsdPriceFeedAddress;

  log("----------------START-------------------------------");
  if (developmentChains.includes(network.name)) {
    // Get locally deployed mock data feed contract
    log("Getting address for locally deployed ethUsdAggregator contract...");
    // const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    // ethUsdPriceFeedAddress = ethUsdAggregator.address;
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    log(`ethUsdPriceFeed is: ${ethUsdPriceFeedAddress}`);
  } else {
    log("done");
  }
  log("----------------------------------------------------");
  log("Deploying FundMe and waiting for confirmations...");
  const arguments = [ethUsdPriceFeedAddress];
  const wager = await deploy("Wager", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`Wager deployed at ${wager.address} on network id ${chainId}`);
  log("----------------END---------------------------------");
};

module.exports.tags = ["all", "wager"];
