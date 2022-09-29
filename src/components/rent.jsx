/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  useConnection,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Keypair,
} from "@solana/web3.js";
import { BN } from "bn.js";
import React, { useEffect, useState } from "react";
import {
  queryTokenState,
  config,
  sendTransaction,
  withdrawTx,
  rentTx,
  findAssociatedTokenAddress,
  KeyPairWallet,
} from "stream-nft";
import { getSeconds } from "../services/common";
const getMetadata = async (connection: Connection, token: string) => {
  return await queryTokenState({
    programId: config.DEVNET_PROGRAM_ID,
    tokenAddress: new PublicKey(token),
    connection,
  });
};
const rentInit = async (
  connection: Connection,
  token: PublicKey,
  wallet: WalletContextState,
  amount: number,
  time: number,
  buy: Number
) => {
  const resp = await rentTx({
    borrower: wallet,
    token,
    programId: config.DEVNET_PROGRAM_ID,
    amount: new BN(amount),
    time: new BN(time),
    buy: new BN(buy),
    connection,
  });
  const txId = await sendTransaction({
    connection,
    wallet,
    txs: resp.tx,
    signers: [],
    options: { skipPreflight: false, preflightCommitment: "confirmed" },
  });
  return `rentTx Completed: ${txId}`;
};
const cancelRent = async (
  connection: Connection,
  token: PublicKey,
  wallet: WalletContextState
) => {
  const aliceKeyPair = Keypair.fromSecretKey(
    Uint8Array.from([
      195, 191, 15, 17, 39, 92, 168, 10, 175, 227, 147, 88, 14, 192, 77, 136,
      102, 19, 132, 142, 77, 98, 252, 183, 252, 102, 196, 54, 249, 169, 74, 202,
      97, 65, 119, 17, 170, 211, 184, 3, 4, 229, 79, 30, 245, 219, 131, 191,
      241, 173, 133, 144, 78, 108, 6, 10, 84, 173, 212, 220, 61, 82, 87, 248,
    ])
  );
  //  const
  //const wallet = new KeyPairWallet(aliceKeyPair);
  const xToken = new Token(
    connection,
    new PublicKey("8dv9xBuvv7czsX32tnkafSfi9d7Bh5y4Ly5stdGjEg5Z"),
    TOKEN_PROGRAM_ID,
    aliceKeyPair
  );

  const currentState = await getMetadata(connection, token);
  const associatedOwnersTokenAddress = await (
    await xToken.getOrCreateAssociatedAccountInfo(
      new PublicKey(currentState.getState().initializerPubkey)
    )
  ).address;
  const associatedBorrowerTokenAddress = await (
    await xToken.getOrCreateAssociatedAccountInfo(
      new PublicKey(currentState.getState().borrower)
    )
  ).address;

  // const associatedPdaTokenAddress = await (
  //   await Token.getAssociatedTokenAddress(currentState.getPda())
  // ).address;
  //console.log(currentState.getPda().toBase58());
  const associatedPdaTokenAddress = await connection.getTokenAccountsByOwner(
    currentState.getPda(),
    {
      mint: new PublicKey("8dv9xBuvv7czsX32tnkafSfi9d7Bh5y4Ly5stdGjEg5Z"),
    }
  );

  const resp = await withdrawTx({
    token,
    programId: config.DEVNET_PROGRAM_ID,
    connection,
  });
  const txId = await sendTransaction({
    connection,
    wallet,
    txs: resp.tx,
    signers: [],
    options: { skipPreflight: false, preflightCommitment: "confirmed" },
  });

  return `withdrawEscrowTx Completed: ${txId}`;
};

const withdrawHandler = async (
  connection: Connection,
  token: PublicKey,
  wallet: WalletContextState
) => {
  const resp = await withdrawTx({
    token,
    programId: config.DEVNET_PROGRAM_ID,
    connection,
  });
  const txId = await sendTransaction({
    connection,
    wallet,
    txs: resp.tx,
    signers: [],
    options: { skipPreflight: false, preflightCommitment: "confirmed" },
  });
  return `withdrawEscrowTx Completed: ${txId}`;
};

