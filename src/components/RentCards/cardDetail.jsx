/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import "./styles/CardDetail.css";
import Card from "./card";
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
  onClickBuy,
  getBookLink,
}) => {
  const [isLike, setIsLike] = useState(false);
  const [colors, setColors] = useState([]);

  const [buy, setBuy] = useState(false);

  const [bookAccess, setBookAccess] = useState(false);

  const { connection } = useConnection();
  const w = useWallet();
  const [maxMinConstraint, setMaxMinConstraint] = useState("0 s");
  const [rate, setRate] = useState(0);
  const [button, setButton] = useState("Rent");
  const [rentFlow, setRentFlow] = useState(true);

  const like = () => setIsLike(!isLike);

  const getColors = (colors) => {
    setColors((c) => [...c, ...colors]);
    //console.log(colors);
  };

  const setConstraints = async (id) => {
    const currentState = await getMetadata(connection, id);
    setRate(currentState.getState().rate.toNumber() / LAMPORTS_PER_SOL);

    setMaxMinConstraint(
      `${currentState
        .getState()
        .minBorrowDuration.toNumber()} s - ${currentState
        .getState()
        .maxBorrowDuration.toNumber()} s`
    );
    if (currentState.getState().sellPrice.toNumber() > 0) {
      setRate(currentState.getState().sellPrice.toNumber() / LAMPORTS_PER_SOL);
      setButton("Buy");
      setMaxMinConstraint("");
    }
  };

  const init = () => {
    if ("Listed" === status) {
      setBuy(true);
    }
    if ("Rented" === status) {
      setBookAccess(true);
    }
  };
  useEffect(() => {
    init();
    setConstraints(id);
  });

  return (
    <Card
      blurColor={colors[0]}
      child={
        <>
          <div>
            <img className="nft-image" src={nftUri} alt="nft-image" />{" "}
          </div>

          <div className="wrapper">
            <div className="info-container">
              <p className="owner"> {}</p>
              <p className="name">{name}</p>
            </div>
          </div>

          <div className="wrapper">
            <p className="name">
              {rate} SOL, {maxMinConstraint}
            </p>
          </div>

          <div className="wrapper">
            <div className="info-container">
              <p className="owner"> {}</p>
              <p className="name">{status}</p>
            </div>

            <>
              {" "}
              {buy && button === "Buy" ? (
                <div className="buttons">
                  <button className="buy-now" onClick={onClickBuy}>
                    Buy
                  </button>
                </div>
              ) : (
                <></>
              )}
            </>

            <>
              {" "}
              {bookAccess ? (
                <div className="buttons">
                  <button className="buy-now" onClick={getBookLink}>
                    Read
                  </button>
                </div>
              ) : (
                <></>
              )}
            </>
            <>
              {" "}
              {buttonValue && button === "Rent" ? (
                <div className="buttons">
                  <button className="buy-now" onClick={onClick}>
                    {buttonValue}
                  </button>
                </div>
              ) : (
                <></>
              )}
            </>
          </div>
        </>
      }
    ></Card>
  );
};

export default cardDetail;
