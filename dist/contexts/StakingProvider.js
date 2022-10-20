import React from 'react';
import * as anchor from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { buildLeaves, MerkleTree } from '../helpers';
import { useProvider } from '../hooks';
import { StakingContext } from './contexts';
export default function StakingProvider(props) {
  /// Deps
  const provider = useProvider(); /// States

  const [status, setStatus] = React.useState({
    project: false,
    availableNFTs: false,
    stakedNFTs: false
  });
  const [project, setProject] = React.useState();
  const [availableNFTs, setAvailableNFTs] = React.useState([]);
  const [stakedNFTs, setStakedNFTs] = React.useState([]);
  const tree = React.useMemo(() => {
    if (props.createMerkleTree) {
      return props.createMerkleTree();
    }

    const leaves = buildLeaves(props.metadata.map((e, i) => ({
      mint: new web3.PublicKey(e.mint),
      emissionsPerDay: e.emissionsPerDay,
      faction: props.factionToNumber(e.faction)
    })));
    return new MerkleTree(leaves);
  }, [props.metadata]); /// Methods

  const fetchProject = React.useCallback(async () => {
    if (!props.program) throw new Error("Program not loaded");
    let projectAddress = props.stakingProjectAddress;

    if (props.stakingProjectKey) {
      projectAddress = (await web3.PublicKey.findProgramAddress([Buffer.from('project'), props.stakingProjectKey.toBuffer()], props.program.programId))[0];
    }

    if (!projectAddress) throw new Error("Project Key/Address is not provided");
    const fetchedProject = await props.program.account.jungle.fetch(projectAddress);
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
      root: fetchedProject.root
    };
  }, [props.program]);
  const fetchAvailableNFTs = React.useCallback(async wallet => {
    const owned = await Metadata.findDataByOwner(provider.connection, wallet);
    const collectionMints = props.metadata.map(e => e.mint);
    const nfts = owned.map(e => e.mint).filter(e => collectionMints.includes(e)).map(e => {
      const metadataItem = props.metadata.filter(f => f.mint === e)[0];
      return {
        mint: new web3.PublicKey(e),
        metadata: metadataItem.arweave,
        uriData: metadataItem.metadata,
        emissionsPerDay: metadataItem.emissionsPerDay,
        emissionsPerWeek: metadataItem.emissionsPerDay * 7,
        faction: metadataItem.faction
      };
    }).sort((a, b) => {
      const na = Number(a.metadata.name.split('#')[1]);
      const nb = Number(b.metadata.name.split('#')[1]);
      return na - nb;
    });
    return nfts;
  }, []);
  const fetchStakedNFTs = React.useCallback(async wallet => {
    if (!props.program) throw new Error("Program not loaded");
    const staked = await props.program.account.animal.all([{
      memcmp: {
        offset: 42,
        bytes: wallet.toString()
      }
    }]);
    const collectionMints = props.metadata.map(e => e.mint);
    const data = staked.map(e => e.account).filter(e => collectionMints.includes(e.mint.toString())).map(e => {
      const metadataItem = props.metadata.filter(f => f.mint === e.mint.toString())[0];
      return {
        mint: e.mint,
        metadata: metadataItem.arweave,
        uriData: metadataItem.metadata,
        emissionsPerDay: metadataItem.emissionsPerDay,
        emissionsPerWeek: metadataItem.emissionsPerDay * 7,
        lastClaim: new Date(e.lastClaim.toNumber() * 1000),
        faction: metadataItem.faction
      };
    }).sort((a, b) => {
      const na = Number(a.metadata?.name.split('#')[1] || '999999');
      const nb = Number(b.metadata?.name.split('#')[1] || '999999');
      return na - nb;
    });
    return data;
  }, [props.program]);
  const fetchAnimal = React.useCallback(async mint => {
    if (!props.program) throw new Error("Program not provided");
    const [animalAddress] = await web3.PublicKey.findProgramAddress([Buffer.from('nft'), mint.toBuffer()], props.program.programId);
    const metadataItem = props.metadata.filter(e => e.mint === mint.toString())[0];

    try {
      const fetchedAnimal = await props.program.account.animal.fetch(animalAddress);
      return {
        mint: mint,
        metadata: metadataItem.arweave,
        uriData: metadataItem.metadata,
        emissionsPerDay: fetchedAnimal.emissionsPerDay.toNumber(),
        emissionsPerWeek: fetchedAnimal.emissionsPerDay.toNumber() * 7,
        faction: metadataItem.faction,
        lastClaim: new Date(fetchedAnimal.lastClaim.toNumber() * 1000)
      };
    } catch (err) {
      return {
        mint: mint,
        metadata: metadataItem.arweave,
        uriData: metadataItem.metadata,
        emissionsPerDay: metadataItem.emissionsPerDay,
        emissionsPerWeek: metadataItem.emissionsPerDay * 7,
        faction: metadataItem.faction
      };
    }
  }, [props.program]);
  const getMultiplier = React.useCallback(nft => 1, []);
  const getRewards = React.useCallback((nft, end) => {
    if (!nft.lastClaim || end < nft.lastClaim) return 0;
    const elapsed = (end.valueOf() - nft.lastClaim.valueOf()) / 1000;
    const pendingRewards = parseFloat(nft.emissionsPerDay || nft.emissionsPerDay) / 86400 * elapsed;
    const multiplier = getMultiplier(nft);
    return pendingRewards / 10 ** 9 * multiplier;
  }, [getMultiplier]);
  const getAllRewards = React.useCallback(end => {
    if (!stakedNFTs.length) 0;
    return stakedNFTs.map(nft => getRewards(nft, end)).reduce((sum, x) => sum + x);
  }, [stakedNFTs, getRewards]); /// Load Data

  const loadNfts = React.useCallback(() => {
    if (!provider.wallet.publicKey) return;
    setStatus(x => ({ ...x,
      availableNFTs: true
    }));
    fetchAvailableNFTs(provider.wallet.publicKey).then(setAvailableNFTs).catch(e => console.error("Failed fetching wallet NFTs", e)).finally(() => setStatus(x => ({ ...x,
      availableNFTs: false
    })));
    setStatus(x => ({ ...x,
      stakedNFTs: true
    }));
    fetchStakedNFTs(provider.wallet.publicKey).then(setStakedNFTs).catch(e => console.error("Failed fetching staked NFTs", e)).finally(() => setStatus(x => ({ ...x,
      availableNFTs: false
    })));
  }, [provider.wallet.publicKey, fetchAvailableNFTs, fetchStakedNFTs, setStatus, setAvailableNFTs, setStakedNFTs]); /// Effects

  React.useEffect(() => {
    setStatus(x => ({ ...x,
      project: true
    }));
    fetchProject().then(setProject).catch(e => console.error("Fetch project failed", e)).finally(() => setStatus(x => ({ ...x,
      project: false
    })));
  }, [fetchProject]);
  React.useEffect(() => {
    loadNfts();
  }, [loadNfts]); /// Transactions & Instructions
  // Stake Animal

  const createStakeTx = React.useCallback(async (nft, isFirst) => {
    if (!props.program || !provider.wallet.publicKey || !project || !provider) throw new Error("Missing dependencies");
    const [nftAddress, nftBump] = await web3.PublicKey.findProgramAddress([Buffer.from('animal', 'utf8'), nft.mint.toBuffer()], props.program.programId);
    const [deposit, depositBump] = await web3.PublicKey.findProgramAddress([Buffer.from('deposit', 'utf8'), nft.mint.toBuffer()], props.program.programId);
    const stakerAccount = await token.Token.getAssociatedTokenAddress(token.ASSOCIATED_TOKEN_PROGRAM_ID, token.TOKEN_PROGRAM_ID, nft.mint, provider.wallet.publicKey);
    const instructions = [];

    if (isFirst) {
      try {
        await new token.Token(provider.connection, nft.mint, token.TOKEN_PROGRAM_ID, web3.Keypair.generate()).getAccountInfo(stakerAccount);
      } catch (err) {
        instructions.push(token.Token.createAssociatedTokenAccountInstruction(token.ASSOCIATED_TOKEN_PROGRAM_ID, token.TOKEN_PROGRAM_ID, nft.mint, stakerAccount, provider.wallet.publicKey, provider.wallet.publicKey));
      }
    }

    const bumps = {
      animal: nftBump,
      deposit: depositBump
    };
    const indexStaked = props.metadata.findIndex(e => e.mint === nft.mint.toString());
    const tx = props.program.transaction.stakeAnimal(bumps, tree.getProofArray(indexStaked), new anchor.BN(nft.emissionsPerDay), new anchor.BN(props.factionToNumber(nft.faction)), {
      accounts: {
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
        systemProgram: web3.SystemProgram.programId
      },
      instructions: instructions
    });
    return {
      tx,
      signers: []
    };
  }, [props.program, project, tree, provider.wallet.publicKey]);
  const stake = React.useCallback((...nfts) => {
    provider.sendInBatches(nfts, createStakeTx, loadNfts, 10);
  }, [provider.sendInBatches, createStakeTx, loadNfts]);
  const stakeSingle = React.useCallback(nft => {
    stake(nft);
  }, [stake]);
  const stakeAll = React.useCallback(() => {
    if (availableNFTs) stake(...availableNFTs);
  }, [stake, availableNFTs]); // Claim Rewards
  // It also creates all used account if they do not exist

  const createClaimTx = React.useCallback(async (nft, isFirst) => {
    if (!props.program || !project || !provider.wallet.publicKey) throw new Error("Missing dependencies");
    const [rewardsAccount] = await web3.PublicKey.findProgramAddress([Buffer.from('rewards', 'utf8'), project.key.toBuffer(), project.rewardMint.toBuffer()], props.program.programId);
    const [nftAddress] = await web3.PublicKey.findProgramAddress([Buffer.from('animal', 'utf8'), nft.mint.toBuffer()], props.program.programId);
    const stakerAccount = await token.Token.getAssociatedTokenAddress(token.ASSOCIATED_TOKEN_PROGRAM_ID, token.TOKEN_PROGRAM_ID, project.rewardMint, provider.wallet.publicKey);
    const instructions = [];

    if (isFirst) {
      try {
        await new token.Token(provider.connection, project.rewardMint, token.TOKEN_PROGRAM_ID, provider.wallet).getAccountInfo(stakerAccount);
      } catch {
        instructions.push(token.Token.createAssociatedTokenAccountInstruction(token.ASSOCIATED_TOKEN_PROGRAM_ID, token.TOKEN_PROGRAM_ID, project.rewardMint, stakerAccount, provider.wallet.publicKey, provider.wallet.publicKey));
      }
    }

    const tx = props.program.transaction.claimStaking({
      accounts: {
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
        systemProgram: web3.SystemProgram.programId
      },
      instructions: instructions
    });
    return {
      tx,
      signers: []
    };
  }, [props.program, project, provider.wallet.publicKey]);
  const claim = React.useCallback((...nfts) => {
    provider.sendInBatches(nfts, createClaimTx, () => {}, 10);
  }, [provider.sendInBatches, createClaimTx]);
  const claimSingle = React.useCallback(nft => {
    claim(nft);
  }, [claim]);
  const claimAll = React.useCallback(() => {
    if (stakedNFTs.length) claim(...stakedNFTs);
  }, [stakedNFTs, claim]); // Unstakes an nft.
  // It also creates all used account if they do not exist and claims rewards

  const createUnstakeTx = React.useCallback(async (nft, isFirst) => {
    if (!props.program || !project || !provider.wallet.publicKey) throw new Error("Missing dependencies");
    const [nftAddress] = await web3.PublicKey.findProgramAddress([Buffer.from('animal', 'utf8'), nft.mint.toBuffer()], props.program.programId);
    const [deposit] = await web3.PublicKey.findProgramAddress([Buffer.from('deposit', 'utf8'), nft.mint.toBuffer()], props.program.programId);
    const animalStakerAccount = await token.Token.getAssociatedTokenAddress(token.ASSOCIATED_TOKEN_PROGRAM_ID, token.TOKEN_PROGRAM_ID, nft.mint, provider.wallet.publicKey);
    const instructions = [];

    try {
      await new token.Token(provider.connection, nft.mint, token.TOKEN_PROGRAM_ID, web3.Keypair.generate()).getAccountInfo(animalStakerAccount);
    } catch (err) {
      instructions.push(token.Token.createAssociatedTokenAccountInstruction(token.ASSOCIATED_TOKEN_PROGRAM_ID, token.TOKEN_PROGRAM_ID, nft.mint, animalStakerAccount, provider.wallet.publicKey, provider.wallet.publicKey));
    }

    const {
      tx,
      signers
    } = await createClaimTx(nft, isFirst);
    tx.add(...instructions, props.program.instruction.unstakeAnimal({
      accounts: {
        jungle: project.address,
        escrow: project.escrow,
        animal: nftAddress,
        staker: provider.wallet.publicKey,
        mint: nft.mint,
        stakerAccount: animalStakerAccount,
        depositAccount: deposit,
        tokenProgram: token.TOKEN_PROGRAM_ID
      }
    }));
    return {
      tx,
      signers
    };
  }, [props.program, project, provider.wallet.publicKey, createClaimTx]);
  const unstake = React.useCallback((...nfts) => {
    provider.sendInBatches(nfts, createUnstakeTx, loadNfts, 10);
  }, [provider.sendInBatches, createUnstakeTx, loadNfts]);
  const unstakeSingle = React.useCallback(nft => {
    unstake(nft);
  }, [unstake]);
  const unstakeAll = React.useCallback(() => {
    if (stakedNFTs.length) unstake(...stakedNFTs);
  }, [stakedNFTs, unstake]);
  return /*#__PURE__*/React.createElement(StakingContext.Provider, {
    value: {
      status,
      project,
      availableNFTs,
      stakedNFTs,
      fetchAnimal,
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
      unstakeAll
    }
  }, props.children);
}
;