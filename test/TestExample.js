const Example = artifacts.require("Example");

contract("Example", (accounts) => {
    it("Greet", async () => {
    const instance = await Example.deployed()
    const text = await instance.greet()
    console.log(text)
    })
})
