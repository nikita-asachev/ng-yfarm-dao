var Voting = artifacts.require('./Voting.sol');
var UnstructuredStorage = artifacts.require('./lib/common/UnstructuredStorage.sol');
var Uint256Helpers = artifacts.require('./lib/common/Uint256Helpers.sol');



module.exports = function(deployer) {
  deployer.deploy([UnstructuredStorage, Uint256Helpers]);
  deployer.autoLink();
  deployer.deploy(Voting);
};
