import * as anchor from '@project-serum/anchor';
import * as web3 from '@solana/web3.js';
import { TxSigners } from '../types';
export default function useProvider(opts?: web3.ConfirmOptions): {
    connection: anchor.web3.Connection;
    wallet: import("@solana/wallet-adapter-react").WalletContextState;
    provider: anchor.AnchorProvider | undefined;
    sendTransaction: (tx: anchor.web3.Transaction, opts?: web3.ConfirmOptions, toasts?: {
        loading: string;
        success?: string;
        error?: string;
    }) => Promise<string>;
    confirmTransaction: (txId: string) => Promise<anchor.web3.RpcResponseAndContext<anchor.web3.SignatureResult>>;
    sendAndConfirm: (tx: anchor.web3.Transaction, toasts?: {
        loading: string;
        success?: string;
        error?: string;
    }) => Promise<string>;
    sendAll: (txs: {
        tx: anchor.web3.Transaction;
        signers: anchor.web3.Keypair[];
    }[], toasts?: {
        loading: string;
        success?: string;
        error?: string;
    }) => Promise<string[]>;
    sendInBatches: <T>(data: T[], transactionCallback: (data: T, isFirst?: boolean) => Promise<TxSigners>, successCallback?: () => void, batchSize?: number, opts?: web3.ConfirmOptions) => void;
};
