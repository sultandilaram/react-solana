import React from 'react'
import * as anchor from "@project-serum/anchor"
import * as web3 from "@solana/web3.js"
import * as token from "@solana/spl-token";
import { buildLeaves, MerkleTree } from '../helpers';
import { useProvider } from '../hooks';
import { NFT, StakingProgram, StakingProgramIDL, StakingProject, StaticNFTMetadata, TxSigners } from '../types';
import { StakingContext } from './contexts';

interface StakingProviderProps {
  children: React.ReactNode
  stakingProjectKey?: web3.PublicKey,
  stakingProjectAddress?: web3.PublicKey,
  stakingProgramAddress: web3.PublicKey,
  metadata: StaticNFTMetadata[],
  factionToNumber: (faction: string) => number,
  createMerkleTree?: () => MerkleTree
}
export default function StakingProvider(props: StakingProviderProps) {
  /// Deps
  const provider = useProvider();

  /// States
  const [status, setStatus] = React.useState({
    project: false,
    availableNFTs: false,
    stakedNFTs: false
  })

  const [project, setProject] = React.useState<StakingProject>();
  const [availableNFTs, setAvailableNFTs] = React.useState<NFT[]>([]);
  const [stakedNFTs, setStakedNFTs] = React.useState<NFT[]>([]);

  const program = React.useMemo(() => {
    if (!provider.provider) return;
    return new anchor.Program<StakingProgram>(StakingProgramIDL, props.stakingProgramAddress, provider.provider)
  }, [provider.provider])

  const tree = React.useMemo(() => {
    if (props.createMerkleTree) {
      return props.createMerkleTree();
    }

    const leaves = buildLeaves(
      props.metadata.map((e, i) => ({
        mint: new web3.PublicKey(e.mint),
        emissionsPerDay: e.emissionsPerDay,
        faction: props.factionToNumber(e.faction),
      }))
    );
    return new MerkleTree(leaves)
  }, [props.metadata]);

  /// Methods
  const fetchProject = React.useCallback(async (): Promise<StakingProject> => {
    if (!program) throw new Error("Program not loaded");

    let projectAddress = props.stakingProjectAddress;
    if (props.stakingProjectKey) {
      projectAddress = (await web3.PublicKey.findProgramAddress(
        [Buffer.from('jungle'), props.stakingProjectKey.toBuffer()],
        program.programId
      ))[0];
    }

    if (!projectAddress) throw new Error("Project Key/Address is not provided")

    const fetchedProject = await program.account.jungle.fetch(projectAddress);
    return {
      address: projectAddress,
      key: fetchedProject.key,
      owner: fetchedProject.owner,
      escrow: fetchedProject.escrow,
      rewardMint: fetchedProject.mint,
      vault: fetchedProject.rewardsAccount,
      staked: fetchedProject.animalsStaked.toNumber(),
      maximumRarity: fetchedProject.maximumRarity.toNumber(),
      maximumRarityMultiplier: fetchedProject.maximumRarityMultiplier.toNumber(),
      baseWeeklyEmissions: fetchedProject.baseWeeklyEmissions.toNumber(),
      root: fetchedProject.root,
    };
  }, [program]);

  const fetchAvailableNFTs = React.useCallback(async (wallet: web3.PublicKey): Promise<NFT[]> => {

    const owned = (
      await provider.connection.getParsedTokenAccountsByOwner(wallet, {
        programId: token.TOKEN_PROGRAM_ID,
      })
    ).value
      .filter(token => parseInt(token.account.data.parsed.info.tokenAmount.amount) > 0)
      .map(token => new web3.PublicKey(token.account.data.parsed.info.mint).toString());

    const collectionMints = props.metadata.map((e) => e.mint);

    const nfts = owned
      .filter((e) => collectionMints.includes(e))
      .map((e) => {
        const metadataItem = props.metadata.filter(
          (f) => f.mint === e
        )[0];
        return {
          mint: new web3.PublicKey(e),
          metadata: metadataItem.arweave,
          uriData: metadataItem.metadata,
          emissionsPerDay: metadataItem.emissionsPerDay,
          emissionsPerWeek: metadataItem.emissionsPerDay * 7,
          faction: metadataItem.faction,
        };
      })
      .sort((a, b) => {
        const na = Number(a.metadata.name.split('#')[1]);
        const nb = Number(b.metadata.name.split('#')[1]);
        return na - nb;
      });

    return nfts;
  }, []);

  const fetchStakedNFTs = React.useCallback(async (wallet: web3.PublicKey): Promise<NFT[]> => {
    if (!program) throw new Error("Program not loaded");

    const staked = await program.account.animal.all([
      {
        memcmp: {
          offset: 42,
          bytes: wallet.toString(),
        },
      },
    ]);
    const collectionMints = props.metadata.map((e) => e.mint);
    const data = staked
      .map((e) => e.account)
      .filter((e) => collectionMints.includes(e.mint.toString()))
      .map((e) => {
        const metadataItem = props.metadata.filter(
          (f) => f.mint === e.mint.toString()
        )[0];
        return {
          mint: e.mint,
          metadata: metadataItem.arweave,
          uriData: metadataItem.metadata,
          emissionsPerDay: metadataItem.emissionsPerDay,
          emissionsPerWeek: metadataItem.emissionsPerDay * 7,
          lastClaim: new Date(e.lastClaim.toNumber() * 1000),
          faction: metadataItem.faction,
        };
      })
      .sort((a, b) => {
        const na = Number(a.metadata?.name.split('#')[1] || '999999');
        const nb = Number(b.metadata?.name.split('#')[1] || '999999');
        return na - nb;
      });
    return data;
  }, [program]);

  const fetchNFT = React.useCallback(async (mint: web3.PublicKey): Promise<NFT> => {
    if (!program) throw new Error("Program not provided");

    const [animalAddress] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('nft'), mint.toBuffer()],
      program.programId
    );

    const metadataItem = props.metadata.filter(
      (e) => e.mint === mint.toString()
    )[0];
    try {
      const fetchedAnimal = await program.account.animal.fetch(animalAddress);
      return {
        mint: mint,
        metadata: metadataItem.arweave,
        uriData: metadataItem.metadata,
        emissionsPerDay: fetchedAnimal.emissionsPerDay.toNumber(),
        emissionsPerWeek: fetchedAnimal.emissionsPerDay.toNumber() * 7,
        faction: metadataItem.faction,
        lastClaim: new Date(fetchedAnimal.lastClaim.toNumber() * 1000),
      };
    } catch (err) {
      return {
        mint: mint,
        metadata: metadataItem.arweave,
        uriData: metadataItem.metadata,
        emissionsPerDay: metadataItem.emissionsPerDay,
        emissionsPerWeek: metadataItem.emissionsPerDay * 7,
        faction: metadataItem.faction,
      };
    }
  }, [program]);

  const getMultiplier = React.useCallback((nft: NFT): number => 1, [])

  const getRewards = React.useCallback((nft: NFT, end: Date) => {
    if (!nft.lastClaim || end < nft.lastClaim) return 0;

    const elapsed = (end.valueOf() - nft.lastClaim.valueOf()) / 1000;
    const pendingRewards =
      (parseFloat((nft.emissionsPerDay || nft.emissionsPerDay) as any) /
        86400) *
      elapsed;

    const multiplier = getMultiplier(nft);

    return pendingRewards / 10 ** 9 * multiplier;
  }, [getMultiplier]);

  const getAllRewards = React.useCallback((end: Date) => {
    if (!stakedNFTs.length) 0;

    return stakedNFTs
      .map((nft) => getRewards(nft, end))
      .reduce((sum, x) => sum + x)
  }, [stakedNFTs, getRewards])

  /// Load Data
  const loadNfts = React.useCallback(() => {
    if (!provider.wallet.publicKey) return;

    setStatus(x => ({ ...x, availableNFTs: true }))
    fetchAvailableNFTs(provider.wallet.publicKey)
      .then(setAvailableNFTs)
      .catch(e => console.error("Failed fetching wallet NFTs", e))
      .finally(() => setStatus(x => ({ ...x, availableNFTs: false })))

    setStatus(x => ({ ...x, stakedNFTs: true }))
    fetchStakedNFTs(provider.wallet.publicKey)
      .then(setStakedNFTs)
      .catch(e => console.error("Failed fetching staked NFTs", e))
      .finally(() => setStatus(x => ({ ...x, availableNFTs: false })))

  }, [provider.wallet.publicKey, fetchAvailableNFTs, fetchStakedNFTs, setStatus, setAvailableNFTs, setStakedNFTs])

  /// Effects
  React.useEffect(() => {
    setStatus(x => ({ ...x, project: true }))
    fetchProject()
      .then(setProject)
      .catch(e => console.error("Fetch project failed", e))
      .finally(() => setStatus(x => ({ ...x, project: false })))
  }, [fetchProject])

  React.useEffect(() => { loadNfts() }, [loadNfts])


  /// Transactions & Instructions
  // Stake Animal
  const createStakeTx = React.useCallback(async (nft: NFT, isFirst?: boolean): Promise<TxSigners> => {
    if (!program || !provider.wallet.publicKey || !project || !provider) throw new Error("Missing dependencies");

    const [nftAddress, nftBump] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('animal', 'utf8'), nft.mint.toBuffer()],
      program.programId
    );
    const [deposit, depositBump] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('deposit', 'utf8'), nft.mint.toBuffer()],
      program.programId
    );

    const stakerAccount = await token.getAssociatedTokenAddress(
      nft.mint,
      provider.wallet.publicKey
    );

    const instructions: web3.TransactionInstruction[] = [];

    if (isFirst) {
      try {
        await token.getAccount(provider.connection, stakerAccount);
      } catch (err) {
        instructions.push(
          token.createAssociatedTokenAccountInstruction(
            provider.wallet.publicKey,
            stakerAccount,
            provider.wallet.publicKey,
            nft.mint,
          )
        );
      }
    }

    const bumps = {
      animal: nftBump,
      deposit: depositBump,
    };

    const indexStaked = props.metadata.findIndex(
      (e) => e.mint === nft.mint.toString()
    );

    const tx = await program.methods.stakeAnimal(
      bumps,
      tree.getProofArray(indexStaked),
      new anchor.BN(nft.emissionsPerDay),
      new anchor.BN(props.factionToNumber(nft.faction))
    )
      .accounts({
        jungle: project.address,
        escrow: project.escrow,
        animal: nftAddress,
        staker: provider.wallet.publicKey,
        mint: nft.mint,
        stakerAccount: stakerAccount,
        depositAccount: deposit,
        tokenProgram: token.TOKEN_PROGRAM_ID,
        clock: web3.SYSVAR_CLOCK_PUBKEY,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
      })
      .preInstructions(instructions)
      .transaction()

    return {
      tx, signers: [] as web3.Signer[]
    }
  }, [program, project, tree, provider.wallet.publicKey])

  const stake = React.useCallback((...nfts: NFT[]) => {
    provider.sendInBatches(
      nfts,
      createStakeTx,
      loadNfts,
      10
    )
  }, [provider.sendInBatches, createStakeTx, loadNfts]);

  const stakeSingle = React.useCallback((nft: NFT) => { stake(nft) }, [stake]);

  const stakeAll = React.useCallback(() => { if (availableNFTs) stake(...availableNFTs) }, [stake, availableNFTs]);

  // Claim Rewards
  // It also creates all used account if they do not exist
  const createClaimTx = React.useCallback(async (nft: NFT, isFirst?: boolean): Promise<TxSigners> => {
    if (!program || !project || !provider.wallet.publicKey) throw new Error("Missing dependencies");

    const [rewardsAccount] = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from('rewards', 'utf8'),
        project.key.toBuffer(),
        project.rewardMint.toBuffer(),
      ],
      program.programId
    );
    const [nftAddress] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('animal', 'utf8'), nft.mint.toBuffer()],
      program.programId
    );

    const stakerAccount = await token.getAssociatedTokenAddress(
      project.rewardMint,
      provider.wallet.publicKey
    );

    const instructions: web3.TransactionInstruction[] = []

    if (isFirst) {
      try {
        await token.getAccount(provider.connection, stakerAccount);
      } catch {
        instructions.push(
          token.createAssociatedTokenAccountInstruction(
            provider.wallet.publicKey,
            stakerAccount,
            provider.wallet.publicKey,
            project.rewardMint,
          )
        )
      }
    }

    const tx = await program.methods.claimStaking()
      .accounts({
        jungle: project.address,
        escrow: project.escrow,
        animal: nftAddress,
        staker: provider.wallet.publicKey,
        mint: project.rewardMint,
        stakerAccount: stakerAccount,
        rewardsAccount: rewardsAccount,
        tokenProgram: token.TOKEN_PROGRAM_ID,
        clock: web3.SYSVAR_CLOCK_PUBKEY,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
      })
      .preInstructions(instructions)
      .transaction()

    return {
      tx, signers: [] as web3.Signer[]
    }
  }, [program, project, provider.wallet.publicKey]);

  const claim = React.useCallback((...nfts: NFT[]) => {
    provider.sendInBatches(
      nfts,
      createClaimTx,
      () => { },
      10
    )
  }, [provider.sendInBatches, createClaimTx]);

  const claimSingle = React.useCallback((nft: NFT) => { claim(nft) }, [claim]);

  const claimAll = React.useCallback(() => { if (stakedNFTs.length) claim(...stakedNFTs) }, [stakedNFTs, claim])

  // Unstakes an nft.
  // It also creates all used account if they do not exist and claims rewards
  const createUnstakeTx = React.useCallback(async (nft: NFT, isFirst?: boolean): Promise<TxSigners> => {
    if (!program || !project || !provider.wallet.publicKey) throw new Error("Missing dependencies");

    const [nftAddress] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('animal', 'utf8'), nft.mint.toBuffer()],
      program.programId
    );
    const [deposit] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('deposit', 'utf8'), nft.mint.toBuffer()],
      program.programId
    );

    const nftStakerAccount = await token.getAssociatedTokenAddress(
      nft.mint,
      provider.wallet.publicKey
    );

    const instructions: web3.TransactionInstruction[] = [];

    try {
      await token.getAccount(provider.connection, nftStakerAccount);
    } catch (err) {
      instructions.push(
        token.createAssociatedTokenAccountInstruction(
          provider.wallet.publicKey,
          nftStakerAccount,
          provider.wallet.publicKey,
          nft.mint,
        )
      );
    }

    const { tx, signers } = await createClaimTx(nft, isFirst);

    tx.add(
      ...instructions,
      await program.methods.unstakeAnimal()
        .accounts({
          jungle: project.address,
          escrow: project.escrow,
          animal: nftAddress,
          staker: provider.wallet.publicKey,
          mint: nft.mint,
          stakerAccount: nftStakerAccount,
          depositAccount: deposit,
          tokenProgram: token.TOKEN_PROGRAM_ID,
        })
        .instruction()
    )

    return {
      tx, signers
    }

  }, [program, project, provider.wallet.publicKey, createClaimTx]);

  const unstake = React.useCallback((...nfts: NFT[]) => {
    provider.sendInBatches(
      nfts,
      createUnstakeTx,
      loadNfts,
      10
    )
  }, [provider.sendInBatches, createUnstakeTx, loadNfts]);

  const unstakeSingle = React.useCallback((nft: NFT) => { unstake(nft) }, [unstake]);

  const unstakeAll = React.useCallback(() => { if (stakedNFTs.length) unstake(...stakedNFTs) }, [stakedNFTs, unstake])

  return (
    <StakingContext.Provider
      value={{
        status,
        project,
        availableNFTs,
        stakedNFTs,
        fetchNFT,
        getRewards,
        getAllRewards,
        stake,
        stakeSingle,
        stakeAll,
        claim,
        claimSingle,
        claimAll,
        unstake,
        unstakeSingle,
        unstakeAll,
        refresh: loadNfts,
      }}
    >
      {props.children}
    </StakingContext.Provider>
  )
};
