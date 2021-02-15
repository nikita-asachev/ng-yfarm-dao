const Voting = artifacts.require('Voting');
const VotingMock = artifacts.require('VotingMock');
const BN = require('bn.js');
const { getEventArgument } = require('./helpers/events');
const { installNewApp } = require('./helpers/apps');
const { ANY_ENTITY } = require('./helpers/acl');


const Kernel = artifacts.require('Kernel');
const ACL = artifacts.require('ACL');
const EVMScriptRegistryFactory = artifacts.require('EVMScriptRegistryFactory');
const DAOFactory = artifacts.require('DAOFactory');

async function newDao(rootAccount) {
 const daoFactory = await newDaoFactory();

 const daoReceipt = await daoFactory.newDAO(rootAccount);
 const dao = await Kernel.at(getEventArgument(daoReceipt, 'DeployDAO', 'dao'));

 const acl = await ACL.at(await dao.acl());
 const APP_MANAGER_ROLE = await dao.APP_MANAGER_ROLE();
 await acl.createPermission(
   rootAccount,
   dao.address,
   APP_MANAGER_ROLE,
   rootAccount,
   { from: rootAccount }
 );

 return { dao, acl };
}

async function newDaoFactory() {
  const kernelBase = await Kernel.new(true);
  const aclBase = await ACL.new();
  const registryFactory = await EVMScriptRegistryFactory.new();

  return await DAOFactory.new(
    kernelBase.address,
    aclBase.address,
    registryFactory.address
  )
}

contract('Voting contract testing', async accounts => {

  let votingBase, voting;
  let CREATE_VOTES_ROLE, MODIFY_SUPPORT_ROLE, MODIFY_QUORUM_ROLE

  const root = accounts[0];
  const NOW = 1;
  const APP_ID = '0x1234123412341234123412341234123412341234123412341234123412341234'

  before('load roles', async () => {
    votingBase = await VotingMock.new();
    CREATE_VOTES_ROLE = await votingBase.CREATE_VOTES_ROLE();
    MODIFY_SUPPORT_ROLE = await votingBase.MODIFY_SUPPORT_ROLE();
    MODIFY_QUORUM_ROLE = await votingBase.MODIFY_QUORUM_ROLE();
  });

  beforeEach('deploy DAO with Voting app', async () => {
    const { dao, acl } = await newDao(root);
    voting = await VotingMock.at(await installNewApp(dao, APP_ID, votingBase.address, root));
    await voting.mockSetTimestamp(NOW);
    await acl.createPermission(ANY_ENTITY, voting.address, CREATE_VOTES_ROLE, root, { from: root });
    await acl.createPermission(ANY_ENTITY, voting.address, MODIFY_SUPPORT_ROLE, root, { from: root })
    await acl.createPermission(ANY_ENTITY, voting.address, MODIFY_QUORUM_ROLE, root, { from: root })
  });

  it ('Initializing', async () => {
    const instance = await Voting.deployed();

    const f = new BN(10).mul(new BN(10).pow(new BN(16)));
    const s = new BN(20).mul(new BN(10).pow(new BN(16)));

    // const init = await  instance.initialize.sendTransaction('0x0000000000000000000000000000000000000000', f, s, 1000, {from: account});
    // console.log('init trans = ', init);

    const transaction = await instance.newVote.sendTransaction('0x0000000000000000000000000000000000000000', 'question', {from: root});
    console.log('Transaction ', transaction);
  });
});
