// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
//maybe add modifier cannotExecute() to prevent checkUpkeep from being called on chain
error Wager__Full();
error Wager__UpkeepNotNeeded();

/**@title Stambling's Wager Smart Contract
 * @author Ashton Esparza
 * @notice This contract is for creating wagers within Stambling
 * @dev This implements the Chainlink Data Feeds
 */
contract Wager is KeeperCompatibleInterface {
  /* Type Declarations */
  struct Player {
    address s_playerAddress;
    uint256 s_playerPrediction;
    int256 s_absoluteDifference;
  }
  enum WagerState {
    REGISTERING, //waiting for players to enter wager
    ACTIVE, //waiting for time to end
    CALCULATING, //getting result from data feed and determining winner
    COMPLETE //wager complete and funds sent to winner
  }

  /* State Variables */
  AggregatorV3Interface private immutable i_priceFeed;
  uint32 private constant MAX_NUM_PLAYERS = 2;
  WagerState private s_wagerState;
  uint256 private immutable i_interval;

  /* Wager Variables */
  uint256 private s_predictionA;
  uint256 private s_predictionB;
  address private s_playerA;
  address private s_playerB;
  uint256 private s_lastTimeStamp;
  Player[] private s_players;

  /* Events */

  /* Function Modifiers */
  modifier checkTooManyNumPlayers() {
    if (s_players.length >= MAX_NUM_PLAYERS) {
      revert Wager__Full();
    }
    _;
  }

  modifier checkEqualNumPlayers() {
    _;
    if (s_players.length == MAX_NUM_PLAYERS) {
      s_wagerState = WagerState.ACTIVE;
    }
  }

  constructor(address priceFeedInterface, uint256 interval) {
    i_priceFeed = AggregatorV3Interface(priceFeedInterface);
    i_interval = interval;
    s_lastTimeStamp = block.timestamp;
    s_wagerState = WagerState.REGISTERING;
  }

  function enterWager(address playerAddress, uint256 playerPrediction)
    public
    checkTooManyNumPlayers
    checkEqualNumPlayers
  {
    //add functionality to ensure correct amount of ether is sent
    s_players.push(
      Player({
        s_playerAddress: playerAddress,
        s_playerPrediction: playerPrediction,
        s_absoluteDifference: 0
      })
    );
    //s_players = new address payable[](0); to reset array later
  }

  function checkUpkeep(
    bytes memory /* checkData */
  )
    public
    view
    override
    returns (
      bool upkeepNeeded,
      bytes memory /* performData */
    )
  {
    //corect state is needed; ACTIVE
    //correct addresses entered wager and sent wager amount; should be ensured by state
    //enough time is passed
    bool timePassed = (block.timestamp - s_lastTimeStamp) >= i_interval;
    bool correctState = (WagerState.ACTIVE == s_wagerState);
    upkeepNeeded = (timePassed && correctState);
  }

  function performUpkeep(
    bytes calldata /* performData */
  ) external override {
    //ensure upkeep is actually needed
    //get latest price
    //determine absolute difference between lastest price and prediction of each player
    //determine which difference is closest to latest price to determine winner of Wager
    //send funds to winner address
    (bool upkeepNeeded, ) = checkUpkeep(""); //ensure upkeep is truly needed
    if (!upkeepNeeded) {
      revert();
    }
    address winnerAddress = address(this);
    int256 bestPredictionDiff = 0;
    (, int256 latestPrice, , , ) = i_priceFeed.latestRoundData();
    for (uint32 i = 0; i < s_players.length; ++i) {
      s_players[i].s_absoluteDifference = abs(
        latestPrice - ((int256)(s_players[i].s_playerPrediction))
      );
      if (i == 0) {
        bestPredictionDiff = s_players[i].s_absoluteDifference;
      } else if (s_players[i].s_absoluteDifference < bestPredictionDiff) {
        bestPredictionDiff = s_players[i].s_absoluteDifference;
        winnerAddress = s_players[i].s_playerAddress;
      }
    }
    (bool success, ) = winnerAddress.call{value: address(this).balance}("");
    require(success);
  }

  function abs(int256 x) private pure returns (int256) {
    return x >= 0 ? x : -x;
  }

  function getAggregatorV3() public view returns (address) {
    return address(i_priceFeed);
  }

  function getPlayers() public view returns (Player[] memory) {
    return s_players;
  }

  function getWagerState() public view returns (WagerState) {
    return s_wagerState;
  }
}
