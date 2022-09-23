import ReactDOM from "react-dom/client";
import { Buffer } from "buffer";

/// Styles
import "react-base-kit/dist/styles/index.scss"
import { ConfigProvider } from "./contexts";
import { SolanaNetwork } from "./types";

/// DEPENDENCIES
window.Buffer = window.Buffer || Buffer;


/// RENDER
function Home() {
  return (
    <section className="Home" style={{ height: '1000px' }}>
      <h1>Home</h1>
    </section>
  )
}


/// Config
const CONFIG = {
  network: SolanaNetwork.Devnet,
  RPC_List: [
    {
      name: "Devnet",
      url: "https://api.devnet.solana.com",
    },
    {
      name: "Mainnet",
      url: "https://api.mainnet-beta.solana.com",
    }
  ]
}

function App() {
  return (
    <div className="App">
      <ConfigProvider config={CONFIG} >
        <Home />
      </ConfigProvider>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
