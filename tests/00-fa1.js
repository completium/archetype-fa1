const {
  deploy,
  expectToThrow,
  exprMichelineToJson,
  getAccount,
  getValueFromBigMap,
  jsonMichelineToExpr,
  runGetter,
  setEndpoint,
  setMockupNow,
  setQuiet,
} = require('@completium/completium-cli');
// const { errors, mkTransferPermit, getBalanceLedger, mkTransferGaslessArgs, getPermitNb, getTransferPermitData, getSignHashPermit, getPermit, GetIsoStringFromTimestamp, mkPackDataTransferGasless, getMetadata } = require('./utils');
const assert = require('assert');

// contracts
let fa1_2;

// accounts
const alice = getAccount('alice');
const bob = getAccount('bob');
const carl = getAccount('carl');
const user1 = getAccount('bootstrap1');
const user2 = getAccount('bootstrap2');
const user3 = getAccount('bootstrap3');
const user4 = getAccount('bootstrap4');

// constants
const tokenId = 0

//set endpointhead
setEndpoint('mockup');

setQuiet(true);
const timestamp_now = Math.floor(Date.now() / 1000)
setMockupNow(timestamp_now)

const total_supply = 1000000

describe('[FA1_2] Contract deployment', async () => {
  it('FA1_2 contract deployment should succeed', async () => {
    [fa1_2, _] = await deploy(
      './contracts/fa1_2.arl',
      {
        parameters: {
          initial_holder: alice.pkh,
          total_supply: total_supply,
        },
        as: alice.pkh,
      }
    );
  });
});

describe('[FA1_2] Tranfer', async () => {
  it('Check if balances are right', async () => {
    // const alice_balance = await get_balance(alice.pkh);
    // assert(alice_balance == total_supply, "INVALID_BALANCE");

    // const bob_balance = await get_balance(bob.pkh);
    // assert(bob_balance == 0);
  })

  it('Transfer from <> caller without allowance should failed', async () => {
    // expectToThrow();
  })

  it('Transfer unkown from should failed', async () => {
    // expectToThrow();
  })

  it('Transfer from = caller with insufficient balance should failed', async () => {
  })

  it('Transfer from = call with sufficient balance should succeed', async () => {
  })

})


describe('[FA1_2] Allowance ', async () => {
  it('Approve known caller with 0 spender allowance should succeed', async () => {
  })

  it('Approve unknown caller should succeed', async () => {
  })

  it('Approve known caller with positive spender allowance should failed', async () => {
  })

  it('Approve 0 allowance known caller with positive spender allowance should succeed', async () => {
  })

})

describe('[FA1_2] Allowance and Transfer ', async () => {

  it('Approve and transfer known caller with 0 spender allowance should succeed', async () => {
  })

})

describe('[FA1_2] Getters', async () => {

  it('Check getAllowance values', async () => {
  })

  it('Check getBalance values', async () => {
  })

  it('Check getTotalSupply value', async () => {
    const value = await runGetter("getTotalSupply", fa1_2.address, { argMichelson: 'Unit', as: alice.pkh })
    assert(value === total_supply.toString(), "Invalid value for getTotalSupply")
  })
})
