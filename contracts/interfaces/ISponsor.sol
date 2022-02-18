// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

interface ISponsor {
    event Sponsor(address sponsors, address patron, uint256 sponsorAmount, uint256 sponsor_at);
    

    /**
     * sponsor a project
     * this funtion will transfer Amount(Amount you are willing to sponsor) to the project(which you are willing to sponsor)
     * emit {Sponsor}
     */
    function sponsor(uint id, uint256 amount) external payable;
}