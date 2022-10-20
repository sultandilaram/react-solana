import React from 'react';
import * as web3 from "@solana/web3.js";
import { MerkleTree } from '../helpers';
import { StaticNFTMetadata } from '../types';
interface StakingProviderProps {
    children: React.ReactNode;
    stakingProjectKey?: web3.PublicKey;
    stakingProjectAddress?: web3.PublicKey;
    stakingProgramAddress: web3.PublicKey;
    metadata: StaticNFTMetadata[];
    factionToNumber: (faction: string) => number;
    createMerkleTree?: () => MerkleTree;
}
export default function StakingProvider(props: StakingProviderProps): JSX.Element;
export {};
