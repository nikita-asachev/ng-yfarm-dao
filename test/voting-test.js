const Voting = artifacts.require('Voting');
const VotingMock = artifacts.require('VotingMock');
const BN = require('bn.js');
const { newDao, newDaoFactory } = require('./helpers/dao');
const { installNewApp } = require('./helpers/apps');
const { ANY_ENTITY } = require('./helpers/acl');
const { encodeCallScript } = require('./helpers/evmScript');
const { bigExp } = require('./helpers/numbers');


const Kernel = artifacts.require('Kernel');
const ACL = artifacts.require('ACL');
const EVMScriptRegistryFactory = artifacts.require('EVMScriptRegistryFactory');
const DAOFactory = artifacts.require('DAOFactory');
const ExecutionTarget = artifacts.require('ExecutionTarget');
const MiniMeToken = artifacts.require('MiniMeToken');

const ZERO_ADDRESS = '0x' + '0'.repeat(40);

contract('Voting contract testing', async accounts => {

  let votingBase, voting, executionTarget, token;
  let CREATE_VOTES_ROLE, MODIFY_SUPPORT_ROLE, MODIFY_QUORUM_ROLE

  const root = accounts[0];
  const NOW = 1;
  const votingDuration = 1000;
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

  // context('normal token supply, common tests', () => {
  //   const neededSupport = new BN(20).mul(new BN(10).pow(new BN(16)));
  //   const minimumAcceptanceQuorum = new BN(1clear0).mul(new BN(10).pow(new BN(16)));
  //
  //   beforeEach(async () => {
  //     token = new MiniMeToken.new(ZERO_ADDRESS, ZERO_ADDRESS, 0, 'n', 0, 'n', true);
  //     await voting.initialize(token.address, neededSupport, minimumAcceptanceQuorum, votingDuration);
  //     executionTarget = await ExecutionTarget.new();
  //   });
  // });


  for (const decimals of [0, 2, 18, 26]) {
    context(`normal token supply, ${decimals} decimals`, () => {
        const neededSupport = new BN(20).mul(new BN(10).pow(new BN(16)));
        const minimumAcceptanceQuorum = new BN(10).mul(new BN(10).pow(new BN(16)));

        beforeEach(async () => {
          token = await MiniMeToken.new(ZERO_ADDRESS, ZERO_ADDRESS, 0, 'n', decimals, 'n', true);

          await token.generateTokens(accounts[3], bigExp(20, decimals));
          await token.generateTokens(accounts[4], bigExp(29, decimals));
          await token.generateTokens(accounts[5], bigExp(51, decimals));

          await voting.initialize(token.address, neededSupport, minimumAcceptanceQuorum, votingDuration);

          executionTarget = await ExecutionTarget.new();
        });

        it('deciding voting is automatically executed', async () => {
          const action = { to: executionTarget.address, calldata: executionTarget.contract.methods.execute().encodeABI() }
          const script = encodeCallScript([action]);
          console.log('SCRIPT = ', script);
          await voting.newVote(script, '', { from: accounts[5]});
          assert.equal(await executionTarget.counter(), 1, 'should have received execution call')
        });
    })
  }


  // it ('Initializing', async () => {
  //   const instance = await Voting.deployed();
  //
  //   const f = new BN(10).mul(new BN(10).pow(new BN(16)));
  //   const s = new BN(20).mul(new BN(10).pow(new BN(16)));
  //
  //   // const init = await  instance.initialize.sendTransaction('0x0000000000000000000000000000000000000000', f, s, 1000, {from: account});
  //   // console.log('init trans = ', init);
  //
  //   const transaction = await instance.newVote.sendTransaction('0x0000000000000000000000000000000000000000', 'question', {from: root});
  //   console.log('Transaction ', transaction);
  // });
});
