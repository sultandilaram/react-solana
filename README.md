<h1>React - Solana</h1>
<p>This package has built in utils for developing an efficient web3 frontend on react.</p>

<strong>Note: We are currently testing this template, you might encounter some bugs. Please open an issue if you do so, We will get to you ASAP.</strong>

<h2>Built-In Hooks</h2>

<h3>Basic Hooks</h3>
<table>
  <tr>
    <th>useConfig</th>
    <td>Gives the programmed/global configurations object that you have set up in config.ts</td>
  </tr>
  <tr>
    <th>useApi</th>
    <td>Gives the four basic API methods (GET, POST, PUT, DEL) wrapped with axios and useAuth and all basic headers</td>
  </tr>
  <tr>
    <th>useAuth</th>
    <td>Gives the functions to login and logout while storing the auth token in localStorage</td>
  </tr>
  <tr>
    <th>useLocalStorage</th>
    <td>Works as useState while storing the state in localStorage</td>
  </tr>
</table>

<h3>Web3 Hooks</h3>
<table>
  <tr>
    <th>useRpc</th>
    <td>Select, Store and Retrieve rpc from localStorage and the list setup in config.ts</td>
  </tr>
  <tr>
    <th>useProvider</th>
    <td>Gives the AnchorProvider, Connection and Wallet object along with some necessory functions such as sendAllTransactionsInBatches</td>
  </tr>
  <tr>
    <th>useAnchorPagination</th>
    <td>Allows you to paginate through the accounts, loads the chain data faster</td>
  </tr>
</table>


<h2>Contributing</h2>
<p>Contributions, issues and feature requests are welcome.</p>

<h2>Show your support</h2>
<p>Give a ⭐️ if this project helped you!</p>

