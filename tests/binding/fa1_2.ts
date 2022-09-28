import * as ex from "@completium/experiment-ts";
export type ledger_key = ex.Address;
export type token_metadata_key = ex.Nat;
export const ledger_key_mich_type: ex.MichelineType = ex.prim_annot_to_mich_type("address", []);
export const token_metadata_key_mich_type: ex.MichelineType = ex.prim_annot_to_mich_type("nat", []);
export class ledger_value implements ex.ArchetypeType {
    constructor(public tokens: ex.Nat, public allowance: Array<[
        ex.Address,
        ex.Nat
    ]>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.tokens.to_mich(), ex.list_to_mich(this.allowance, x => {
                const x_key = x[0];
                const x_value = x[1];
                return ex.elt_to_mich(x_key.to_mich(), x_value.to_mich());
            })]);
    }
    equals(v: ledger_value): boolean {
        return (this.tokens.equals(v.tokens) && this.tokens.equals(v.tokens) && JSON.stringify(this.allowance) == JSON.stringify(v.allowance));
    }
}
export class token_metadata_value implements ex.ArchetypeType {
    constructor(public token_id: ex.Nat, public token_info: Array<[
        string,
        ex.Bytes
    ]>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.token_id.to_mich(), ex.list_to_mich(this.token_info, x => {
                const x_key = x[0];
                const x_value = x[1];
                return ex.elt_to_mich(ex.string_to_mich(x_key), x_value.to_mich());
            })]);
    }
    equals(v: token_metadata_value): boolean {
        return (this.token_id.equals(v.token_id) && this.token_id.equals(v.token_id) && JSON.stringify(this.token_info) == JSON.stringify(v.token_info));
    }
}
export const ledger_value_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("nat", ["%tokens"]),
    ex.pair_to_mich_type("map", ex.prim_annot_to_mich_type("address", []), ex.prim_annot_to_mich_type("nat", []))
], []);
export const token_metadata_value_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("nat", ["%token_id"]),
    ex.pair_to_mich_type("map", ex.prim_annot_to_mich_type("string", []), ex.prim_annot_to_mich_type("bytes", []))
], []);
export const mich_to_ledger_value = (v: ex.Micheline, collapsed: boolean = false): ledger_value => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, ledger_value_mich_type);
    }
    return new ledger_value(ex.mich_to_nat(fields[0]), ex.mich_to_map(fields[1], (x, y) => [ex.mich_to_address(x), ex.mich_to_nat(y)]));
};
export const mich_to_token_metadata_value = (v: ex.Micheline, collapsed: boolean = false): token_metadata_value => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, token_metadata_value_mich_type);
    }
    return new token_metadata_value(ex.mich_to_nat(fields[0]), ex.mich_to_map(fields[1], (x, y) => [ex.mich_to_string(x), ex.mich_to_bytes(y)]));
};
export type ledger_container = Array<[
    ledger_key,
    ledger_value
]>;
export type token_metadata_container = Array<[
    token_metadata_key,
    token_metadata_value
]>;
export const ledger_container_mich_type: ex.MichelineType = ex.pair_to_mich_type("big_map", ex.prim_annot_to_mich_type("address", []), ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("nat", ["%tokens"]),
    ex.pair_to_mich_type("map", ex.prim_annot_to_mich_type("address", []), ex.prim_annot_to_mich_type("nat", []))
], []));
export const token_metadata_container_mich_type: ex.MichelineType = ex.pair_to_mich_type("big_map", ex.prim_annot_to_mich_type("nat", []), ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("nat", ["%token_id"]),
    ex.pair_to_mich_type("map", ex.prim_annot_to_mich_type("string", []), ex.prim_annot_to_mich_type("bytes", []))
], []));
const set_token_metadata_arg_to_mich = (tid: ex.Nat, tdata: Array<[
    string,
    ex.Bytes
]>): ex.Micheline => {
    return ex.pair_to_mich([
        tid.to_mich(),
        ex.list_to_mich(tdata, x => {
            const x_key = x[0];
            const x_value = x[1];
            return ex.elt_to_mich(ex.string_to_mich(x_key), x_value.to_mich());
        })
    ]);
}
const transfer_arg_to_mich = (from: ex.Address, to: ex.Address, value: ex.Nat): ex.Micheline => {
    return ex.pair_to_mich([
        from.to_mich(),
        to.to_mich(),
        value.to_mich()
    ]);
}
const approve_arg_to_mich = (spender: ex.Address, value: ex.Nat): ex.Micheline => {
    return ex.pair_to_mich([
        spender.to_mich(),
        value.to_mich()
    ]);
}
const getAllowance_arg_to_mich = (owner: ex.Address, spender: ex.Address): ex.Micheline => {
    return ex.pair_to_mich([
        owner.to_mich(),
        spender.to_mich()
    ]);
}
const getBalance_arg_to_mich = (owner: ex.Address): ex.Micheline => {
    return owner.to_mich();
}
const getTotalSupply_arg_to_mich = (): ex.Micheline => {
    return ex.unit_mich;
}
export const deploy_getAllowance_callback = async (): Promise<string> => {
    return await ex.deploy_callback("getAllowance", ex.prim_annot_to_mich_type("nat", []));
};
export const deploy_getBalance_callback = async (): Promise<string> => {
    return await ex.deploy_callback("getBalance", ex.prim_annot_to_mich_type("nat", []));
};
export const deploy_getTotalSupply_callback = async (): Promise<string> => {
    return await ex.deploy_callback("getTotalSupply", ex.prim_annot_to_mich_type("nat", []));
};
export class Fa1_2 {
    address: string | undefined;
    getAllowance_callback_address: string | undefined;
    getBalance_callback_address: string | undefined;
    getTotalSupply_callback_address: string | undefined;
    get_address(): ex.Address {
        if (undefined != this.address) {
            return new ex.Address(this.address);
        }
        throw new Error("Contract not initialised");
    }
    async get_balance(): Promise<ex.Tez> {
        if (null != this.address) {
            return await ex.get_balance(new ex.Address(this.address));
        }
        throw new Error("Contract not initialised");
    }
    async deploy(initial_holder: ex.Address, total_supply: ex.Nat, metadata_coin: ex.Bytes, params: Partial<ex.Parameters>) {
        const address = await ex.deploy("./contracts/fa1_2.arl", {
            initial_holder: initial_holder.to_mich(),
            total_supply: total_supply.to_mich(),
            metadata_coin: metadata_coin.to_mich()
        }, params);
        this.address = address;
        this.getAllowance_callback_address = await deploy_getAllowance_callback();
        this.getBalance_callback_address = await deploy_getBalance_callback();
        this.getTotalSupply_callback_address = await deploy_getTotalSupply_callback();
    }
    async set_token_metadata(tid: ex.Nat, tdata: Array<[
        string,
        ex.Bytes
    ]>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_token_metadata", set_token_metadata_arg_to_mich(tid, tdata), params);
        }
        throw new Error("Contract not initialised");
    }
    async transfer(from: ex.Address, to: ex.Address, value: ex.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "transfer", transfer_arg_to_mich(from, to, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async approve(spender: ex.Address, value: ex.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "approve", approve_arg_to_mich(spender, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_token_metadata_param(tid: ex.Nat, tdata: Array<[
        string,
        ex.Bytes
    ]>, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_token_metadata", set_token_metadata_arg_to_mich(tid, tdata), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_transfer_param(from: ex.Address, to: ex.Address, value: ex.Nat, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "transfer", transfer_arg_to_mich(from, to, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_approve_param(spender: ex.Address, value: ex.Nat, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "approve", approve_arg_to_mich(spender, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async getAllowance(owner: ex.Address, spender: ex.Address, params: Partial<ex.Parameters>): Promise<ex.Nat> {
        if (this.address != undefined) {
            if (this.getAllowance_callback_address != undefined) {
                const entrypoint = new ex.Entrypoint(new ex.Address(this.getAllowance_callback_address), "callback");
                await ex.call(this.address, "getAllowance", ex.getter_args_to_mich(getAllowance_arg_to_mich(owner, spender), entrypoint), params);
                return await ex.get_callback_value<ex.Nat>(this.getAllowance_callback_address, x => { return new ex.Nat(x); });
            }
        }
        throw new Error("Contract not initialised");
    }
    async getBalance(owner: ex.Address, params: Partial<ex.Parameters>): Promise<ex.Nat> {
        if (this.address != undefined) {
            if (this.getBalance_callback_address != undefined) {
                const entrypoint = new ex.Entrypoint(new ex.Address(this.getBalance_callback_address), "callback");
                await ex.call(this.address, "getBalance", ex.getter_args_to_mich(getBalance_arg_to_mich(owner), entrypoint), params);
                return await ex.get_callback_value<ex.Nat>(this.getBalance_callback_address, x => { return new ex.Nat(x); });
            }
        }
        throw new Error("Contract not initialised");
    }
    async getTotalSupply(params: Partial<ex.Parameters>): Promise<ex.Nat> {
        if (this.address != undefined) {
            if (this.getTotalSupply_callback_address != undefined) {
                const entrypoint = new ex.Entrypoint(new ex.Address(this.getTotalSupply_callback_address), "callback");
                await ex.call(this.address, "getTotalSupply", ex.getter_args_to_mich(getTotalSupply_arg_to_mich(), entrypoint), params);
                return await ex.get_callback_value<ex.Nat>(this.getTotalSupply_callback_address, x => { return new ex.Nat(x); });
            }
        }
        throw new Error("Contract not initialised");
    }
    async get_ledger_value(key: ledger_key): Promise<ledger_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.ledger), key.to_mich(), ledger_key_mich_type);
            if (data != undefined) {
                return mich_to_ledger_value(data, true);
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
            const data = await ex.get_big_map_value(BigInt(storage.ledger), key.to_mich(), ledger_key_mich_type);
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
            const data = await ex.get_big_map_value(BigInt(storage.token_metadata), key.to_mich(), token_metadata_key_mich_type);
            if (data != undefined) {
                return mich_to_token_metadata_value(data, true);
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
            const data = await ex.get_big_map_value(BigInt(storage.token_metadata), key.to_mich(), token_metadata_key_mich_type);
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
        r1: ex.string_to_mich("\"NotEnoughBalance\""),
        INVALID_CALLER: ex.string_to_mich("\"INVALID_CALLER\"")
    };
}
export const fa1_2 = new Fa1_2();
