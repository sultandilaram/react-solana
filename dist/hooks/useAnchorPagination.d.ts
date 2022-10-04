import * as anchor from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";
export default function useAnchorPagination<T extends anchor.Idl = any, R = any>(program: anchor.Program<T> | undefined, accountName: string, filters?: web3.GetProgramAccountsFilter[], dataPerPage?: number): {
    accounts: anchor.web3.PublicKey[];
    data: R[][];
    getPage: (page: number) => Promise<R[]>;
};
