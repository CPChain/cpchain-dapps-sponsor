pragma solidity ^0.4.24;

interface IAdmin {
    event SetMaxSponsorLimit(uint new_max_sponsor_Limit,  uint256 changed_at);

    event TakedownDapp(uint id, string dappName, address receiver, uint256 takedown_at);

    /**
     * admin takedown dapp
     * emit {TakedownDapp}
     */
    function takedownDapp(uint id) external;
}