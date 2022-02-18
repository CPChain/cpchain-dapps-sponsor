pragma solidity ^0.4.24;

interface IAdmin {
    event SetMaxSponsorLimit(uint new_max_sponsor_Limit,  uint256 changed_at);

    event TakedownDapps(uint id, string dappName, address receiver, uint256 takedown_at);

    /**
     * admin takedown dapps
     * emit {TakedownDapps}
     */
    function takedownDapps(uint id) external;
}