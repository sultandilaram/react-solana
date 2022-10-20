import * as web3 from "@solana/web3.js";
import { MetadataJson } from "@metaplex/js";
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
export declare type StaticNFTMetadata = {
    metadata: {
        name: string;
        symbol: string;
        uri: string;
        seller_fee_basis_points: number;
        creators: {
            address: string;
            share: number;
        }[];
    };
    arweave: MetadataJson;
    mint: string;
    emissionsPerDay: number;
    emissionsPerWeek?: number;
    faction: string;
};
export * from "./staking";
export * from "./StakingProgram";
