import { web3 } from "@project-serum/anchor";
import { MetadataJson } from ".";
export interface StakingProject {
    address: web3.PublicKey;
    key: web3.PublicKey;
    owner: web3.PublicKey;
    escrow: web3.PublicKey;
    rewardMint: web3.PublicKey;
    vault: web3.PublicKey;
    staked: number;
    maximumRarity: number;
    maximumRarityMultiplier: number;
    baseWeeklyEmissions: number;
    root: number[];
}
export interface StakerInfo {
    rewardsNfts: number;
    multiplierNfts: number;
}
export interface NFT {
    address?: web3.PublicKey;
    mint: web3.PublicKey;
    uriData: any;
    metadata: MetadataJson;
    emissionsPerDay: number;
    emissionsPerWeek?: number;
    faction: string;
    lastClaim?: Date;
}
