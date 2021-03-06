const truffleAssert = require("truffle-assertions");
const utils = require("./utils");
const Sponsor = artifacts.require("Sponsor");

const getBalance = async (address) => {
    return await web3.eth.getBalance(address)
}

// test function enbale and disable contract 
contract("Sponsor enbale and disable contract", (accounts) => {
    it("1. set enabled = false", async () => {
        const instance = await Sponsor.deployed()

        await instance.disableContract()  // enable = false

        // when contract is disabled, the function can't working
        try {
            await instance.registerDapp("test_1", accounts[1], "www.test.1.com", accounts[2], "{}", {from: accounts[1]})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The Contract is disabled"))
        }

        try {
            await instance.modifyDapp(1, "test_2",accounts[1], "www.test.2.com", accounts[2], "{}", {from: accounts[1]})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The Contract is disabled"))
        }

        try {
            const sps_amount = web3.utils.toWei(String(10), "ether")
            await instance.sponsor(1, sps_amount, {from: accounts[0], value: sps_amount})
        } catch(error) {
            assert.ok(error.toString().includes("The Contract is disabled"))
        }

        try {
            await instance.deregisterDapp(1, {from: accounts[1]})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The Contract is disabled"))
        }
    })
    it("2. enable = true", async() => {
        const instance = await Sponsor.deployed()
        await instance.disableContract()  // enable = false
        await instance.enableContract()  // enable = true
        // when contract is enable, function can working agin
        await instance.registerDapp("test_1", accounts[1], "www.test.1.com", accounts[2], "{}", {from: accounts[1]})
        await instance.modifyDapp(1, "test_2",accounts[1], "www.test.2.com", accounts[2], "{}", {from: accounts[1]})
        const sps_amount = web3.utils.toWei(String(10), "ether")
        await instance.sponsor(1, sps_amount, {from: accounts[0], value: sps_amount})
        await instance.deregisterDapp(1, {from: accounts[1]})
    })
    it("3.sender != owner", async() => {
        const instance = await Sponsor.deployed()
        try {
            await instance.disableContract({from: accounts[7]})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("You're not the owner of this contract"))
        }
    })
})

// test changeOwner
contract("Sponsor changeOwner", (accounts) => {
    it("1. sender is owner", async() => {
        const instance = await Sponsor.deployed()
        await instance.transferOwnership(accounts[1])
        await instance.registerDapp("test_1", accounts[1], "www.test.1.com", accounts[2], "{}", {from: accounts[1]})
        // old owner can not take down Dapps or other funtion that only owner can use
        try {
            await instance.takedownDapp(1, {from: accounts[0]})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("You're not the owner of this contract"))
        }

        // new owner have the permission
        const tx = await instance.takedownDapp(1, {from: accounts[1]})
        await utils.checkEvent(tx, utils.EVENT_TAKEDOWN_DAPP, async (e) => {
            assert.equal(e.id, 1, "id is error")
            assert.equal(e.dappName, 'test_1', "dappName is error")
          });
    })
    it("2. sender != owner", async() => {
        const instance = await Sponsor.deployed()
        try {
            await instance.transferOwnership(accounts[2], {from: accounts[3]})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("You're not the owner of this contract"))
        }
    })
})