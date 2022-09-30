/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import CardDetail from "./cardDetail";
import "./styles/CardList.css";
import CreateListing from "../createListing";

const CardList = ({ list, type = "horizontal" }) => {
  const [openList, setOpenList] = useState(true);
  const [listItem, setListItem] = useState({});
  const [selectionType, setSelectionType] = useState("lend");
  const openlist = (item) => {
    setOpenList(false);
    setListItem(item);
    // Write log for nft withdraw here
    if (buttonValue === "Withdraw") {
      console.log(item.id);
    }
  };

  const openSell = (item) => {
    setOpenList(false);
    setListItem(item);
    setSelectionType("sell");
    // Write log for nft withdraw here
  };
  const open = () => {
    setOpenList(true);
  };
  const readbook =(item) => {
    const found = item.attributes.find(obj => {
      return obj.trait_type === "url";
    });
    const url = found.value;
      window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <>
      {" "}
      {openList ? (
          <CardDetail
            id={list.id}
            nftUri={list.image}
            name={list.name}
            status={list.value}
            buttonValue={list.buttonValue}
            price={list.sellerFeeBasisPoints}
            onClick={() => openlist(list)}
            onClickSell={() => openSell(list)}
            getBookLink={()=>readbook(list)}
          />
      ) : (
        <CreateListing id={listItem.id} onClick={open} type={selectionType} />
      )}
    </>
  );
};

export default CardList;
