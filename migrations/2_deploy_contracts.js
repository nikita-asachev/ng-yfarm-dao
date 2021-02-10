var Voting = artifacts.require('./Voting.sol');
var UnstructuredStorage = artifacts.require('./lib/common/UnstructuredStorage.sol');
var Uint256Helpers = artifacts.require('./lib/common/Uint256Helpers.sol');



module.exports = function(deployer) {
  deployer.deploy(UnstructuredStorage);
  deployer.deploy(Uint256Helpers);
  deployer.link(UnstructuredStorage, Voting);
  deployer.link(Uint256Helpers, Voting);
  deployer.deploy(Voting);
};
