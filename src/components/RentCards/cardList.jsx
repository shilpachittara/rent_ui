/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import CardDetail from "./cardDetail";
import "./styles/CardList.css";
import BorrowRented from "../borrowRented";

const CardList = ({ list, type = "horizontal"}) => {

  const [openList, setOpenList] = useState(true);
  const [openSelected, setOpenSelected] = useState();
  const [listItem, setListItem] = useState({});
  const openlist = (item) => {
    setOpenList(false)
    setListItem(item)
    if(item.listed){
      setOpenSelected('withdraw');
    }
    else {
    setOpenSelected('rent')
    }
  }
  const openbuy = (item) => {
    setOpenList(false)
    setListItem(item)
    setOpenSelected('buy')
  }
  const open = () => {
    setOpenList(true)
  }
  const readbook =(item) => {
    const found = item.data.attributes.find(obj => {
      return obj.trait_type === "url";
    });
    const url = found.value;
      window.open(url, '_blank', 'noopener,noreferrer');
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
            id={item.id}
            name={item.data.name}
            status={item.listed ? "Rented" : "Listed"}
            buttonValue={item.listed ? "withdraw" : "Rent"}
            price={item.data.sellerFeeBasisPoints}
            onClick={()=>openlist(item)}
            onClickBuy={()=>openbuy(item)}
            getBookLink={()=>readbook(item)}
            key={index}
          />
        </>
      ))}
    </div> ) :(<BorrowRented id={listItem.id} onClick={open} selection={openSelected} type={openSelected}/> )
}
    </>
  );
};

export default CardList;
