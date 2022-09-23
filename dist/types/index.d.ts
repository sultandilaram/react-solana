export declare enum SolanaNetwork {
    Devnet = "devnet",
    Testnet = "testnet",
    Mainnet = "mainnet-beta"
}
export declare type RPC = {
    name: string;
    url: string;
};
export interface Config {
    network: SolanaNetwork;
    RPC_List: RPC[];
}
