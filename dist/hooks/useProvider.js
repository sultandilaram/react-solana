import React from 'react';
import * as anchor from '@project-serum/anchor';
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
  const sendInBatches = React.useCallback((data, transactionCallback, successCallback = () => {}, actionText = 'Work', batchSize = 5, opts) => {
    if (!provider) throw new Error("Provider not created yet!, Wait for connection to be established");
    const batches = Math.ceil(data.length / batchSize); // SENDING TRANSACTIONS IN BATCHES

    const sendTrasactionBatch = async (currentBatch, isFirst, opts) => {
      if (currentBatch > batches) return;
      const batch = data.slice(batchSize * (currentBatch - 1), batchSize * currentBatch);

      if (opts === undefined) {
        opts = defaultOpts;
      }

      const blockhash = await provider.connection.getLatestBlockhash(opts.preflightCommitment);
      const txs = [];

      for (let part of batch) {
        const transaction = await transactionCallback(part, isFirst);
        isFirst = false;

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

      const message = toast.loading(`${actionText}ing batch ${currentBatch} / ${batches}`);

      try {
        const signedTxs = await provider.wallet.signAllTransactions(txs);
        new Promise(async (resolve, reject) => {
          const sigs = [];

          for (let k = 0; k < txs.length; k += 1) {
            const tx = signedTxs[k];
            const rawTx = tx.serialize();
            anchor.web3.sendAndConfirmRawTransaction(provider.connection, rawTx, opts).then(sig => {
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
          console.log(`${actionText}ed ${currentBatch} / ${batches}!`, sigs);
          toast.update(message, {
            render: `${actionText}ed ${currentBatch} / ${batches}!`,
            type: 'success',
            isLoading: false,
            closeOnClick: true,
            closeButton: true,
            autoClose: 4000
          });
        }).catch(e => {
          console.error(e);
          toast.update(message, {
            render: `Batch ${currentBatch}/${batches} is failed`,
            type: 'error',
            isLoading: false,
            closeOnClick: true,
            closeButton: true,
            autoClose: 4000
          });
        });
      } catch (e) {
        console.error(`Batch ${currentBatch}/${batches} failed`, e);
        toast.update(message, {
          render: `Batch ${currentBatch}/${batches} is failed, Please reload and try again`,
          type: 'error',
          isLoading: false,
          closeOnClick: true,
          closeButton: true,
          autoClose: 4000
        });
      } finally {
        successCallback();
        sendTrasactionBatch(currentBatch + 1, false, opts);
      }
    };

    sendTrasactionBatch(1, true, opts);
  }, [provider]);
  return {
    connection,
    wallet,
    provider,
    sendAndConfirm,
    sendAll,
    sendInBatches
  };
}