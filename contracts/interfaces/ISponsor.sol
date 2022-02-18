// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

interface ISponsor {
    event Sponsor(address indexed sponsors, address indexed patron, uint256 sponsorAmount, uint256 indexed sponsor_at);
    
    /**
     * sponsor a project
     * this funtion will transfer Amount(Amount you are willing to sponsor) to the project(which you are willing to sponsor)
     * emit {Sponsor}
     */
    function sponsor(uint id, uint256 amount) external payable;
}