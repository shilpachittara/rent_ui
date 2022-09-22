/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useState } from "react";
import "./RentCards/styles/CardDetail.css";
import "reactjs-popup/dist/index.css";

import OwnedNft from "./ownedNft";
import BorrowedNft from "./borrowedNft";
import Marketplace from "./market";

const collection = ({ onClick }) => {
  const [sellActive, setSellActive] = React.useState(true);

  const handleBorrow = () => {
    setSellActive(false);
  };

  const handleOwner = () => {
    setSellActive(true);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="main">
          <div className="tabs tabs-boxed col-80">
            <a
              className={`tab tab-lg box outset ${
                sellActive === true ? "tab-active" : ""
              }`}
              onClick={() => handleOwner()}
            >
              Sell/List
            </a>

            <a
              className={`tab tab-lg box outset ${
                sellActive === false ? "tab-active" : ""
              }`}
              onClick={() => handleBorrow()}
            >
              Buy/Rent
            </a>
            <a
              className={"tab tab-lg"}
              style={{ width: "s200px" }}
              onClick={onClick}
            >
              Collections
            </a>
          </div>
        </div>

        {sellActive ? (
          <>
            <OwnedNft />
            <BorrowedNft />
          </>
        ) : (
          <>
            <Marketplace />
          </>
        )}
      </div>
    </>
  );
};

export default collection;
