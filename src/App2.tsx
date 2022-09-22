import React, { useEffect, useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar";
import Card from "./components/bookCard";
import Collection from "./components/collection";

import { useState } from "react";
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

import SearchBar from "search-bar-react";
import ReactiveButton from "reactive-button";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

require("@solana/wallet-adapter-react-ui/styles.css");
function App2() {
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
  const [collectionOpen, setCollectionOpen] = React.useState(false);

  const handleOpen = () => {
    setCollectionOpen(true);
  };

  const handleClose = () => {
    setCollectionOpen(false);
  };

  useEffect(() => {
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex flex-col items-center">
            <Navbar></Navbar>
            <div className="">
                {collectionOpen ? (<>
                    <Collection onClick={() =>handleClose()}/>
                </>):(
                <Card onClick={() =>handleOpen()}></Card>
                )
}
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App2;
