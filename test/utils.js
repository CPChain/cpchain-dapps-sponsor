const truffleAssert = require("truffle-assertions");

exports.cpc = (val) => {
    return web3.utils.toWei(String(val), "ether")
  }

exports.EVENT_REGISTER_DAPP = "RegisterDapp"
exports.EVENT_DEREGISTER_DAPP = "DeregisterDapp"
exports.EVENT_TAKEDOWN_DAPP = "TakedownDapp"

exports.checkEvent = async (tx, event, cb) => {
  let result;
  truffleAssert.eventEmitted(tx, event, (ev) => {
    result = ev
    return true
  });
  await cb(result)
}