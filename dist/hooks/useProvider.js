import React from 'react';
import * as anchor from '@project-serum/anchor';
import * as web3 from '@solana/web3.js';
import { toast } from 'react-toastify';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
const defaultOpts = {
  preflightCommitment: 'confirmed'
};
export default function useProvider(opts) {
  const {
    connection
  } = useConnection();
  const wallet = useWallet();
  const provider = React.useMemo(() => {
    if (!connection) return;
    return new anchor.AnchorProvider(connection, wallet, opts || defaultOpts); //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, wallet]);
  const sendTransaction = React.useCallback(async (tx, opts, toasts) => {
    if (!wallet.publicKey || !wallet.signTransaction) throw new Error("Wallet not connected!");
    let toastId;

    if (toasts) {
      toastId = toast.loading(toasts.loading);
    }

    try {
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const signedTx = await wallet.signTransaction(tx);
      const txId = await connection.sendRawTransaction(signedTx.serialize(), opts || defaultOpts);

      if (toasts?.success && toastId) {
        toast.update(toastId, {
          render: toasts.success,
          type: 'success',
          isLoading: false,
          autoClose: 4000
        });
      }

      return txId;
    } catch (e) {
      if (toasts?.error && toastId) {
        toast.update(toastId, {
          render: toasts.error,
          type: 'error',
          isLoading: false,
          autoClose: 4000
        });
      }

      throw e;
    }
  }, [connection]);
  const confirmTransaction = React.useCallback(txId => connection.confirmTransaction(txId), [connection]);
  const sendAndConfirm = React.useCallback(async (tx, toasts) => {
    if (!provider) throw new Error("Provider not created yet!, Wait for connection to be established");
    let toastId;

    if (toasts) {
      toastId = toast.loading(toasts.loading);
    }

    try {
      const txId = provider.sendAndConfirm(tx);

      if (toasts?.success && toastId) {
        toast.update(toastId, {
          render: toasts.success,
          type: 'success',
          isLoading: false,
          autoClose: 4000
        });
      }

      return txId;
    } catch (e) {
      if (toasts?.error && toastId) {
        toast.update(toastId, {
          render: toasts.error,
          type: 'error',
          isLoading: false,
          autoClose: 4000
        });
      }

      throw e;
    }
  }, [provider]);
  const sendAll = React.useCallback(async (txs, toasts) => {
    if (!provider) throw new Error("Provider not created yet!, Wait for connection to be established");
    let toastId;

    if (toasts) {
      toastId = toast.loading(toasts.loading);
    }

    try {
      const txId = provider.sendAll(txs);

      if (toasts?.success && toastId) {
        toast.update(toastId, {
          render: toasts.success,
          type: 'success',
          isLoading: false,
          autoClose: 4000
        });
      }

      return txId;
    } catch (e) {
      if (toasts?.error && toastId) {
        toast.update(toastId, {
          render: toasts.error,
          type: 'error',
          isLoading: false,
          autoClose: 4000
        });
      }

      throw e;
    }
  }, [provider]);
  const sendInBatches = React.useCallback((data, transactionCallback, successCallback = () => {}, batchSize = 5, opts) => {
    if (!provider) return;
    const batches = Math.ceil(data.length / batchSize);

    const sendTrasactionBatch = async (currentBatch, isFirst) => {
      if (currentBatch > batches) return;
      const batch = data.slice(batchSize * (currentBatch - 1), batchSize * currentBatch);

      if (opts === undefined) {
        opts = provider.opts;
      }

      const blockhash = await provider.connection.getLatestBlockhash(opts.preflightCommitment);
      const txs = [];

      for (let i = 0; i < batch.length; i++) {
        const part = batch[i];
        const transaction = await transactionCallback(part, i == 0 && !!isFirst);

        if (transaction) {
          let signers = transaction.signers;

          if (signers === undefined) {
            signers = [];
          }

          const tx = transaction.tx;
          tx.feePayer = provider.wallet.publicKey;
          tx.recentBlockhash = blockhash.blockhash;
          signers.filter(s => s !== undefined).forEach(kp => {
            tx.partialSign(kp);
          });
          txs.push(tx);
        }
      }

      const message = toast.loading(`Batch ${currentBatch} / ${batches}`);

      try {
        const signedTxs = await provider.wallet.signAllTransactions(txs);
        new Promise(async (resolve, reject) => {
          const sigs = [];

          for (let k = 0; k < txs.length; k += 1) {
            const tx = signedTxs[k];
            const rawTx = tx.serialize();
            web3.sendAndConfirmRawTransaction(provider.connection, rawTx, opts).then(sig => {
              sigs.push(sig);

              if (sigs.length === txs.length) {
                resolve(sigs);
              }
            }).catch(e => {
              reject(e);
            });
          }

          return sigs;
        }).then(sigs => {
          console.log(`Batch ${currentBatch} / ${batches} done!`, sigs);
          toast.update(message, {
            render: `Batch ${currentBatch} / ${batches} done!`,
            type: 'success',
            isLoading: false,
            closeOnClick: true,
            closeButton: true,
            autoClose: 4000
          });
        }).catch(e => {
          console.error(e);
          toast.update(message, {
            render: `Batch ${currentBatch}/${batches} failed!`,
            type: 'error',
            isLoading: false,
            closeOnClick: true,
            closeButton: true,
            autoClose: 4000
          });
        }).finally(successCallback);
      } catch (e) {
        console.error(`Batch ${currentBatch}/${batches} failed`, e);
        toast.update(message, {
          render: `Batch ${currentBatch}/${batches} failed, Please reload and try again`,
          type: 'error',
          isLoading: false,
          closeOnClick: true,
          closeButton: true,
          autoClose: 4000
        });
      } finally {
        sendTrasactionBatch(currentBatch + 1);
      }
    };

    sendTrasactionBatch(1, true);
  }, [provider]);
  return {
    connection,
    wallet,
    provider,
    sendTransaction,
    confirmTransaction,
    sendAndConfirm,
    sendAll,
    sendInBatches
  };
}