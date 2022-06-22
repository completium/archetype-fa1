const { isMockup, getValueFromBigMap, exprMichelineToJson, packTyped, blake2b, sign, keccak } = require('@completium/completium-cli');
const { BigNumber } = require('bignumber.js');
const assert = require('assert');

async function getLedger(fa1, pkh) {
  const storage = await fa1.getStorage();
  return await getValueFromBigMap(
    parseInt(storage),
    exprMichelineToJson(`"${pkh}"`),
    exprMichelineToJson(`address`)
  )
}

exports.getBalance = async (fa1, pkh) => {
  const v = await getLedger(fa1, pkh);
  return v != null && v.args !== undefined && v.args.length > 0 && v.args[0].int !== undefined ? v.args[0].int : '0';
}

exports.getAllowance = async (fa1, pkh, spender) => {
  const v = await getLedger(fa1, pkh);
  console.log(JSON.stringify(0, 2, v.args[1]))
  return v != null ? v.args[1] : '0';
}

exports.getBalance = async (fa1, pkh, spender) => {
  const storage = await fa1.getStorage();
  const balance = await getValueFromBigMap(
    parseInt(storage),
    exprMichelineToJson(`"${pkh}"`),
    exprMichelineToJson(`address`)
  );
  return balance != null && balance.args !== undefined && balance.args.length > 0 && balance.args[0].int !== undefined ? balance.args[0].int : '0';
}

exports.errors = {
  CALLER_NOT_OWNER: '"CALLER_NOT_OWNER"',
  NOT_ENOUGH_BALANCE: '"NotEnoughBalance"',
  NOT_ENOUGH_ALLOWANCE: '"NotEnoughAllowance"',
  UNSAFE_ALLOWANCE_CHANGE: '"UnsafeAllowanceChange"',
  LEDGER_NOT_FOUND: '(Pair "ASSET_NOT_FOUND" "ledger")',
}