// TO DO add logic for buy
const Rent = ({ id, selection, type }) => {
  const { connection } = useConnection();
  const w = useWallet();
  const { publicKey, sendTransaction } = w;
  const [token, setToken] = useState(null);
  const [rentFlow, setRentFlow] = useState(false);
  const [err, setErr] = useState(null);
  const [log, setLog] = useState(null);
  const [bill, setBill] = useState(0);
  const [time, setTime] = useState(70);
  const [timeScale, setScale] = useState(0);
  const [maxMinConstraint, setMaxMinConstraint] = useState(0);
  const [rate, setRate] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [buy, setBuy] = useState(0);
  const [withdrawButton, setWithdrawButton] = useState(false);
  const [escrowState, setEscrowState] = useState(null);

  const initRent = async () => {
    setToken(id);
    setErr(null);
    setLog(null);
    try {
      const currentState = await getMetadata(connection, token);
      let amount = 0;
      //console.log(parseInt(time));
      if(sellPrice > 0){
      amount = new BN(
        (currentState.getState().sellPrice.toNumber() / LAMPORTS_PER_SOL) *
          parseInt(time) *
          LAMPORTS_PER_SOL
      );
      }
      else{
        amount = new BN(
          (currentState.getState().rate.toNumber() / LAMPORTS_PER_SOL) *
            parseInt(time) *
            LAMPORTS_PER_SOL
        );
      }
      //console.log(amount.toNumber());

      const BNtime = new BN(time);
      //console.log(BNtime.toNumber());

      const resp = await rentInit(
        connection,
        new PublicKey(token),
        w,
        amount,
        BNtime,
        buy
      );
      setLog(resp);
    } catch (error) {
      console.log(error);
      setErr(error.message);
    }
  };
  const calculateRent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      //console.log(e.target.value);
      setBill(0);
      setToken(id);
      setTime(getSeconds(timeScale, e.target.value));
      const currentState = await getMetadata(connection, token);
      setBill(
        (currentState.getState().rate.toNumber() / LAMPORTS_PER_SOL) *
          getSeconds(timeScale, e.target.value)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const withdraw = async () => {
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
      const resp = await withdrawHandler(connection, new PublicKey(token), w);
      setLog(resp);
    } catch (error) {
      console.log(error);
      setErr(error.message);
    }
  };

  const cancel = async () => {
    setErr(null);
    setLog(null);
    setToken(id);
    if (!publicKey) {
      setErr("Wallet not connected");
      return;
    }
    if (!token) setErr("no token found");
    //console.log(publicKey.toBase58());
    try {
      const resp = await cancelRent(connection, new PublicKey(token), w);
      setLog(resp);
    } catch (error) {
      console.log(error);
      setErr(error.message);
    }
  };
  const setConstraints = async (id) => {
    const currentState = await getMetadata(connection, id);
    setRate(currentState.getState().rate.toNumber() / LAMPORTS_PER_SOL);
    setSellPrice(currentState.getState().sellPrice.toNumber() / LAMPORTS_PER_SOL);
    setMaxMinConstraint(
      `${currentState
        .getState()
        .minBorrowDuration.toNumber()} s - ${currentState
        .getState()
        .maxBorrowDuration.toNumber()} s`
    );
  };
  useEffect(() => {
    if ("rent" === selection) {
      setRentFlow(true);
    }
    if ("withdraw" === selection) {
      setWithdrawButton(true);
    }
    if ("buy" === type) {
      setBuy(1);
    }
    setToken(id);
    setConstraints(id);
    setErr(null);
  }, []);
  return (
    <div className="container mx-auto center">
      <div className="flex">
        {withdrawButton ? (
          <>
            <div className="flex-auto card w-96 max-w-1/2 bg-base-100 text-primary-content shadow-2xl">
              <div className="card-body">
                <div className="card-actions">
                  <button className="btn" onClick={withdraw}>
                    Withdraw NFT
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
          </>
        ) : (
          <>
            <div className="flex-auto card-rent w-96 max-w-1/2 bg-base-100 text-primary-content shadow-2xl">
              <div className="card-body">
                {type === "rent" ? (
                  <h2 className="card-title"> RENT </h2>
                ) : (
                  <h2 className="card-title"> BUY </h2>
                )}
                <div className="flex gap-4">
                  <div> Token Id</div>
                  <div> {id}</div>

                  {type === "rent" ? (
                    <>
                      <div>Duration</div>
                      <div> {maxMinConstraint}</div>
                    </>
                  ) : (
                    ""
                  )}

                  {rentFlow ? (
                    <>
                      <div>Rate</div>
                      <div> {rate} SOL/s</div>
                    </>
                  ) : (
                    <>
                      <div>Rate</div>
                      <div> {sellPrice} SOL/s</div>
                    </>
                  )}

                  {type === "rent" ? (
                    <>
                      <input
                        type="number"
                        onChange={(e) => {
                          //setTime(parseInt(e.target.value));
                          calculateRent(e);
                        }}
                        placeholder="Duration"
                        className=" flex-auto input input-bordered input-accent  max-w-xs s"
                      />
                      <label className="label">
                        <span className="label-text">Unit</span>
                      </label>
                      <select
                        className="select select-info  "
                        onChange={(e) => {
                          setScale(parseInt(e.target.value));
                        }}
                      >
                        <option value={0}>Seconds</option>
                        <option value={1} defaultValue={true}>
                          Minutes
                        </option>
                        <option value={2}>Hours</option>
                        <option value={3}>Days</option>
                        <option value={4}>Weeks</option>
                        <option value={5}>Months</option>
                      </select>
                    </>
                  ) : (
                    ""
                  )}
                </div>

                {rentFlow ? (
                  <div className="justify-end card-actions">
                    <button className="btn" onClick={initRent}>
                      borrow It for {bill} SOL!!!
                    </button>
                    <button className="btn" onClick={cancel}>
                      return borrowed nft
                    </button>
                  </div>
                ) : (
                  <div className="justify-end card-actions">
                    <button className="btn" onClick={initRent}>
                      Buy It for {sellPrice} SOL!!!
                    </button>
                  </div>
                )}
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
          </>
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

export default Rent;
