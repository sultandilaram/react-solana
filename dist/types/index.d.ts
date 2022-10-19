import * as web3 from "@solana/web3.js";
export declare enum SolanaNetwork {
    Devnet = "devnet",
    Testnet = "testnet",
    Mainnet = "mainnet-beta"
}
export declare type RPC = {
    name: string;
    url: string;
};
export interface Config<T = unknown> {
    network: SolanaNetwork;
    RPC_List: RPC[];
    custom?: T;
}
export interface TxSigners {
    tx: web3.Transaction;
    signers: web3.Signer[];
}
