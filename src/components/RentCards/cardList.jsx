/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import CardDetail from "./cardDetail";
import "./styles/CardList.css";
import BorrowRented from "../borrowRented";

const CardList = ({ list, type = "horizontal"}) => {

  const [openList, setOpenList] = useState(true);
  const [listItem, setListItem] = useState({});
  const openlist = (item) => {
    setOpenList(false)
    setListItem(item)
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
            status={item.listed ? "Rented" : "Listed"}
            buttonValue={item.listed ? "withdraw" : "Rent"}
            price={item.data.sellerFeeBasisPoints}
            onClick={()=>openlist(item)}
            key={index}
          />
        </>
      ))}
    </div> ) :(<BorrowRented id={listItem.id} onClick={open}/> )
}
    </>
  );
};

export default CardList;
