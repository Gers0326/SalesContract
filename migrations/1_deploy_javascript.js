const SalesContract = artifacts.require("SalesContract.sol");

module.exports = function (deployer) {
  deployer.deploy(SalesContract);
};