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
const { errors, getBalance } = require('./utils');
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
    const alice_balance = await getBalance(fa1_2, alice.pkh);
    assert(alice_balance == total_supply, "INVALID_BALANCE");

    const bob_balance = await getBalance(fa1_2, bob.pkh);
    assert(bob_balance == 0);
  })

  it('Transfer from <> caller without allowance should failed', async () => {
    await expectToThrow(async () => {
      await fa1_2.transfer({
        arg: {
          from: alice.pkh,
          to: bob.pkh,
          value: 1,
        },
        as: bob.pkh,
      });
    }, `(Pair "NotEnoughAllowance" (Pair 1 0))`);
  })

  it('Transfer unkown from should failed', async () => {
    await expectToThrow(async () => {
      await fa1_2.transfer({
        arg: {
          from: bob.pkh,
          to: carl.pkh,
          value: 1,
        },
        as: bob.pkh,
      });
    }, errors.LEDGER_NOT_FOUND);
  })

  it('Transfer from = caller with insufficient balance should failed', async () => {
    await expectToThrow(async () => {
      await fa1_2.transfer({
        arg: {
          from: alice.pkh,
          to: bob.pkh,
          value: (total_supply + 1),
        },
        as: alice.pkh,
      });
    }, errors.NOT_ENOUGH_BALANCE);
  })

  it('Transfer from = call with sufficient balance should succeed', async () => {
    const v = (total_supply / 5);
    await fa1_2.transfer({
      arg: {
        from: alice.pkh,
        to: bob.pkh,
        value: v,
      },
      as: alice.pkh,
    });

    const alice_balance = await getBalance(fa1_2, alice.pkh);
    assert(alice_balance == (total_supply - v).toString());

    const bob_balance = await getBalance(fa1_2, bob.pkh);
    assert(bob_balance == v.toString());
  })

})


describe('[FA1_2] Allowance ', async () => {
  it('Approve known caller with 0 spender allowance should succeed', async () => {
    await fa1_2.approve({
      arg: {
        spender: carl.pkh,
        value: 0,
      },
      as: bob.pkh,
    })

  })

  it('Approve unknown caller should succeed', async () => {
    await fa1_2.approve({
      arg: {
        spender: carl.pkh,
        value: 0,
      },
      as: user1.pkh,
    })
  })

  it('Approve known caller with positive spender allowance should failed', async () => {
    await fa1_2.approve({
      arg: {
        spender: carl.pkh,
        value: 100,
      },
      as: bob.pkh,
    })
  })

  it('Approve 0 allowance known caller with positive spender allowance should succeed', async () => {
    await fa1_2.approve({
      arg: {
        spender: carl.pkh,
        value: 0,
      },
      as: bob.pkh,
    })
  })

})

describe('[FA1_2] Allowance and Transfer ', async () => {

  it('Approve and transfer known caller with 0 spender allowance should succeed', async () => {
    const alice_balance_before = await getBalance(fa1_2, alice.pkh);
    const bob_balance_before = await getBalance(fa1_2, bob.pkh);
    const v = 100;

    await fa1_2.approve({
      arg: {
        spender: carl.pkh,
        value: v,
      },
      as: alice.pkh,
    })

    await fa1_2.transfer({
      arg: {
        from: alice.pkh,
        to: bob.pkh,
        value: v,
      },
      as: carl.pkh,
    });

    const alice_balance = await getBalance(fa1_2, alice.pkh);
    assert(alice_balance == (parseInt(alice_balance_before) - v).toString());

    const bob_balance = await getBalance(fa1_2, bob.pkh);
    assert(bob_balance == (parseInt(bob_balance_before) + v).toString());
  })

})

describe('[FA1_2] Getters', async () => {

  it('Check getAllowance values', async () => {
  })

  it('Check getBalance values', async () => {
    const alice_balance = await getBalance(fa1_2, alice.pkh);

    const value = await runGetter("getBalance", fa1_2.address, { argMichelson: `"${alice.pkh}"`, as: alice.pkh })
    assert(value === alice_balance.toString(), "Invalid value for getBalance")
  })

  it('Check getTotalSupply value', async () => {
    const value = await runGetter("getTotalSupply", fa1_2.address, { argMichelson: 'Unit', as: alice.pkh })
    assert(value === total_supply.toString(), "Invalid value for getTotalSupply")
  })
})
