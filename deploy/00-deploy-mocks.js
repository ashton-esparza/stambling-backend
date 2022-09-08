const { network, ethers } = require("hardhat");

const DECIMALS = "8";
const INITIAL_PRICE = "200000000000"; // 2000

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  // If we are on a local development network, we need to deploy mocks!
  if (chainId == 31337) {
    arguments = [DECIMALS, INITIAL_PRICE];
    log("----------------START-00-------------------------------");
    log("Local network detected! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: arguments,
      waitConfirmations: network.config.blockConfirmations || 1,
    });
    // const mockAggregator = await ethers.getContract("MockV3Aggregator", deployer);
    // const { answer } = await mockAggregator.latestRoundData();
    // console.log(`Latest Price is: ${answer / Math.pow(10, DECIMALS)}`);
    log(`Mocks Deployed! Initial price to $${INITIAL_PRICE / Math.pow(10, DECIMALS)}...`);
    log("----------------END-00---------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
