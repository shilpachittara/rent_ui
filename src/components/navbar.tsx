import React from "react";
import Wallet from "../modules/wallet";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
function Navbar() {
  return (
    <div
      className="navbar w-11/12 mb-20 mt-5 shadow-xl rounded-box flex-1 self-center"
      style={{ backgroundColor: "white" }}
    >
      <div className="navbar-start"></div>
      <div className="navbar-center">
        <p className=" normal-case text-xl font-poppins text-black">
          STREAM Money
        </p>
      </div>
      <div className="navbar-end">
        <button
          className="btn npm"
          onClick={(e) => {
            e.preventDefault();
            window.open("https://www.npmjs.com/package/stream-nft-sdk");
          }}
        >
          Institutional Renting
        </button>
        <Wallet></Wallet>
      </div>
    </div>
  );
}
export default Navbar;
