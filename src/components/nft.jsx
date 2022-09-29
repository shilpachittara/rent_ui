/* eslint-disable react/prop-types */
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { TimeDurationInput } from "react-time-duration-input";
import "./ListCards/styles/nft.css";

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
  revenueShare: number,
  sellPrice: number
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
    sellPrice: new BN(sellPrice),
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

const Card = ({ id, type, img, buttonValue }) => {
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
  const [sellPrice, setSellPrice] = useState(0);
  const [cancelButton, setCancelButton] = useState(false);

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
        revenueShare,
        sellPrice
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

  const [rentType, setChecked] = useState("Fixed Price");

  function onChangeValue(event) {
    setChecked(event.target.value);
    console.log(event.target.value);
  }

  const radiobtn = "Fixed Price";

  return (
    <>
      {buttonValue === "Cancel" ? (
        <>
          <div className="container mx-auto center ">
            <div className="flex w-70 m-auto">
              <div className="flex-auto card-cancel z-70 w-32 max-w-32 bg-primary text-primary-content shadow-2xl new-card">
                <div className="card-body d-block">
                  <button className="btn" onClick={cancelEscrow}>
                    Cancel Listing
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
            </div>
          </div>
        </>
      ) : (
        <div className="container mx-auto center ">
          <div className="flex w-70 m-auto">
            <div className="flex-auto card z-70 w-32 max-w-32 bg-primary text-primary-content shadow-2xl new-card">
              <div className="card-body d-block">
                {type === "sell" ? (
                  <h1 className="card-title"> Selling Details </h1>
                ) : (
                  <h1 className="card-title"> Renting Details </h1>
                )}
                <div>
                  <img
                    src={img}
                    alt=""
                    className="token-img"
                    onClick={""}
                  ></img>
                </div>
                <div className="flex gap-4 listing-header">
                  <div> Token Id : </div>
                  <div> {id}</div>
                </div>
                <div></div>
                <div className="form-control flex gap-4 w-full">
                  {type === "sell" ? (
                    <>
                      <div className="d-flex" FixedPrice>
                        <h3 className="head w-30">Sell Price</h3>
                        <input
                          type="number"
                          placeholder="Sell Price"
                          className="input input-bordered input-accent "
                          onChange={(e) =>
                            setSellPrice(parseFloat(e.target.value))
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Minimum Rent Duration */}
                      <div className="d-flex">
                        <h3 className="head w-30 ">Minimum Rent Duration</h3>
                        <input
                          type="number"
                          placeholder="Minimum Rent Duration"
                          className="input input-bordered input-accent"
                          onChange={(e) =>
                            setMinDuration(parseInt(e.target.value))
                          }
                        />
                        <select
                          name="Unit"
                          className="select select-info  "
                          onChange={(e) => {
                            setTimeScaleMinBorrow(parseInt(e.target.value));
                          }}
                        >
                          <option value="" disabled selected hidden>
                            Unit
                          </option>
                          <option value={0}>Seconds</option>
                          <option value={1}>Minutes</option>
                          <option value={2}>Hours</option>
                          <option value={3}>Days</option>
                          <option value={4}>Weeks</option>
                          <option value={5}>Months</option>
                        </select>
                      </div>

                      {/* Maximum Rent Duration */}

                      <div className="d-flex">
                        <h3 className="head w-30 ">Maximum Rent Duration</h3>
                        <input
                          type="number"
                          placeholder="Maximum Rent Duration"
                          className=" input input-bordered input-accent"
                          onChange={(e) =>
                            setMaxDuration(parseInt(e.target.value))
                          }
                        />
                        <select
                          name="Unit"
                          className="select select-info"
                          onChange={(e) => {
                            setTimeScaleMaxBorrow(parseInt(e.target.value));
                          }}
                        >
                          <option value="" disabled selected hidden>
                            Unit
                          </option>
                          <option value={0}>Seconds</option>
                          <option value={1}>Minutes</option>
                          <option value={2}>Hours</option>
                          <option value={3}>Days</option>
                          <option value={4}>Weeks</option>
                          <option value={5}>Months</option>
                        </select>
                      </div>

                      <div className="d-flex" FixedPrice>
                        <h3 className="head w-30">Rent Price</h3>
                        <input
                          type="number"
                          placeholder="Rate Price"
                          className="input input-bordered input-accent "
                          onChange={(e) => setRate(parseFloat(e.target.value))}
                        />
                        <select
                          name="Unit"
                          className="select select-info  "
                          onChange={(e) => {
                            setTimeScaleMaxBorrow(parseInt(e.target.value));
                          }}
                        >
                          <option value="" disabled selected hidden>
                            Unit
                          </option>
                          <option value={0}>Seconds</option>
                          <option value={1}>Minutes</option>
                          <option value={2}>Hours</option>
                          <option value={3}>Days</option>
                          <option value={4}>Weeks</option>
                          <option value={5}>Months</option>
                        </select>
                        <select
                          className="select select-info  "
                          onChange={(e) => {
                            "";
                          }}
                        >
                          <option value="" disabled selected hidden>
                            Curreny
                          </option>
                          <option value={0}>SOL</option>
                          <option value={1}>USDC</option>
                        </select>
                      </div>
                      {/* Rent Contract Type 

                      <div className="d-flex">
                        <h3 className="head w-30">Rent Contract Type</h3>
                        <div onChange={onChangeValue}>
                          <input
                            type="radio"
                            className="input-mar"
                            name="rentType"
                            value="FixedPrice"
                            checked={rentType === "FixedPrice"}
                            onChange={(e) => {
                              setChecked(e.target.value);
                              console.log("show task details");
                            }}
                          />{" "}
                          Fixed Price
                          <input
                            type="radio"
                            className="input-mar"
                            name="rentType"
                            value="RevenueSharing"
                            checked={rentType === "RevenueSharing"}
                            onChange={(e) => {
                              setChecked(e.target.value);
                              console.log("show this task details");
                            }}
                          />{" "}
                          Revenue Sharing
                          <input
                            type="radio"
                            className="input-mar"
                            name="rentType"
                            value="Hybrid"
                            checked={rentType === "Hybrid"}
                          />{" "}
                          Hybrid
                        </div>
                      </div>
                    */}

                      {/* Rent Price 
                      {(function () {
                        if (
                          rentType === "FixedPrice" ||
                          rentType === "Hybrid"
                        ) {
                          return (
                            <div className="d-flex" FixedPrice>
                              <h3 className="head w-30">Rent Price</h3>
                              <input
                                type="number"
                                placeholder="Rate Price"
                                className="input input-bordered input-accent "
                                onChange={(e) =>
                                  setRate(parseFloat(e.target.value))
                                }
                              />
                              <select
                                name="Unit"
                                className="select select-info  "
                                onChange={(e) => {
                                  setTimeScaleMaxBorrow(
                                    parseInt(e.target.value)
                                  );
                                }}
                              >
                                <option value="" disabled selected hidden>
                                  Unit
                                </option>
                                <option value={0}>Seconds</option>
                                <option value={1}>Minutes</option>
                                <option value={2}>Hours</option>
                                <option value={3}>Days</option>
                                <option value={4}>Weeks</option>
                                <option value={5}>Months</option>
                              </select>
                              <select
                                className="select select-info  "
                                onChange={(e) => {
                                  "";
                                }}
                              >
                                <option value="" disabled selected hidden>
                                  Curreny
                                </option>
                                <option value={0}>SOL</option>
                                <option value={1}>USDC</option>
                              </select>
                            </div>
                          );
                        }
                      })()}
*/}
                      {/* Revenue Split 

                      {(function () {
                        if (
                          rentType === "RevenueSharing" ||
                          rentType === "Hybrid"
                        ) {
                          return (
                            <div className="d-flex">
                              <h3 className="head w-30">Revenue Split</h3>
                              <input
                                type="number"
                                placeholder="Owner share %"
                                className="input input-bordered input-accent w-full "
                                onChange={(e) =>
                                  setRevenueShare(parseInt(e.target.value))
                                }
                              />
                              <input
                                type="number"
                                placeholder="Borrower Share % "
                                className="input input-bordered input-accent w-full "
                                onChange={""}
                              />
                            </div>
                          );
                        }
                      })()}
 */}
                      {/* Revocation Trigger */}

                      {(function () {
                        if (rentType === "Hybrid") {
                          return (
                            <div className="d-flex">
                              <h3 className="head w-30">Revocation Trigger</h3>
                              <input
                                type="number"
                                placeholder="Reward"
                                className="input input-bordered input-accent w-full "
                                onChange={""}
                              />
                              <select
                                className="select select-info  "
                                onChange={(e) => {
                                  "";
                                }}
                              >
                                <option value="" disabled selected hidden>
                                  Curreny
                                </option>
                                <option value={0}>SOL</option>
                                <option value={1}>USDC</option>
                              </select>
                              <p style={{ margin: "auto 1px auto 6px" }}>in</p>
                              <input
                                type="number"
                                placeholder="Time Period"
                                className="input input-bordered input-accent w-full "
                                onChange={""}
                              />
                            </div>
                          );
                        }
                      })()}
                    </>
                  )}
                  {/* <label className="label">
                <span className="label-text">Unit</span>
              </label>
              <select
                className="select select-info  "
                onChange={(e) => {
                  setTimeScale(parseInt(e.target.value));
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
              </select> */}

                  {/* <input
                type="number"
                placeholder="Minimum Rent Duration"
                className=" flex-auto input input-bordered input-accent w-full "
                onChange={(e) => setMinDuration(parseInt(e.target.value))}
              />
              <label className="label">
                <span className="label-text">Unit</span>
              </label> */}

                  {/* <select
                className="select select-info  "
                onChange={(e) => {
                  setTimeScaleMinBorrow(parseInt(e.target.value));
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
              </select> */}
                  {/* <input
                type="number"
                placeholder="Maximum Rent Duration"
                className=" flex-auto input input-bordered input-accent w-full "
                onChange={(e) => setMaxDuration(parseInt(e.target.value))}
              /> */}
                  {/* <label className="label">
                <span className="label-text">Unit</span>
              </label> */}
                  {/* <select
                className="select select-info  "
                onChange={(e) => {
                  setTimeScaleMaxBorrow(parseInt(e.target.value));
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
              </select> */}
                </div>{" "}
                <div className="justify-end card-actions justify-center">
                  <button className="btn" onClick={initalizeEscrow}>
                    Initialize Token Listing
                  </button>
                  {/* <button className="btn" onClick={fetchMetadata}>
                Listed Token Status
              </button>
              <button className="btn" onClick={cancelEscrow}>
                Withdraw Token Listing
              </button> */}
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
      )}
    </>
  );
};

export default Card;
