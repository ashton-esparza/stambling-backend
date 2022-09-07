const { assert, expect } = require("chai");
const { network, getNamedAccounts, ethers } = require("hardhat");
const { boolean } = require("hardhat/internal/core/params/argumentTypes");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Wager Unit Tests", function () {
      let deployer, player1, player2, player3, wager, mockAggregator;

      beforeEach(async function () {
        ({ deployer, player1, player2, player3 } = await getNamedAccounts());
        await deployments.fixture(["all"]);
        wager = await ethers.getContract("Wager", deployer);
        mockAggregator = await ethers.getContract("MockV3Aggregator", deployer);
      });

      describe("Deployment", function () {
        it("Initializes the aggregator address correctly", async function () {
          const mockAggregatorAddress = await wager.getAggregatorV3();
          assert.equal(mockAggregatorAddress, mockAggregator.address);
        });

        it("Initializes the wager state correctly", async function () {
          const wagerState = await wager.getWagerState();
          assert.equal(wagerState, 0);
        });
      });

      describe("Functionality", function () {
        it("Player is able to enter wager", async function () {
          const predictionAmount = 1450;
          await wager.enterWager(deployer, predictionAmount);
          const players = await wager.getPlayers();
          expect(players[0].s_playerAddress).to.equal(deployer);
          expect(players[0].s_playerPrediction / Math.pow(10, 8)).to.equal(predictionAmount);
          expect(players.length).to.equal(1);
        });

        it("Wager state is active", async function () {
          const predictionAmount = 1450;
          await wager.enterWager(player1, predictionAmount);
          await wager.enterWager(player2, predictionAmount);
          expect(await wager.getWagerState()).to.equal(1);
        });

        it("Upkeep returns true when conditions are satisfied", async function () {
          const predictionAmount = 1450;
          await wager.enterWager(player1, predictionAmount);
          await wager.enterWager(player2, predictionAmount);
          const interval = networkConfig[network.config.chainId]["keepersUpdateInterval"];
          await network.provider.send("evm_increaseTime", [Number(interval) + 1]);
          await network.provider.request({ method: "evm_mine", params: [] });
          const { upkeepNeeded } = await wager.checkUpkeep([]);
          assert(upkeepNeeded);
        });

        it("Performupkeep succeeds and determines correct winner", async function () {
          const predictionAmount1 = 1450;
          const predictionAmount2 = 1850;
          await wager.enterWager(player1, predictionAmount1);
          await wager.enterWager(player2, predictionAmount2);
          const interval = networkConfig[network.config.chainId]["keepersUpdateInterval"];
          await network.provider.send("evm_increaseTime", [Number(interval) + 1]);
          await network.provider.request({ method: "evm_mine", params: [] });
          await wager.performUpkeep([]);
          const players = await wager.getPlayers();
          console.log(
            `Difference is: ${Number(players[0].s_absoluteDifference) / Math.pow(10, 8)}`
          );
          console.log(
            `Difference is: ${Number(players[1].s_absoluteDifference) / Math.pow(10, 8)}`
          );
          expect(await wager.getWagerState()).to.equal(3);
        });

        it("Performupkeep succeeds and determines correct winner pt2", async function () {
          const predictionAmount1 = 1990;
          const predictionAmount2 = 2011;
          await wager.enterWager(player1, predictionAmount1);
          await wager.enterWager(player2, predictionAmount2);
          const interval = networkConfig[network.config.chainId]["keepersUpdateInterval"];
          await network.provider.send("evm_increaseTime", [Number(interval) + 1]);
          await network.provider.request({ method: "evm_mine", params: [] });
          await wager.performUpkeep([]);
          const players = await wager.getPlayers();
          console.log(
            `Difference is: ${Number(players[0].s_absoluteDifference) / Math.pow(10, 8)}`
          );
          console.log(
            `Difference is: ${Number(players[1].s_absoluteDifference) / Math.pow(10, 8)}`
          );
          expect(await wager.getWagerState()).to.equal(3);
        });
      });

      describe("Error Handling", function () {
        it("Reverts if too many players attempt to enter", async function () {
          const predictionAmount = 1450;
          await wager.enterWager(player1, predictionAmount);
          await wager.enterWager(player2, predictionAmount);
          await expect(wager.enterWager(player3, predictionAmount)).to.be.revertedWith(
            "Wager__Full"
          );
        });

        it("Reverts if not enough time has passed", async function () {
          const predictionAmount = 1450;
          await wager.enterWager(player1, predictionAmount);
          await wager.enterWager(player2, predictionAmount);
          await expect(wager.performUpkeep([])).to.be.reverted;
        });

        it("Reverts if not enough players enter wager", async function () {
          const predictionAmount = 1450;
          await wager.enterWager(player1, predictionAmount);
          await expect(wager.performUpkeep([])).to.be.reverted;
        });
      });
    });
