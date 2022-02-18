const truffleAssert = require("truffle-assertions");
const utils = require("./utils");
const Sponsor = artifacts.require("Sponsor");

const getBalance = async (address) => {
    return await web3.eth.getBalance(address)
}

contract("Sponsor registerDapp", (accounts) => {
    it("1 params as default", async() => {
        instance = await Sponsor.deployed()
        const tx = await instance.registerDapp("test_1", accounts[1], "www.test.1.com", accounts[2], "{}")
        await utils.checkEvent(tx, utils.EVENT_REGISTER_DAPP, async (e) => {
            assert.equal(e.dappName, "test_1", "dappName is error")
            assert.equal(e.contractAddr, accounts[1], "contract address is error")
          });
    })
    it("2 set name = test_1 again", async() => {
        instance = await Sponsor.deployed()
        try {
            await instance.registerDapp("test_1", accounts[3], "www.test.1.com", accounts[4], "{}")
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("This name has already been used"))
        }
    })
    it("3 set name = test_2", async() => {
        instance = await Sponsor.deployed()
        const tx = await instance.registerDapp("test_2", accounts[3], "www.test.2.com", accounts[4], "{}")
        await utils.checkEvent(tx, utils.EVENT_REGISTER_DAPP, async (e) => {
            assert.equal(e.dappName, "test_2", "dappName is error")
          });
    })
    it("4 set bytes(name).length > 100", async() => {
        instance = await Sponsor.deployed()
        const str = "a"
        const name_1 = str.repeat(100)
        const name_2 = str.repeat(101)
        const tx = await instance.registerDapp(name_1, accounts[3], "www.test.0.com", accounts[4], "{}")
        await utils.checkEvent(tx, utils.EVENT_REGISTER_DAPP, async (e) => {
            assert.equal(e.dappName, name_1, "dappName is error")
          });
        try {
            await instance.registerDapp(name_2, accounts[3], "www.test.0.com", accounts[4], "{}")
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("Length of name should less than 100"))
        }
    })
    it("5 set bytes(url).length > 200", async() => {
        instance = await Sponsor.deployed()
        const str = "a"
        const url_1 = str.repeat(100)
        const url_2 = str.repeat(101)
        const tx = await instance.registerDapp('test_3', accounts[3], url_1, accounts[4], "{}")
        await utils.checkEvent(tx, utils.EVENT_REGISTER_DAPP, async (e) => {
            assert.equal(e.indexUrl, url_1, "url is error")
          });
        try {
            await instance.registerDapp('test_4', accounts[3], url_2, accounts[4], "{}")
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("Length of url should less than 100"))
        }
    })
    it("6 set bytes(extendedInfo).length > 200", async() => {
        instance = await Sponsor.deployed()
        const str = "a"
        const info_1 = str.repeat(200)
        const info_2 = str.repeat(201)
        const tx = await instance.registerDapp('test_4', accounts[3], 'www.test.0.com', accounts[4], info_1)
        await utils.checkEvent(tx, utils.EVENT_REGISTER_DAPP, async (e) => {
            assert.equal(e.extendedInfo, info_1, "extendedInfo is error")
          });
        try {
            await instance.registerDapp('test_5', accounts[3], 'www.test.0.com', accounts[4], info_2)
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("Length of extendedInfo should less than 200"))
        }
    })
})