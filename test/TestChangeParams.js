const truffleAssert = require("truffle-assertions");
const utils = require("./utils");
const Sponsor = artifacts.require("Sponsor");

const getBalance = async (address) => {
    return await web3.eth.getBalance(address)
}

// test function enbale and disable contract 
contract("Sponsor enbale and disable contract", (accounts) => {
    it("1 set maxSponsorLimit = 0.9", async() => {
        instance = await Sponsor.deployed()
        const limit = web3.utils.toWei(String(0.9), "ether")
        try {
            await instance.setMaxSponsorLimit(limit)
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The Max Donation limit can not less than 1"))
        }
    })
    it("2 set maxSponsorLimit = 1", async() => {
        instance = await Sponsor.deployed()
        const limit = web3.utils.toWei(String(1), "ether")
        await instance.setMaxSponsorLimit(limit)
    })
    it("3 set maxSponsorLimit = 100000", async() => {
        instance = await Sponsor.deployed()
        const limit = web3.utils.toWei(String(100000), "ether")
        await instance.setMaxSponsorLimit(limit)

    })
    it("4 set maxSponsorLimit = 100001", async() => {
        instance = await Sponsor.deployed()
        const limit = web3.utils.toWei(String(100001), "ether")
        try {
            await instance.setMaxSponsorLimit(limit)
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The Max Donation limit can not greater than 100000"))
        }
    })
    it("5 set maxNameLength = 0", async() => {
        instance = await Sponsor.deployed()
        try {
            await instance.setMaxNameLength(0)
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The Max length of name can not less than 1"))
        }
    })
    it("6 set maxNameLength = 1", async() => {
        instance = await Sponsor.deployed()
        await instance.setMaxNameLength(1)
    })
    it("7 set maxNameLength = 10000", async() => {
        instance = await Sponsor.deployed()
        await instance.setMaxNameLength(10000)

    })
    it("8 set maxNameLength = 10001", async() => {
        instance = await Sponsor.deployed()
        try {
            await instance.setMaxNameLength(10001)
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The Max length of name can not greater than 10000"))
        }
    })
    it("9 set maxUrlLength = 0", async() => {
        instance = await Sponsor.deployed()
        try {
            await instance.setMaxUrlLength(0)
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The Max length of url can not less than 1"))
        }
    })
    it("10 set maxUrlLength = 1", async() => {
        instance = await Sponsor.deployed()
        await instance.setMaxUrlLength(1)
    })
    it("11 set maxUrlLength = 10000", async() => {
        instance = await Sponsor.deployed()
        await instance.setMaxUrlLength(10000)

    })
    it("12 set maxUrlLength = 10001", async() => {
        instance = await Sponsor.deployed()
        try {
            await instance.setMaxUrlLength(10001)
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The Max length of url can not greater than 10000"))
        }
    })
    it("13 set maxInfoLength = 0", async() => {
        instance = await Sponsor.deployed()
        try {
            await instance.setMaxInfoLength(0)
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The Max length of info can not less than 1"))
        }
    })
    it("14 set maxInfoLength = 1", async() => {
        instance = await Sponsor.deployed()
        await instance.setMaxInfoLength(1)
    })
    it("15 set maxInfoLength = 10000", async() => {
        instance = await Sponsor.deployed()
        await instance.setMaxInfoLength(10000)

    })
    it("16 set maxInfoLength = 10001", async() => {
        instance = await Sponsor.deployed()
        try {
            await instance.setMaxInfoLength(10001)
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The Max length of info can not greater than 10000"))
        }
    })
})
