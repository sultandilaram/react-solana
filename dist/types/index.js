export let SolanaNetwork;

(function (SolanaNetwork) {
  SolanaNetwork["Devnet"] = "devnet";
  SolanaNetwork["Testnet"] = "testnet";
  SolanaNetwork["Mainnet"] = "mainnet-beta";
})(SolanaNetwork || (SolanaNetwork = {}));