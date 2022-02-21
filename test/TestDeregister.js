const truffleAssert = require("truffle-assertions");
const utils = require("./utils");
const Sponsor = artifacts.require("Sponsor");

const getBalance = async (address) => {
    return await web3.eth.getBalance(address)
}

contract("Sponsor deregisterDapp", (accounts) => {
    it("1 id = 1, Dapps[1] is exist, msg.sender = Dapps[1].registrant", async() => {
        instance = await Sponsor.deployed()
        await instance.registerDapp("test_1", accounts[1], "www.test.1.com", accounts[2], "{}", {from: accounts[1]})
        const tx = await instance.deregisterDapp(1, {from: accounts[1]})
        await utils.checkEvent(tx, utils.EVENT_DEREGISTER_DAPP, async (e) => {
            assert.equal(e.id, 1, "id is error")
            assert.equal(e.registrant, accounts[1], "registrant is error")
          });
    })
    it("2 id = 2, Dapps[2] is exist, msg.sender != Dapps[2].registrant", async() => {
        instance = await Sponsor.deployed()
        await instance.registerDapp("test_2", accounts[1], "www.test.2.com", accounts[2], "{}", {from: accounts[1]})
        try {
            await instance.deregisterDapp(2, {from: accounts[2]})
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("You're not the owner of this dapp"))
        }
    })
    it("3 id = 3, Dapps[3] is deregistered", async() => {
        instance = await Sponsor.deployed()
        await instance.registerDapp("test_3", accounts[1], "www.test.3.com", accounts[2], "{}", {from: accounts[1]})
        await instance.deregisterDapp(3, {from: accounts[1]})
        try {
            await instance.deregisterDapp(3, {from: accounts[1]})
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("This dapp is deregistered"))
        }
    })
    it("3 id = 4, Dapps[4] is not exist", async() => {
        instance = await Sponsor.deployed()
        try {
            await instance.deregisterDapp(4, {from: accounts[1]})
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("This dapp is not registered"))
        }
    })
})