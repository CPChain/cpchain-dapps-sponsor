pragma solidity ^0.4.24;

interface IRegistrant {
    event RegisterDapps(string dappName, address contractAddress, string indexUrl, address receiver, string extendedInfo, uint256 created_at);

    event DeregisterDapps(uint id, address registrant, string dappName);

    event ModifyDapps(uint id,string new_name, address new_contract_addr, string new_index_url, address new_receiver, string new_extended_info, uint256 modified_at);
    /**
     * user register their dapps for receiving donation
     * emit {RegisterDapps}
     */
    function registerDapp(string name, address contractAddr, string url, address receiverAddr, string extendedInfo) external;
    
    /**
     * user deregister their dapps which registered
     * emit {DeregisterDapps}
     */
    function deregisterDapps(uint id) external;

    /**
     * user modify their dapps info
     * emit {ModifyDapps}
     */
    function modifyDapps(uint id, string name, address contractAddr, string url, address receiverAddr, string extendedInfo) external;
}