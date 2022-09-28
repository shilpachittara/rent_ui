/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useState } from "react";
import "./RentCards/styles/CardDetail.css";
import "reactjs-popup/dist/index.css";

import OwnedNft from "./ownedNft";
import BorrowedNft from "./borrowedNft";
import Marketplace from "./market";

const collection = ({ onClick }) => {
  const [sellActive, setSellActive] = React.useState(0);

  const handleRent = () => {
    setSellActive(1);
  };

  const handleOwner = () => {
    setSellActive(0);
  };

  const handleBorrow = () => {
    setSellActive(2);
  };
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="main">
          <div className="tabs tabs-boxed col-80">
            <a
              className={`tab tab-lg box outset ${
                sellActive === 0 ? "tab-active" : ""
              }`}
              onClick={() => handleOwner()}
            >
              Sell/List
            </a>

            <a
              className={`tab tab-lg box outset ${
                sellActive === 1 ? "tab-active" : ""
              }`}
              onClick={() => handleRent()}
            >
              Buy/Rent
            </a>
            <a
              className={`tab tab-lg box outset ${
                sellActive === 2 ? "tab-active" : ""
              }`}
              style={{ width: "s200px" }}
              onClick={() => handleBorrow()}
            >
              Borrow
            </a>
          </div>
        </div>

        {sellActive === 0 ? (
          <OwnedNft />
        ) : sellActive === 1 ? (
          <Marketplace />
        ) : (
          <BorrowedNft />
        )}
      </div>
    </>
  );
};

export default collection;
