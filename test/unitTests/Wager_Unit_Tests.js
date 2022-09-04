const { assert, expect } = require("chai");
const { network, getNamedAccounts, ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("Wager Unit Tests", function () {
  let deployer, wager;

  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    wager = await ethers.getContract("Wager", deployer);
  });

  describe("Contructor", function () {
    isCallTrace("Initializes the wager correctly", async function () {});
  });
});
