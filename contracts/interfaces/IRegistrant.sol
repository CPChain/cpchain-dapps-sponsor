pragma solidity ^0.4.24;

interface IRegistrant {
    event RegisterDapp(string dappName, address contractAddr, string indexUrl, address receiverAddr, string extendedInfo, uint256 created_at);

    event DeregisterDapp(uint id, address registrant, string dappName);

    event ModifyDapp(uint id,string new_name, address new_contract_addr, string new_index_url, address new_receiver_addr, string new_extended_info, uint256 modified_at);
    /**
     * user register their dapps for receiving donation
     * emit {RegisterDapps}
     */
    function registerDapp(string name, address contractAddr, string url, address receiverAddr, string extendedInfo) external;
    
    /**
     * user deregister their dapps which registered
     * emit {DeregisterDapps}
     */
    function deregisterDapp(uint id) external;

    /**
     * user modify their dapps info
     * emit {ModifyDapps}
     */
    function modifyDapp(uint id, string name, address contractAddr, string url, address receiverAddr, string extendedInfo) external;
}