import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
export type ledger_key = att.Address;
export type token_metadata_key = att.Nat;
export const ledger_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("address", []);
export const token_metadata_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("nat", []);
export class ledger_value implements att.ArchetypeType {
    constructor(public tokens: att.Nat, public allowance: Array<[
        att.Address,
        att.Nat
    ]>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.tokens.to_mich(), att.list_to_mich(this.allowance, x => {
                const x_key = x[0];
                const x_value = x[1];
                return att.elt_to_mich(x_key.to_mich(), x_value.to_mich());
            })]);
    }
    equals(v: ledger_value): boolean {
        return (this.tokens.equals(v.tokens) && this.tokens.equals(v.tokens) && JSON.stringify(this.allowance) == JSON.stringify(v.allowance));
    }
}
export class token_metadata_value implements att.ArchetypeType {
    constructor(public token_id: att.Nat, public token_info: Array<[
        string,
        att.Bytes
    ]>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.token_id.to_mich(), att.list_to_mich(this.token_info, x => {
                const x_key = x[0];
                const x_value = x[1];
                return att.elt_to_mich(att.string_to_mich(x_key), x_value.to_mich());
            })]);
    }
    equals(v: token_metadata_value): boolean {
        return (this.token_id.equals(v.token_id) && this.token_id.equals(v.token_id) && JSON.stringify(this.token_info) == JSON.stringify(v.token_info));
    }
}
export const ledger_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("nat", ["%tokens"]),
    att.pair_annot_to_mich_type("map", att.prim_annot_to_mich_type("address", []), att.prim_annot_to_mich_type("nat", []), ["%allowance"])
], []);
export const token_metadata_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("nat", ["%token_id"]),
    att.pair_annot_to_mich_type("map", att.prim_annot_to_mich_type("string", []), att.prim_annot_to_mich_type("bytes", []), ["%token_info"])
], []);
export type ledger_container = Array<[
    ledger_key,
    ledger_value
]>;
export type token_metadata_container = Array<[
    token_metadata_key,
    token_metadata_value
]>;
export const ledger_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("big_map", att.prim_annot_to_mich_type("address", []), att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("nat", ["%tokens"]),
    att.pair_annot_to_mich_type("map", att.prim_annot_to_mich_type("address", []), att.prim_annot_to_mich_type("nat", []), ["%allowance"])
], []), []);
export const token_metadata_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("big_map", att.prim_annot_to_mich_type("nat", []), att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("nat", ["%token_id"]),
    att.pair_annot_to_mich_type("map", att.prim_annot_to_mich_type("string", []), att.prim_annot_to_mich_type("bytes", []), ["%token_info"])
], []), []);
const set_token_metadata_arg_to_mich = (tid: att.Nat, tdata: Array<[
    string,
    att.Bytes
]>): att.Micheline => {
    return att.pair_to_mich([
        tid.to_mich(),
        att.list_to_mich(tdata, x => {
            const x_key = x[0];
            const x_value = x[1];
            return att.elt_to_mich(att.string_to_mich(x_key), x_value.to_mich());
        })
    ]);
}
const transfer_arg_to_mich = (from: att.Address, to: att.Address, value: att.Nat): att.Micheline => {
    return att.pair_to_mich([
        from.to_mich(),
        to.to_mich(),
        value.to_mich()
    ]);
}
const approve_arg_to_mich = (spender: att.Address, value: att.Nat): att.Micheline => {
    return att.pair_to_mich([
        spender.to_mich(),
        value.to_mich()
    ]);
}
const getAllowance_arg_to_mich = (owner: att.Address, spender: att.Address): att.Micheline => {
    return att.pair_to_mich([
        owner.to_mich(),
        spender.to_mich()
    ]);
}
const getBalance_arg_to_mich = (owner: att.Address): att.Micheline => {
    return owner.to_mich();
}
const getTotalSupply_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
export const deploy_getAllowance_callback = async (params: Partial<ex.Parameters>): Promise<att.DeployResult> => {
    return await ex.deploy_callback("getAllowance", att.prim_annot_to_mich_type("nat", []), params);
};
export const deploy_getBalance_callback = async (params: Partial<ex.Parameters>): Promise<att.DeployResult> => {
    return await ex.deploy_callback("getBalance", att.prim_annot_to_mich_type("nat", []), params);
};
export const deploy_getTotalSupply_callback = async (params: Partial<ex.Parameters>): Promise<att.DeployResult> => {
    return await ex.deploy_callback("getTotalSupply", att.prim_annot_to_mich_type("nat", []), params);
};
export class Fa1_2 {
    address: string | undefined;
    constructor(address: string | undefined = undefined) {
        this.address = address;
    }
    getAllowance_callback_address: string | undefined;
    getBalance_callback_address: string | undefined;
    getTotalSupply_callback_address: string | undefined;
    get_address(): att.Address {
        if (undefined != this.address) {
            return new att.Address(this.address);
        }
        throw new Error("Contract not initialised");
    }
    async get_balance(): Promise<att.Tez> {
        if (null != this.address) {
            return await ex.get_balance(new att.Address(this.address));
        }
        throw new Error("Contract not initialised");
    }
    async deploy(initial_holder: att.Address, total_supply: att.Nat, metadata_coin: att.Bytes, params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./contracts/fa1_2.arl", {
            initial_holder: initial_holder.to_mich(),
            total_supply: total_supply.to_mich(),
            metadata_coin: metadata_coin.to_mich()
        }, params)).address;
        this.address = address;
        this.getAllowance_callback_address = (await deploy_getAllowance_callback(params)).address;
        this.getBalance_callback_address = (await deploy_getBalance_callback(params)).address;
        this.getTotalSupply_callback_address = (await deploy_getTotalSupply_callback(params)).address;
    }
    async set_token_metadata(tid: att.Nat, tdata: Array<[
        string,
        att.Bytes
    ]>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_token_metadata", set_token_metadata_arg_to_mich(tid, tdata), params);
        }
        throw new Error("Contract not initialised");
    }
    async transfer(from: att.Address, to: att.Address, value: att.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "transfer", transfer_arg_to_mich(from, to, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async approve(spender: att.Address, value: att.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "approve", approve_arg_to_mich(spender, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_token_metadata_param(tid: att.Nat, tdata: Array<[
        string,
        att.Bytes
    ]>, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_token_metadata", set_token_metadata_arg_to_mich(tid, tdata), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_transfer_param(from: att.Address, to: att.Address, value: att.Nat, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "transfer", transfer_arg_to_mich(from, to, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_approve_param(spender: att.Address, value: att.Nat, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "approve", approve_arg_to_mich(spender, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async getAllowance(owner: att.Address, spender: att.Address, params: Partial<ex.Parameters>): Promise<att.Nat> {
        if (this.address != undefined) {
            if (this.getAllowance_callback_address != undefined) {
                const entrypoint = new att.Entrypoint(new att.Address(this.getAllowance_callback_address), "callback");
                await ex.call(this.address, "getAllowance", att.getter_args_to_mich(getAllowance_arg_to_mich(owner, spender), entrypoint), params);
                return await ex.get_callback_value<att.Nat>(this.getAllowance_callback_address, x => { return new att.Nat(x); });
            }
        }
        throw new Error("Contract not initialised");
    }
    async getBalance(owner: att.Address, params: Partial<ex.Parameters>): Promise<att.Nat> {
        if (this.address != undefined) {
            if (this.getBalance_callback_address != undefined) {
                const entrypoint = new att.Entrypoint(new att.Address(this.getBalance_callback_address), "callback");
                await ex.call(this.address, "getBalance", att.getter_args_to_mich(getBalance_arg_to_mich(owner), entrypoint), params);
                return await ex.get_callback_value<att.Nat>(this.getBalance_callback_address, x => { return new att.Nat(x); });
            }
        }
        throw new Error("Contract not initialised");
    }
    async getTotalSupply(params: Partial<ex.Parameters>): Promise<att.Nat> {
        if (this.address != undefined) {
            if (this.getTotalSupply_callback_address != undefined) {
                const entrypoint = new att.Entrypoint(new att.Address(this.getTotalSupply_callback_address), "callback");
                await ex.call(this.address, "getTotalSupply", att.getter_args_to_mich(getTotalSupply_arg_to_mich(), entrypoint), params);
                return await ex.get_callback_value<att.Nat>(this.getTotalSupply_callback_address, x => { return new att.Nat(x); });
            }
        }
        throw new Error("Contract not initialised");
    }
    async get_ledger_value(key: ledger_key): Promise<ledger_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.ledger), key.to_mich(), ledger_key_mich_type, ledger_value_mich_type), collapsed = true;
            if (data != undefined) {
                return new ledger_value((x => { return new att.Nat(x); })(data.tokens), (x => { let res: Array<[
                    att.Address,
                    att.Nat
                ]> = []; for (let e of x.entries()) {
                    res.push([(x => { return new att.Address(x); })(e[0]), (x => { return new att.Nat(x); })(e[1])]);
                } return res; })(data.allowance));
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_ledger_value(key: ledger_key): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.ledger), key.to_mich(), ledger_key_mich_type, ledger_value_mich_type), collapsed = true;
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    async get_token_metadata_value(key: token_metadata_key): Promise<token_metadata_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.token_metadata), key.to_mich(), token_metadata_key_mich_type, token_metadata_value_mich_type), collapsed = true;
            if (data != undefined) {
                return new token_metadata_value((x => { return new att.Nat(x); })(data.token_id), (x => { let res: Array<[
                    string,
                    att.Bytes
                ]> = []; for (let e of x.entries()) {
                    res.push([(x => { return x; })(e[0]), (x => { return new att.Bytes(x); })(e[1])]);
                } return res; })(data.token_info));
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_token_metadata_value(key: token_metadata_key): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.token_metadata), key.to_mich(), token_metadata_key_mich_type, token_metadata_value_mich_type), collapsed = true;
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        r1: att.string_to_mich("\"NotEnoughBalance\""),
        INVALID_CALLER: att.string_to_mich("\"INVALID_CALLER\"")
    };
}
export const fa1_2 = new Fa1_2();
