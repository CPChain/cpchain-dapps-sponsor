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
            await instance.modifyDapp(2,"test_3",accounts[1], "www.test.2.com", accounts[2], "{}", {from: accounts[1]})
            assert.fail()
        }
        catch(error) {
            assert.ok(error.toString().includes("This dapp is not registered"))
        }
    })
    // it("3 dapp is deregisted", async() => {
    //     instance = await Sponsor.deployed()
    //     await instance.registerDapp("test_3", accounts[1], "www.test.3.com", accounts[2], "{}", {from: accounts[1]})
    //     await instance.deregisterDapp(2, {from: accounts[1]})
    //     try {
    //         await instance.modifyDapp(2,"test_3",accounts[1], "www.test.3.com", accounts[2], "{}", {from: accounts[1]})
    //         assert.fail()
    //     }
    //     catch(error) {
    //         assert.ok(error.toString().includes("This dapp is deregisted"))
    //     }
    // })
    // it("3 id = 3, Dapps[3] is deregistered", async() => {
    //     instance = await Sponsor.deployed()
    //     await instance.registerDapp("test_3", accounts[1], "www.test.3.com", accounts[2], "{}", {from: accounts[1]})
    //     await instance.deregisterDapp(3, {from: accounts[1]})
    //     try {
    //         await instance.deregisterDapp(3, {from: accounts[1]})
    //         assert.fail()
    //     }
    //     catch(error) {
    //         assert.ok(error.toString().includes("This dapp is deregistered"))
    //     }
    // })
    // it("3 id = 4, Dapps[4] is not exist", async() => {
    //     instance = await Sponsor.deployed()
    //     try {
    //         await instance.deregisterDapp(4, {from: accounts[1]})
    //         assert.fail()
    //     }
    //     catch(error) {
    //         assert.ok(error.toString().includes("You're not the owner of this dapp"))
    //     }
    // })
})