import Web3 from "web3";

let web3 : Web3;

if (typeof window !== "undefined" && typeof window.ethereum! !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum!.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum!);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/49373fdfe7c345c987d6dedba4e98dfb'
  );
  web3 = new Web3(provider);
}

export default web3;