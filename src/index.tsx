import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { MetaMaskProvider } from "metamask-react";
import Web3 from "web3";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./components/App";
import { Reset } from "styled-reset";
import { createGlobalStyle } from "styled-components";
import {ethers} from "ethers";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
export const web3 = new Web3(
  "https://sepolia.infura.io/v3/60fd6c8e4eb542c5b2993b903087ce0b"
);

export const ethersProvider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/60fd6c8e4eb542c5b2993b903087ce0b");


const GlobalStyle = createGlobalStyle`
  *{
    font-family: 'Montserrat', sans-serif !important;
    box-sizing: border-box;
  }
  body, html {
    width: 100%;
    height: 100%;
  }
  #root {
    width: 100%;
    height: 100%;
  }
`;
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MetaMaskProvider>
        <Reset />
        <GlobalStyle />
        <App />
      </MetaMaskProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
