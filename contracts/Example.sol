pragma solidity ^0.4.24;

contract Example {
    address owner; // owner has permissions to modify parameters
    constructor() public {
        owner = msg.sender;
    }

    function greet() public pure returns (string) {
        return "Hello, world";
    }
}
