import ReactDOM from "react-dom/client";
import { Buffer } from "buffer";
import { BaseProvider, Header, NavDropdown, NavItem, Wrapper, BaseConfig, Route } from "react-base-kit";

/// Styles
import "./styles/index.scss"

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
const ROUTES: Route[] = [
  { path: '/', element: <Home /> },
];

const CONFIG: BaseConfig = {
  environment: "local",
  api: {
    local: "http://localhost:8000",
    dev: "http://123.123.12.1",
    prod: "https://example.com"
  },
  loginMethod: async () => "token"
}

function App() {
  return (
    <div className="App">
      <BaseProvider config={CONFIG}>
        <Wrapper
          routes={ROUTES}
          title="React Base Kit"
          header={(
            <Header title="React Base">
              <NavItem path="/" label="Home" />
              <NavItem path="/link" label="Link" />
              <NavItem path="/disabled" label="disabled" disabled />
              <NavDropdown label="Dropdown">
                <NavItem path="/dropdown" label="Dropdown Link" />
                <NavItem path="/dropdown" label="Dropdown Link" />
              </NavDropdown>
              <button className="btn btn-primary" >Button</button>
            </Header>
          )}
        // sidebar={<Sidebar />}
        // footer={<Footer />}
        />
      </BaseProvider>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
