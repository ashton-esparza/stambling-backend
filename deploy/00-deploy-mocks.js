const { network, ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  // If we are on a local development network, we need to deploy mocks!
  if (chainId == 31337) {
    log("------------------------------------------------");
    log("Local network detected! Deploying mocks...");
    await deploy("MockAggregator", {
      contract: "MockAggregator",
      from: deployer,
      log: true,
      args: [],
      waitConfirmations: network.config.blockConfirmations || 1,
    });
    log("Mocks Deployed!");
    const ethUsdAggregator = await deployments.get("MockAggregator");
    const mockAggregator = await ethers.getContractAt("MockAggregator", ethUsdAggregator.address);
    const transactionResponse = await mockAggregator.setLatestAnswer("1500");
    await transactionResponse.wait();
    log(`Got contract at: ${mockAggregator.address}`);
    const latestAnswer = await mockAggregator.latestAnswer();
    log(`LatestAnswer is ${latestAnswer}`);
    log("------------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
