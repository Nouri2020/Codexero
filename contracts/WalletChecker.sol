// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract WalletChecker {
    struct SearchRecord {
        address searcher;
        uint256 timestamp;
    }

    // Mapping from target wallet address to its search history
    mapping(address => SearchRecord[]) public searchHistory;
    // Mapping to keep track of how many times a wallet was checked
    mapping(address => uint256) public searchCounts;

    event WalletChecked(address indexed searcher, address indexed target, uint256 timestamp);

    // Log a wallet check on-chain
    function logCheck(address target) public {
        searchHistory[target].push(SearchRecord({
            searcher: msg.sender,
            timestamp: block.timestamp
        }));
        searchCounts[target]++;
        
        emit WalletChecked(msg.sender, target, block.timestamp);
    }

    // Retrieve the search history for a specific wallet
    function getRecentChecks(address target) public view returns (SearchRecord[] memory) {
        return searchHistory[target];
    }
}
