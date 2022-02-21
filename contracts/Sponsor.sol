// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

import "./interfaces/ISponsor.sol";
import "./interfaces/IAdmin.sol";
import "./interfaces/IRegistrant.sol";
import "./lib/Enable.sol";

contract Sponsor is Enable, IAdmin , IRegistrant, ISponsor {

    uint256 public maxSponsorLimit = 10000 ether;
    uint public maxNameLength = 100;
    uint public maxUrlLength = 100;
    uint public maxInfoLength = 200;

    struct Dapp {
        uint id;
        address registrant;
        string dappName; // name of the project that user want to register
        address contractAddr; // the contract address
        string indexUrl; // the contract index url
        address receiverAddr; // the address receiving sponsor
        string extendedInfo; // extended information
        bool deregistered;
        uint256 donationAmount;
        uint256 created_at;
    }

    mapping(string => bool) internal name_list;
    uint dapps_seq = 0;
    
    mapping(uint => Dapp) internal Dapps;

    function strCompare(string a, string b) internal pure returns (bool) {
        if (bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
        }
    }


    modifier onlyRegistrant(uint id) {
        require(Dapps[id].registrant == msg.sender, "You're not the owner of this dapp");
        _;
    }

    modifier onlyRegistered(uint id) {
        require(Dapps[id].registrant != address(0), "This dapp is not registered");
        require(!Dapps[id].deregistered, "This dapp is deregistered");
        _;
    }

    function setMaxSponsorLimit(uint256 limit) external onlyOwner {
        require(limit >= 1 ether, "The Max Donation limit can not less than 1");
        require(limit <=100000 ether, "The Max Donation limit can not greater than 100000");
        maxSponsorLimit = limit;
        
        emit SetMaxSponsorLimit(limit, block.timestamp);
    }

    function setMaxNameLength(uint len) external onlyOwner {
        require(len >= 1 , "The Max length of name can not less than 1");
        require(len <=10000, "The Max length of name can not greater than 10000");
        maxNameLength = len;
    }

    function setMaxUrlLength(uint len) external onlyOwner {
        require(len >= 1 , "The Max length of url can not less than 1");
        require(len <=10000, "The Max length of url can not greater than 10000");
        maxUrlLength = len;
    }

    function setMaxInfoLength(uint len) external onlyOwner {
        require(len >= 1 , "The Max length of info can not less than 1");
        require(len <=10000, "The Max length of info can not greater than 10000");
        maxInfoLength = len;
    }

    function registerDapp(string name, address contractAddr, string url, address receiverAddr, string extendedInfo) external onlyEnabled {
        require(bytes(name).length <= maxNameLength, "Length of name should less than 100" );
        require(name_list[name] == false, "This name has already been used");
        require(bytes(url).length <= maxUrlLength, "Length of url should less than 100");
        require(bytes(extendedInfo).length <= maxInfoLength, "Length of extendedInfo should less than 200");

        uint256 created_at = block.timestamp;
        dapps_seq += 1;
        Dapps[dapps_seq] = Dapp({
            id: dapps_seq,
            registrant: msg.sender,
            dappName: name,
            contractAddr: contractAddr,
            indexUrl: url,
            receiverAddr: receiverAddr,
            extendedInfo: extendedInfo,
            deregistered: false,
            donationAmount: 0,
            created_at: created_at
        });
        name_list[name] = true;
        emit RegisterDapp(name, contractAddr, url, receiverAddr, extendedInfo, created_at);
    }

    function deregisterDapp(uint id) external onlyEnabled onlyRegistered(id) onlyRegistrant(id){
        Dapps[id].deregistered = true;
        string memory name = Dapps[id].dappName;
        name_list[name] = false;
        
        emit DeregisterDapp(id, msg.sender, name);
    }

    function modifyDapp(uint id, string name, address contractAddr, string url, address receiverAddr, string extendedInfo) external onlyEnabled onlyRegistered(id) onlyRegistrant(id){
        if(!strCompare(name, Dapps[id].dappName)) {
            require(name_list[name] == false, "This name has already been used");
        }
        require(bytes(name).length <= maxNameLength, "Length of name should less than 100");
        require(bytes(url).length <= maxUrlLength, "Length of url should less than 100");
        require(bytes(extendedInfo).length <= maxInfoLength, "Length of extendedInfo should less than 200");
        Dapps[id].dappName = name;
        Dapps[id].contractAddr = contractAddr;
        Dapps[id].indexUrl = url;
        Dapps[id].receiverAddr = receiverAddr;
        Dapps[id].extendedInfo = extendedInfo;
        
        emit ModifyDapp(id, name, contractAddr, url, receiverAddr, extendedInfo, block.timestamp);
    }

    function takedownDapp(uint id) external onlyOwner onlyEnabled onlyRegistered(id){
        Dapps[id].deregistered = true;
        string memory name = Dapps[id].dappName;
        name_list[name] = false;
        address receiverAddr = Dapps[id].receiverAddr;
        uint256 takedown_at = block.timestamp;
        
        emit TakedownDapp(id, name, receiverAddr, takedown_at);
    }

    function sponsor(uint id, uint256 amount) external payable onlyEnabled onlyRegistered(id) {
        require(amount >= 1 ether, "The sponsor amount can not less than 1");
        require(amount <= maxSponsorLimit, "The sponsor amount can not greater than max sponsor limit");
        address receiver = Dapps[id].receiverAddr;
        receiver.transfer(amount);
        Dapps[id].donationAmount += amount;
        uint256 sponsor_at = block.timestamp;

        emit Sponsor(msg.sender, receiver, amount, sponsor_at);
    }
}