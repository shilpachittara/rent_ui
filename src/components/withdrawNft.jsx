/* eslint-disable react/prop-types */
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { TimeDurationInput } from "react-time-duration-input";
import "./ListCards/styles/nft.css"

import {
  useConnection,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import BN from "bn.js";
import React, { useEffect, useState } from "react";
import {
  queryTokenState,
  config,
  initNFTEscrowTx,
  findAssociatedTokenAddress,
  sendTransaction,
  cancelEscrowTx,
} from "stream-nft";
import { addDocument } from "../services/firebase";
import { getRate, getSeconds } from "../services/common";
const getMetadata = async (connection: Connection, token: string) => {
  return await queryTokenState({
    programId: config.DEVNET_PROGRAM_ID,
    tokenAddress: new PublicKey(token),
    connection,
  });
};

const initalizeEscrowHandler = async (
  rate: number,
  connection: Connection,
  token: PublicKey,
  wallet: WalletContextState,
  minBorrowTime: number,
  maxBorrowTime: number,
  revenueShare: number
) => {
  //console.log(minBorrowTime, maxBorrowTime, rate, revenueShare);
  const tempAccount = new Keypair();
  const resp = await initNFTEscrowTx({
    owner: wallet,
    token,
    rate: new BN(rate * LAMPORTS_PER_SOL),
    minBorrowTime: new BN(minBorrowTime),
    maxBorrowTime: new BN(maxBorrowTime),
    ownersRevenueShare: new BN(revenueShare),
    connection,
    newAccount: tempAccount.publicKey,
    ownerTokenAccount: await findAssociatedTokenAddress(
      wallet.publicKey,
      token
    ),
    programId: config.DEVNET_PROGRAM_ID,
  });
  const txId = await wallet.sendTransaction(resp.tx, connection, {
    signers: [tempAccount],
    options: { skipPreflight: false, preflightCommitment: "confirmed" },
  });
  await addDocument(token.toBase58());
  return `initEscrowTx Completed: ${txId}`;
};
const cancelEscrowHandler = async (
  connection: Connection,
  token: PublicKey,
  wallet: WalletContextState
) => {
  const resp = await cancelEscrowTx({
    owner: wallet,
    token,
    programId: config.DEVNET_PROGRAM_ID,
    connection,
    ownerTokenAddress: await findAssociatedTokenAddress(
      wallet.publicKey,
      token
    ),
  });
  const txId = await sendTransaction({
    connection,
    wallet,
    txs: resp.tx,
    signers: [],
    options: { skipPreflight: false, preflightCommitment: "confirmed" },
  });
  return `cancelEscrowTx Completed: ${txId}`;
};
const Card = ({ id }) => {
  const { connection } = useConnection();
  const w = useWallet();
  const { publicKey, sendTransaction } = w;
  const [token, setToken] = useState(null);
  const [err, setErr] = useState(null);
  const [log, setLog] = useState(null);
  const [escrowState, setEscrowState] = useState(null);
  const [rate, setRate] = useState(0);
  const [timeScale, setTimeScale] = useState(0);
  const [timeScaleMinBorrow, setTimeScaleMinBorrow] = useState(0);
  const [timeScaleMaxBorrow, setTimeScaleMaxBorrow] = useState(0);
  const [minDuration, setMinDuration] = useState(60);
  const [maxDuration, setMaxDuration] = useState(10 * 60);
  const [revenueShare, setRevenueShare] = useState(0);

  const fetchMetadata = async () => {
    setErr(null);
    setLog(null);
    setEscrowState(null);
    setToken(id);
    if (!publicKey) {
      setErr("Wallet not connected");
      return;
    }
    if (!token) setErr("no token found");
    console.log(publicKey.toBase58());
    try {
      const state = await getMetadata(connection, token);
      await addDocument(token);
      setEscrowState(
        JSON.stringify(
          {
            ...state.getState(),
            rate: `${state.getState().rate.toNumber() / LAMPORTS_PER_SOL} SOL`,
            expiry: state.getState().expiry.toString(),
            state: state.getState().state.toString(),
            minBorrowDuration: state.getState().minBorrowDuration.toString(),
            maxBorrowDuration: state.getState().maxBorrowDuration.toString(),
          },
          null,
          2
        )
      );
    } catch (error) {
      console.log(error);
      setErr(error.message);
    }
  };
  const initalizeEscrow = async () => {
    setToken(id);
    setErr(null);
    setLog(null);
    setEscrowState(null);
    if (!publicKey) {
      setErr("Wallet not connected");
      return;
    }
    if (!token) setErr("no token found");
    console.log(publicKey.toBase58());
    try {
      const resp = await initalizeEscrowHandler(
        getRate(timeScale, rate),
        connection,
        new PublicKey(token),
        w,
        getSeconds(timeScaleMinBorrow, minDuration),
        getSeconds(timeScaleMaxBorrow, maxDuration),
        revenueShare
      );
      setLog(resp);
    } catch (error) {
      console.log(error);
      setErr(error.message);
    }
  };
  const cancelEscrow = async () => {
    setToken(id);
    setErr(null);
    setLog(null);
    setEscrowState(null);
    if (!publicKey) {
      setErr("Wallet not connected");
      return;
    }
    if (!token) setErr("no token found");
    console.log(publicKey.toBase58());
    try {
      const resp = await cancelEscrowHandler(
        connection,
        new PublicKey(token),
        w
      );
      setLog(resp);
    } catch (error) {
      console.log(error);
      setErr(error.message);
    }
  };
  useEffect(() => {
    setToken(id);
    setErr(null);
  }, []);


  const [gender, setChecked] = useState("Fixed Price");

  function onChangeValue(event) {
    setChecked(event.target.value);
    console.log(event.target.value);
  }

  return (
    // <div className="container mx-auto center ">
    //   <div className="flex w-70 m-auto">
    //     <div className="flex-auto card z-70 w-32 max-w-32 bg-primary text-primary-content shadow-2xl new-card">
    //       <div className="card-body d-block">
    //         <h1 className="card-title font-size-3">Withdrawal</h1>
    //         <div>
    //           <img src="" alt="" className="token-img" onClick={""}></img>
    //         </div>
    //         <div className="flex gap-4 listing-header">
    //           <div> Token Id</div>
    //           <div> {id}</div>
    //         </div>
    //         <div>

    //         </div>
    //         <div className="form-control flex gap-4 w-full">
    //           {/* Remaining Rental Period */}
    //           <div className="d-flex">
    //             <h3 className="head w-30 ">Remaining Rental Period</h3>
    //             <input
    //               type="number"
    //               placeholder="Remaining Rental Period"
    //               className="input input-bordered input-accent"
    //               onChange={(e) => setMinDuration(parseInt(e.target.value))}
    //             />
    //             <select
                
    //               className="select select-info  "
    //               onChange={(e) => {
    //                 setTimeScaleMinBorrow(parseInt(e.target.value));
    //               }}
    //             >
    //               <option value="" disabled selected hidden>Unit</option>
    //               <option value={0}>Seconds</option>
    //               <option value={1}>Minutes </option>
    //               <option value={2}>Hours</option>
    //               <option value={3}>Days</option>
    //               <option value={4}>Weeks</option>
    //               <option value={5}>Months</option>
    //             </select>
    //           </div>
    //         </div>

    //         <div className="justify-end card-actions justify-center">
    //           <button className="btn" onClick={cancelEscrow}>
    //             Withdraw Token Listing
    //           </button>
    //         </div>
    //         {err ? (
    //           <div className="alert alert-error shadow-lg">
    //             <div>
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 className="stroke-current flex-shrink-0 h-6 w-6"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //               >
    //                 <path
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                   strokeWidth="2"
    //                   d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    //                 />
    //               </svg>
    //               <span>{err}</span>
    //             </div>
    //           </div>
    //         ) : (
    //           ""
    //         )}
    //       </div>
    //     </div>
    //     {escrowState ? (
    //       <div className="flex-auto card w-96 bg-primary text-primary-content">
    //         <div className="card-body">
    //           <h2 className="card-title">RENTED NFT METADATA</h2>
    //           <p>
    //             <div className="mockup-code">
    //               <pre data-prefix="$">
    //                 <code>{escrowState}</code>
    //               </pre>
    //             </div>
    //           </p>
    //         </div>
    //       </div>
    //     ) : (
    //       ""
    //     )}
    //   </div>
    //   {log ? (
    //     <div className="alert alert-info shadow-lg">
    //       <div>
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           fill="none"
    //           viewBox="0 0 24 24"
    //           className="stroke-current flex-shrink-0 w-6 h-6"
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             strokeWidth="2"
    //             d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    //           ></path>
    //         </svg>
    //         <span>{log}</span>
    //       </div>
    //     </div>
    //   ) : (
    //     ""
    //   )}
    // </div>

<div className="container mx-auto center ">
<div className="flex w-70 m-auto">
  <div className="flex-auto card z-70 w-32 max-w-32 bg-primary text-primary-content shadow-2xl new-card">
    <div className="card-body d-block">
      <h1 className="card-title font-size-3">Borrowing Details</h1>
      <div>
        <img src="" alt="" className="token-img" onClick={""}></img>
      </div>
      <div className="flex gap-4 listing-header">
        <div> Token Id : jfknsknksgnkdnsknkdfjndkjfnkdgnldkgldfmgldfkm</div>
        <div> {id}</div>
      </div>
      <div>

      </div>
      <div className="form-control flex gap-4 w-full">
        {/* Remaining Rental Period */}
        <div className="d-flex">
          <h3 className="head w-30 ">Remaining Rental Period</h3>
          <input
            type="number"
            placeholder="Remaining Rental Period"
            className="input input-bordered input-accent"
            onChange={(e) => setMinDuration(parseInt(e.target.value))}
          />
          <select
          
            className="select select-info  "
            onChange={(e) => {
              setTimeScaleMinBorrow(parseInt(e.target.value));
            }}
          >
            <option value="" disabled selected hidden>Unit</option>
            <option value={0}>Seconds</option>
            <option value={1}>Minutes </option>
            <option value={2}>Hours</option>
            <option value={3}>Days</option>
            <option value={4}>Weeks</option>
            <option value={5}>Months</option>
          </select>
        </div>
        
        {/* Revocation Trigger */}

        <div className="d-flex">
                <h3 className="head w-30">Rental Price</h3>
                <input
                  type="number"
                  placeholder="Amount"
                  className="input input-bordered input-accent w-full "
                  onChange={""}
                />
                <input
                type="number"
                placeholder="Revenue Split"
                className="input input-bordered input-accent w-full "
                onChange={""}
              />
                <select
                  className="select select-info  "
                  onChange={(e) => {""}}
                >
                  <option value="" disabled selected hidden>Curreny</option>
                  <option value={0}>USD</option>
                  <option value={1}>INR</option>
                </select>
      </div></div>

      <div className="justify-end card-actions justify-center">
        <button className="btn" onClick={cancelEscrow}>
          Withdraw Token Listing
        </button>
      </div>
      {err ? (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{err}</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  </div>
  {escrowState ? (
    <div className="flex-auto card w-96 bg-primary text-primary-content">
      <div className="card-body">
        <h2 className="card-title">RENTED NFT METADATA</h2>
        <p>
          <div className="mockup-code">
            <pre data-prefix="$">
              <code>{escrowState}</code>
            </pre>
          </div>
        </p>
      </div>
    </div>
  ) : (
    ""
  )}
</div>
{log ? (
  <div className="alert alert-info shadow-lg">
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-current flex-shrink-0 w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>{log}</span>
    </div>
  </div>
) : (
  ""
)}
</div>
  );
};

export default Card;
