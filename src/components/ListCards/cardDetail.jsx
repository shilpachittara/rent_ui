/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useState } from "react";
import "./styles/CardDetail.css";
import Card from "./card";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Nft from "../nft";
import NftSell from "../nftSell";

import WithdrawNft from "../withdrawNft";

import Modal from "@material-ui/core/Modal";

import Hamburger from "hamburger-react";

import { queryTokenState, config } from "stream-nft";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const getMetadata = async (connection: Connection, token: string) => {
  return await queryTokenState({
    programId: config.DEVNET_PROGRAM_ID,
    tokenAddress: new PublicKey(token),
    connection,
  });
};

const cardDetail = ({
  id,
  name,
  status,
  nftName,
  price,
  buttonValue,
  nftUri,
  likeCount,
  gradient,
  onClick,
  onClickSell,
}) => {
  const [isLike, setIsLike] = useState(false);
  const [colors, setColors] = useState([]);
  const [sell, setSell] = useState(false);

  const like = () => setIsLike(!isLike);

  const getColors = (colors) => {
    setColors((c) => [...c, ...colors]);
    //console.log(colors);
  };
  const [navbarOpen, setNavbarOpen] = useState(false);

  const [open, setOpen] = React.useState(false);
  const [openSell, setOpenSell] = React.useState(false);
  const [isOpen, Open] = useState(false);
  const [isOpenSell, OpenSell] = useState(false);
  const { connection } = useConnection();
  const w = useWallet();
  const [maxMinConstraint, setMaxMinConstraint] = useState("0 s");
  const [rate, setRate] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [rentFlow, setRentFlow] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOpenSell = () => {
    setOpenSell(true);
  };

  const handleCloseSell = () => {
    setOpenSell(false);
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
    if (status === "Owned") {
      setSell(true);

      setRentFlow(false);
    } else {
      setConstraints(id);
    }
  }, []);
  return (
    <Card
      blurColor={colors[0]}
      child={
        <>
          <div>
            <img className="nft-image" src={nftUri} alt="nft-image" />{" "}
          </div>
          {(function () {
            if (isOpen) {
              return (
                <div className="ham-menu">
                  <p className="ham-item">View</p>
                  <hr></hr>
                  <p className="ham-item">Metadata</p>
                </div>
              );
            }
          })()}

          <div className="wrapper">
            <div className="info-container">
              <p className="owner"> {}</p>
              <p className="name">{name}</p>
            </div>
          </div>

          {rentFlow ? (
            <div className="wrapper">
              <p className="name">
                {rate} SOL, {maxMinConstraint}
              </p>
            </div>
          ) : (
            <div className="wrapper">
              <p className="name">
                {sellPrice} SOL, {maxMinConstraint}
              </p>
            </div>
          )}

          <div className="wrapper">
            <div className="info-container">
              <p className="owner"> {}</p>
              <p className="name">{status}</p>
            </div>

            <>
              {sell ? (
                <div className="buttons">
                  <button
                    className="buy-now"
                    type="button"
                    onClick={handleOpenSell}
                  >
                    Sell
                  </button>
                  <Modal
                    onClose={handleCloseSell}
                    open={openSell}
                    style={{
                      // position: 'relative',
                      // border: '2px solid #000',
                      // background:'rgb(18 19 17 / 86%)',
                      boxShadow: "2px solid black",
                      height: "fit-content",
                      margin: "auto",
                    }}
                  >
                    <NftSell id={id} img={nftUri} type={"sell"} />
                    {/* <WithdrawNft></WithdrawNft> */}
                  </Modal>
                </div>
              ) : (
                ""
              )}
            </>
            <>
              {buttonValue ? (
                <div className="buttons">
                  <button
                    className="buy-now"
                    type="button"
                    onClick={handleOpen}
                  >
                    {buttonValue}
                  </button>
                  <Modal
                    onClose={handleClose}
                    open={open}
                    style={{
                      // position: 'relative',
                      // border: '2px solid #000',
                      // background:'rgb(18 19 17 / 86%)',
                      boxShadow: "2px solid black",
                      height: "fit-content",
                      margin: "auto",
                    }}
                  >
                    <Nft
                      id={id}
                      img={nftUri}
                      type={"lend"}
                      buttonValue={buttonValue}
                    ></Nft>
                    {/* <WithdrawNft></WithdrawNft> */}
                  </Modal>
                </div>
              ) : (
                //       <div className="buttons">
                //         <button className="buy-now" onClick={onClick}>{buttonValue}</button>
                //       </div>

                <div className="price-container">
                  <p className="price-label">{price}</p>
                  <p className="price"> {price}</p>
                </div>
              )}
            </>
          </div>
        </>
      }
    ></Card>
  );
};

export default cardDetail;
