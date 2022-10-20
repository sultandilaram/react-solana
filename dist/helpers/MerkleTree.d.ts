/// <reference types="node" />
import * as anchor from "@project-serum/anchor";
export declare class MerkleTree {
    leafs: Array<Buffer>;
    layers: Array<Array<Buffer>>;
    constructor(leafs: Array<Buffer>);
    static nodeHash(data: Buffer): Buffer;
    static internalHash(first: Buffer, second: Buffer | undefined): Buffer;
    getRoot(): Buffer;
    getRootArray(): number[];
    getProof(idx: number): Buffer[];
    getProofArray(index: number): number[][];
    getHexRoot(): string;
    getHexProof(idx: number): string[];
    verifyProof(idx: number, proof: Buffer[], root: Buffer): boolean;
    static verifyClaim(leaf: Buffer, proof: Buffer[], root: Buffer): boolean;
}
export declare const buildLeaves: (data: {
    mint: anchor.web3.PublicKey;
    emissionsPerDay: number;
    faction: number;
}[]) => Buffer[];
