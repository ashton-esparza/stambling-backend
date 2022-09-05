// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error Wager__Full();

/**@title Stambling's Wager Smart Contract
 * @author Ashton Esparza
 * @notice This contract is for creating wagers within Stambling
 * @dev This implements the Chainlink Data Feeds
 */
contract Wager {
  /* Type Declarations */
  struct Player {
    address s_playerAddress;
    uint256 s_playerPrediction;
  }
  enum WagerState {
    REGISTERING,
    ACTIVE,
    CALCULATING,
    COMPLETE
  }

  /* State Variables */
  AggregatorV3Interface private immutable i_priceFeed;
  uint32 private constant MAX_NUM_PLAYERS = 2;
  WagerState private s_wagerState;

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

  constructor(address priceFeedInterface) {
    i_priceFeed = AggregatorV3Interface(priceFeedInterface);
    s_lastTimeStamp = block.timestamp;
    s_wagerState = WagerState.REGISTERING;
  }

  function enterWager(address playerAddress, uint256 playerPrediction)
    public
    checkTooManyNumPlayers
    checkEqualNumPlayers
  {
    //add functionality to ensure correct amount of ether is sent
    s_players.push(Player({s_playerAddress: playerAddress, s_playerPrediction: playerPrediction}));
    //s_players = new address payable[](0); to reset array later
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
