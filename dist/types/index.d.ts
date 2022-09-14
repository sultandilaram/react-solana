export declare enum SolanaNetwork {
    Devnet = "devnet",
    Testnet = "testnet",
    Mainnet = "mainnet-beta"
}
export declare type Network = SolanaNetwork;
export declare type Production = Boolean;
export declare type Url = String;
export declare type RPC = {
    name: String;
    url: Url;
};
export interface Config {
    network: Network;
    production: Production;
    localUrl: Url;
    prodUrl: Url;
    RPC_List: RPC[];
}
