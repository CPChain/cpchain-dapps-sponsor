const truffleAssert = require("truffle-assertions");
const utils = require("./utils");
const Sponsor = artifacts.require("Sponsor");

const getBalance = async (address) => {
    return await web3.eth.getBalance(address)
}

contract("Sponsor modifyDapp", (accounts) => {
    it("1 params as default", async() => {
        instance = await Sponsor.deployed()
        await instance.registerDapp("test_1", accounts[1], "www.test.1.com", accounts[2], "{}", {from: accounts[1]})
        const tx = await instance.modifyDapp(1, "test_2",accounts[1], "www.test.2.com", accounts[2], "{}", {from: accounts[1]})
        await utils.checkEvent(tx, utils.EVENT_MODIFY_DAPP, async (e) => {
            assert.equal(e.new_name, "test_2", "name is error")
            assert.equal(e.new_contract_addr, accounts[1], "contract address is error")
            assert.equal(e.new_index_url, "www.test.2.com", "url is error")
            assert.equal(e.new_receiver_addr, accounts[2], "receiver address is error")
            assert.equal(e.new_extended_info, "{}", "extended information is error")
          });
    })
    it("2 dapp is not exist", async() => {
        instance = await Sponsor.deployed()
        try {
            await instance.modifyDapp(2,"test_3", accounts[1], "www.test.2.com", accounts[2], "{}", {from: accounts[1]})
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("This dapp is not registered"))
        }
    })
    it("3 dapp is deregisted", async() => {
        instance = await Sponsor.deployed()
        await instance.registerDapp("test_4", accounts[1], "www.test.3.com", accounts[2], "{}", {from: accounts[1]})
        await instance.deregisterDapp(2, {from: accounts[1]})
        try {
            await instance.modifyDapp(2,"test_5", accounts[1], "www.test.3.com", accounts[2], "{}", {from: accounts[1]})
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("This dapp is deregistered"))
        }
    })
    it("4 sender != Dapp[id].registrant", async() => {
        instance = await Sponsor.deployed()
        try {
            await instance.modifyDapp(1,"test_6", accounts[1], "www.test.6.com", accounts[2], "{}", {from: accounts[2]})
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("You're not the owner of this dapp"))
        }
    })
    it("5 name is already been used", async() => {
        instance = await Sponsor.deployed()
        await instance.registerDapp("test_4", accounts[1], "www.test.3.com", accounts[2], "{}", {from: accounts[1]})
        try {
            await instance.modifyDapp(1,"test_4", accounts[1], "www.test.6.com", accounts[2], "{}", {from: accounts[1]})
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("This name has already been used"))
        }
    })
    it("6 length of name,url,extendedinfo greater than max", async() => {
        instance = await Sponsor.deployed()
        const str = "a"
        const name = str.repeat(101)
        const url = str.repeat(101)
        const info = str.repeat(201)
        try {
            await instance.modifyDapp(1, name, accounts[1], "www.test.6.com", accounts[2], "{}", {from: accounts[1]})
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("Length of name should less than 100"))
        }
        try {
            await instance.modifyDapp(1, "test_2", accounts[1], url, accounts[2], "{}", {from: accounts[1]})
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("Length of url should less than 100"))
        }
        try {
            await instance.modifyDapp(1, "test_2", accounts[1], "www.test.6.com", accounts[2], info, {from: accounts[1]})
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("Length of extendedInfo should less than 200"))
        }
    })
})