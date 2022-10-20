import React from "react";
import * as web3 from "@solana/web3.js";
import { NFT, SolanaNetwork, StakingProject } from "../types";
export interface IConfigContext<T = unknown> {
    network: SolanaNetwork;
    rpc_url: string;
    custom?: T;
    setRpc: (name: string | String) => void;
    getRpcName: () => string;
    setCustom: React.Dispatch<T>;
}
export declare const ConfigContext: React.Context<IConfigContext<unknown> | undefined>;
export interface IStakingContext {
    status: {
        project: boolean;
        availableNFTs: boolean;
        stakedNFTs: boolean;
    };
    project: StakingProject | undefined;
    availableNFTs: NFT[];
    stakedNFTs: NFT[];
    fetchAnimal: (mint: web3.PublicKey) => Promise<NFT>;
    getRewards: (nft: NFT, end: Date) => number;
    getAllRewards: (end: Date) => number;
    stake: (...nfts: NFT[]) => void;
    stakeSingle: (nft: NFT) => void;
    stakeAll: () => void;
    claim: (...nfts: NFT[]) => void;
    claimSingle: (nft: NFT) => void;
    claimAll: () => void;
    unstake: (...nfts: NFT[]) => void;
    unstakeSingle: (nft: NFT) => void;
    unstakeAll: () => void;
}
export declare const StakingContext: React.Context<IStakingContext | undefined>;
