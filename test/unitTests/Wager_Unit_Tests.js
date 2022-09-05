const { assert, expect } = require("chai");
const { network, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Wager Unit Tests", function () {
      let deployer, player1, player2, player3, wager, mockAggregator;

      beforeEach(async function () {
        ({ deployer, player1, player2, player3 } = await getNamedAccounts());
        await deployments.fixture(["all"]);
        wager = await ethers.getContract("Wager", deployer);
        mockAggregator = await ethers.getContract("MockAggregator", deployer);
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
          expect(players[0].s_playerPrediction).to.equal(predictionAmount);
          expect(players.length).to.equal(1);
        });

        it("Wager state is active", async function () {
          const predictionAmount = 1450;
          await wager.enterWager(player1, predictionAmount);
          await wager.enterWager(player2, predictionAmount);
          //const wagerState = await wager.getWagerState();
          expect(await wager.getWagerState()).to.equal(1);
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
      });
    });
