import * as anchor from '@project-serum/anchor';
import * as web3 from '@solana/web3.js';
export default function useProvider(opts?: web3.ConfirmOptions): {
    connection: anchor.web3.Connection;
    wallet: import("@solana/wallet-adapter-react").WalletContextState;
    provider: anchor.AnchorProvider | undefined;
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
    sendInBatches: (data: any[], transactionCallback: (data: any, isFirst?: boolean) => {
        tx: anchor.web3.Transaction;
        signers: anchor.web3.Keypair[];
    } | undefined, successCallback?: () => void, actionText?: string, batchSize?: number, opts?: web3.ConfirmOptions) => void;
};
