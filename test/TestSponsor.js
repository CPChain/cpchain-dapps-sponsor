const truffleAssert = require("truffle-assertions");
const utils = require("./utils");
const Sponsor = artifacts.require("Sponsor");

const getBalance = async (address) => {
    return await web3.eth.getBalance(address)
}

contract("Sponsor sponsor", (accounts) => {
    it("1 Dapps[id] is exist, amount = 10 ether", async() => {
        instance = await Sponsor.deployed()
        await instance.registerDapp("test_1", accounts[1], "www.test.1.com", accounts[2], "{}", {from: accounts[1]})
        const sps_amount = web3.utils.toWei(String(10), "ether")
        const tx = await instance.sponsor(1, sps_amount, {from: accounts[0], value: sps_amount})
        await utils.checkEvent(tx, utils.EVENT_SPONSOR, async (e) => {
            assert.equal(e.sponsorAmount, utils.cpc(10), "sponsor amount is error")
            assert.equal(e.patron, accounts[2], "receiver is error")
          });
    })
    it("2 Dapps[id] is not exist", async() => {
        instance = await Sponsor.deployed()
        const sps_amount = web3.utils.toWei(String(10), "ether")
        try {
            await instance.sponsor(3, sps_amount, {from: accounts[0], value: sps_amount})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("This dapp is not registered"))
        }
    })
    it("3 Dapps[id] is deregistered", async() => {
        instance = await Sponsor.deployed()
        await instance.registerDapp("test_2", accounts[1], "www.test.2.com", accounts[2], "{}", {from: accounts[1]})
        await instance.deregisterDapp(2, {from: accounts[1]})
        const sps_amount = web3.utils.toWei(String(10), "ether")
        try {
            await instance.sponsor(2, sps_amount, {from: accounts[0], value: sps_amount})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("This dapp is deregistered"))
        }
    })
    it("4 amount < 1 ether", async() => {
        instance = await Sponsor.deployed()
        const sps_amount = web3.utils.toWei(String(0.9), "ether")
        try {
            await instance.sponsor(1, sps_amount, {from: accounts[0], value: sps_amount})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The sponsor amount can not less than 1"))
        }
    })
    it("5 amount > maxSponsorLimit", async() => {
        instance = await Sponsor.deployed()
        const limit = web3.utils.toWei(String(50), "ether")
        await instance.setMaxSponsorLimit(limit)
        const sps_amount = web3.utils.toWei(String(50.1), "ether")
        try {
            await instance.sponsor(1, sps_amount, {from: accounts[0], value: sps_amount})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The sponsor amount can not greater than max sponsor limit"))
        }
    })
})