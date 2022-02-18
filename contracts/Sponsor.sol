// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

import "./interfaces/ISponsor.sol";
import "./interfaces/IAdmin.sol";
import "./interfaces/IRegistrant.sol";
import "./lib/Enable.sol";

contract Sponsor is Enable, IAdmin, IRegistrant, ISponsor {

    uint256 public maxSponsorLimit = 10000 ether;

    struct Dapp {
        uint id;
        address registrant;
        string dappName; // name of the project that user want to register
        address dappContract; // the contract address
        string indexUrl; // the contract index url
        address receiver; // the address receiving sponsor
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
        require(Dapps[id].registrant == msg.sender);
        _;
    }

    modifier onlyRegistered(uint id) {
        require(Dapps[id].registrant != address(0), "this dapp is not registered");
        require(!Dapps[id].deregistered, "this dapp is deregistered");
        _;
    }

    function setMaxSponsorLimit(uint256 limit) external onlyOwner {
        require(limit >= 1 ether, "the Max Donation limit can not less than 1");
        require(limit <=100000 ether, "the Max Donation limit can not greater than 100000");
        maxSponsorLimit = limit;
        
        emit SetMaxSponsorLimit(limit, block.timestamp);
    }

    function registerDapps(string name, address contractAddr, string url, address receiverAddr, string extendedInfo) external onlyEnabled {
        require(bytes(name).length <= 100, "Length of name should less than 20" );
        require(name_list[name] == false, "this name has already been used");
        require(bytes(url).length <= 100, "Length of url should less than 100");
        require(bytes(extendedInfo).length <= 200, "Length of extendedInfo should less than 200");

        uint256 created_at = block.timestamp;
        dapps_seq += 1;
        Dapps[dapps_seq] = Dapp({
            id: dapps_seq,
            registrant: msg.sender,
            dappName: name,
            dappContract: contractAddr,
            indexUrl: url,
            receiver: receiverAddr,
            extendedInfo: extendedInfo,
            deregistered: false,
            donationAmount: 0,
            created_at: created_at
        });
        name_list[name] = true;
        emit RegisterDapps(name, contractAddr, url, receiverAddr, extendedInfo, created_at);
    }

    function deregisterDapps(uint id) external onlyEnabled onlyRegistrant(id) onlyRegistered(id) {
        Dapps[id].deregistered = true;
        string memory name = Dapps[id].dappName;
        name_list[name] = false;
        
        emit DeregisterDapps(id, msg.sender, name);
    }

    function modifyDapps(uint id, string name, address contractAddr, string url, address receiverAddr, string extendedInfo) external onlyEnabled onlyRegistrant(id) onlyRegistered(id) {
        if(strCompare(name, Dapps[id].dappName)) {
            require(name_list[name] == false, "this name has already been used ");
        }
        require(bytes(name).length <= 20, "Length of name should less than 20");
        require(bytes(url).length <= 100, "Length of url should less than 100");
        require(bytes(extendedInfo).length <= 200, "Length of extendedInfo should less than 200");
        Dapps[id].dappName = name;
        Dapps[id].dappContract = contractAddr;
        Dapps[id].indexUrl = url;
        Dapps[id].receiver = receiverAddr;
        Dapps[id].extendedInfo = extendedInfo;
        
        emit ModifyDapps(id, name, contractAddr, url, receiverAddr, extendedInfo, block.timestamp);
    }

    function takedownDapps(uint id) external onlyOwner onlyEnabled onlyRegistered(id){
        Dapps[id].deregistered = true;
        string memory name = Dapps[id].dappName;
        name_list[name] = false;
        address receiver = Dapps[id].receiver;
        uint256 takedownTime = block.timestamp;
        
        emit TakedownDapps(id, name, receiver, takedownTime);
    }

    function sponsor(uint id, uint256 amount) external payable onlyEnabled onlyRegistered(id) {
        require(amount >= 1 ether, "the sponsor amount can not less than 1");
        require(amount <= maxSponsorLimit, "the sponsor amount can not greater than max donation limit");
        address receiver = Dapps[id].receiver;
        receiver.transfer(amount);
        Dapps[id].donationAmount += amount;
        
        emit Sponsor(msg.sender, receiver, amount, block.timestamp);
    }
}