import React from 'react';
import * as anchor from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";
import { MerkleTree } from '../helpers';
import { StakingProgram, StaticNFTMetadata } from '../types';
interface StakingProviderProps {
    children: React.ReactNode;
    stakingProjectKey?: web3.PublicKey;
    stakingProjectAddress?: web3.PublicKey;
    program: anchor.Program<StakingProgram> | undefined;
    metadata: StaticNFTMetadata[];
    factionToNumber: (faction: string) => number;
    createMerkleTree?: () => MerkleTree;
}
export default function StakingProvider(props: StakingProviderProps): JSX.Element;
export {};
