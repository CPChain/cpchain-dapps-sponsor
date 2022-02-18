const truffleAssert = require("truffle-assertions");
const utils = require("./utils");
const Sponsor = artifacts.require("Sponsor");

const getBalance = async (address) => {
    return await web3.eth.getBalance(address)
}

contract("Sponsor", (accounts) => {
    it("1", async() => {
        instance = await Sponsor.deployed()
        const tx = await instance.registerDapps("test_1", accounts[1], "www.test.1.com", accounts[2], "{}")
        await utils.checkEvent(tx, utils.EVENT_REGISTER_DAPP, async (e) => {
            // assert.equal(e., utils.cpc(1), "Amount is error")
            // assert.equal(e.count, 5, "count is error")
            console.log(e)
          });
    })
    it("2", async() => {
        instance = await Sponsor.deployed()
        try {
            await instance.registerDapps("test_1", accounts[1], "www.test.1.com", accounts[2], "nothing")
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("this name has already been used"))
        }
        console.log('-------------')
    })
})