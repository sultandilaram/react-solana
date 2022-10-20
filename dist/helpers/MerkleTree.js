import * as anchor from "@project-serum/anchor";
import { keccak_256 } from "js-sha3";
export class MerkleTree {
  constructor(leafs) {
    this.leafs = leafs.slice();
    this.layers = [];
    let hashes = this.leafs.map(MerkleTree.nodeHash);

    while (hashes.length > 0) {
      this.layers.push(hashes.slice());
      if (hashes.length === 1) break;
      hashes = hashes.reduce((acc, cur, idx, arr) => {
        if (idx % 2 === 0) {
          const nxt = arr[idx + 1];
          acc.push(MerkleTree.internalHash(cur, nxt));
        }

        return acc;
      }, Array());
    }
  }

  static nodeHash(data) {
    //@ts-ignore
    return Buffer.from(keccak_256.digest([0x00, ...data]));
  }

  static internalHash(first, second) {
    if (!second) return first;
    const [fst, snd] = [first, second].sort(Buffer.compare); //@ts-ignore

    return Buffer.from(keccak_256.digest([0x01, ...fst, ...snd]));
  }

  getRoot() {
    return this.layers[this.layers.length - 1][0];
  }

  getRootArray() {
    let arr = []; //@ts-ignore

    for (let v of this.getRoot().values()) {
      arr.push(v);
    }

    return arr;
  }

  getProof(idx) {
    return this.layers.reduce((proof, layer) => {
      const sibling = idx ^ 1;

      if (sibling < layer.length) {
        proof.push(layer[sibling]);
      }

      idx = Math.floor(idx / 2);
      return proof;
    }, []);
  }

  getProofArray(index) {
    let res = [];

    for (let e of this.getProof(index)) {
      let arr = []; //@ts-ignore

      for (let v of e.values()) {
        arr.push(v);
      } //@ts-ignore


      res.push(arr);
    }

    return res;
  }

  getHexRoot() {
    return this.getRoot().toString("hex");
  }

  getHexProof(idx) {
    return this.getProof(idx).map(el => el.toString("hex"));
  }

  verifyProof(idx, proof, root) {
    let pair = MerkleTree.nodeHash(this.leafs[idx]);

    for (const item of proof) {
      pair = MerkleTree.internalHash(pair, item);
    }

    return pair.equals(root);
  }

  static verifyClaim(leaf, proof, root) {
    let pair = MerkleTree.nodeHash(leaf);

    for (const item of proof) {
      pair = MerkleTree.internalHash(pair, item);
    }

    return pair.equals(root);
  }

}
export const buildLeaves = data => {
  const leaves = [];

  for (let idx = 0; idx < data.length; ++idx) {
    const animal = data[idx];
    leaves.push(Buffer.from([//@ts-ignore
    ...animal.mint.toBuffer(), ...new anchor.BN(animal.emissionsPerDay).toArray("le", 8), ...new anchor.BN(animal.faction).toArray("le", 8)]));
  }

  return leaves;
};