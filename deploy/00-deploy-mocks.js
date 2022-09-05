const { network, ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  const initialPrice = "1500";
  // If we are on a local development network, we need to deploy mocks!
  if (chainId == 31337) {
    log("----------------START-00-------------------------------");
    log("Local network detected! Deploying mocks...");
    await deploy("MockAggregator", {
      contract: "MockAggregator",
      from: deployer,
      log: true,
      args: [],
      waitConfirmations: network.config.blockConfirmations || 1,
    });
    log(`Mocks Deployed! Now setting initial price to ${initialPrice}...`);
    const mockAggregator = await ethers.getContract("MockAggregator", deployer);
    const transactionResponse = await mockAggregator.setLatestAnswer(initialPrice);
    await transactionResponse.wait();
    log("----------------END-00---------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
