const { assert, expect } = require("chai");
const { network, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Wager Unit Tests", function () {
      let deployer, wager, mockAggregator;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        wager = await ethers.getContract("Wager", deployer);
        mockAggregator = await ethers.getContract("MockAggregator", deployer);
        // const wagerDeployments = await deployments.get("Wager");
        // const ethUsdAggregator = await deployments.get("MockAggregator");
        // wager = await ethers.getContractAt("Wager", wagerDeployments.address);
        // mockAggregator = await ethers.getContractAt("MockAggregator", ethUsdAggregator.address);
      });

      describe("Contructor", function () {
        it("Initializes the aggregator correctly", async function () {
          const mockAggregatorAddress = await wager.getAggregatorV3();
          assert.equal(mockAggregatorAddress, mockAggregator.address);
        });
      });
    });
