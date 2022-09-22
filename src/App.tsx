import React, { useEffect, useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar";
import Card from "./components/nft";
import { useState } from 'react';
// import '../node_modules/bootstrap/dist/css/bootstrap.css';
// import Container from 'react-bootstrap/Container';
// import 'bootstrap/dist/css/bootstrap.min.css';
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import Rent from "./components/rent";
import Listing from "./components/listings";
import Toggle from "./components/borrow";
import Init from "./components/init";
import CardList from "./components/ListCards/cardList";
import OwnedList from "./components/ownedList";
import OwnedNft from "./components/ownedNft";
import BorrowedNft from "./components/borrowedNft";
import Marketplace from "./components/market";
import Hamburger from "./components/ListCards/hamburger";

import SearchBar from 'search-bar-react';
import ReactiveButton from 'reactive-button';

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row"

require("@solana/wallet-adapter-react-ui/styles.css");
function App() {
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );
  //states
  const [listActive, setListActive] = React.useState(0);

  return (

    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex flex-col items-center">
            <Navbar></Navbar>
            <div className="main">
              <div className="tabs tabs-boxed col-80">
                <a
                  className={`tab tab-lg box outset ${listActive === 0 ? "tab-active" : ""}`}
                  onClick={() => {
                    setListActive(0);
                  }}
                >
                  Marketplace
                </a>

                <a
                  className={`tab tab-lg box outset ${listActive === 1 ? "tab-active" : ""}`}
                  onClick={() => {
                    setListActive(1);
                  }}
                >
                  Collection
                </a>
              </div>
              < div className="tabs tabs-boxed col-20 top-btn">
                <a
                  className={`tab tab-lg ${listActive === 2 ? "tab-active" : ""}`}
                  onClick={() => {
                    setListActive(2);
                  }}
                >
                  Owner
                </a>
                <a
                  className={`tab tab-lg ${listActive === 3 ? "tab-active" : ""}`}
                  onClick={() => {
                    setListActive(3);
                  }}
                >
                  Borrow
                </a>
              </div>
            </div>
            {/******************** Search ****************/}
            <div className="main">
              <div></div>
              {/*<div className="search">
                <SearchBar
                  onChange={(text) => console.log(text)}
                  onFocus={() => console.log('focused')}
                  size='large'
                  width='100%'

                  placeholder='Search...'
                  onClear={() => console.log('closed')}
                //  value='Search' 
                />
              </div> */}
              {/******************** End Search ****************/}
              {/* <div className="token-main">
                <ReactiveButton
                  idleText={'Listed Token'}
                  loadingText={'Loading'}
                  type={'button'}
                  className={'token-btn'}
                />
                <div style={{width : '2px'}}></div>
                <ReactiveButton
                  idleText={'Total Token'}
                  loadingText={'Loading'}
                  type={'button'}
                  className={'token-btn'}
                />
              </div>
              */}
            </div>
            {listActive === 2 ? (
              <OwnedNft />
            ) : listActive === 1 ? (
              <BorrowedNft />
            ) : (
              <Marketplace></Marketplace>
            )}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
