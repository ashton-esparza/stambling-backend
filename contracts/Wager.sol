// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**@title Stambling's Wager Smart Contract
 * @author Ashton Esparza
 * @notice This contract is for creating wagers within Stambling
 * @dev This implements the Chainlink Data Feeds
 */
contract Wager {
  /* Type Declarations */

  /* State Variables */
  uint256 private immutable i_wagerA;
  uint256 private immutable i_wagerB;
  address private immutable i_playerA;
  address private immutable i_playerB;
  AggregatorV3Interface private immutable i_priceFeed;

  /* Wager Variables */

  constructor(
    uint256 wagerA,
    uint256 wagerB,
    address playerA,
    address playerB,
    address priceFeedInterface
  ) {
    i_wagerA = wagerA;
    i_wagerB = wagerB;
    i_playerA = playerA;
    i_playerB = playerB;
    i_priceFeed = AggregatorV3Interface(priceFeedInterface);
  }
}
