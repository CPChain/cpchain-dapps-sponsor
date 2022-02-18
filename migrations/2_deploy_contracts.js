// Deploy Example
var Sponsor = artifacts.require("./Sponsor.sol");

module.exports = function(deployer) {
    deployer.deploy(Sponsor); //"参数在第二个变量携带"
};
