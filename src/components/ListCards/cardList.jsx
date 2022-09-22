/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import CardDetail from "./cardDetail";
import "./styles/CardList.css";
import CreateListing from "../createListing";

const CardList = ({ list, type = "horizontal"}) => {

  const [openList, setOpenList] = useState(true);
  const [listItem, setListItem] = useState({});
  const [selectionType, setSelectionType] = useState('lend')
  const openlist = (item) => {
    setOpenList(false)
    setListItem(item)
    // Write log for nft withdraw here
    if(buttonValue === "Withdraw"){
      console.log(item.id)
    }
  }
  const openSell = (item) => {
    setOpenList(false)
    setListItem(item)
    setSelectionType('sell')
    // Write log for nft withdraw here
  }
  const open = () => {
    setOpenList(true)
  }
  return (
    <> {openList?
     (<div
      id="card-list"
      style={{ flexDirection: type == "horizontal" ? "row" : "column" }}
    >
      {list.map((item, index) => (
        <>
          <CardDetail
            nftUri={item.data.image}
            name={item.data.name}
            status={item.value}
            buttonValue={item.buttonValue}
            price={item.data.sellerFeeBasisPoints}
            onClick={()=>openlist(item)}
            onClickSell={()=>openSell(item)}
            key={index}
          />
        </>
      ))}
    </div> ) :(<CreateListing id={listItem.id} onClick={open} type={selectionType}/> )
}
    </>
  );
};

export default CardList;
