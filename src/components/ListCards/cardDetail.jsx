/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useState } from "react";
import "./styles/CardDetail.css";
import Card from "./card";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Nft from "../nft";
import WithdrawNft from "../withdrawNft"

import Modal from '@material-ui/core/Modal';

import Hamburger from 'hamburger-react'

const cardDetail = ({
  name,
  status,
  nftName,
  price,
  buttonValue,
  nftUri,
  likeCount,
  gradient,
  onClick,
  onClickSell
}) => {
  const [isLike, setIsLike] = useState(false);
  const [colors, setColors] = useState([]);
  const [sell, setSell] = useState(false);


  const like = () => setIsLike(!isLike);

  const getColors = (colors) => {
    setColors((c) => [...c, ...colors]);
    //console.log(colors);
  };
  const [navbarOpen, setNavbarOpen] = useState(false)

  const [open, setOpen] = React.useState(false);
  const [isOpen, Open] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (

    <Card
      blurColor={colors[0]}
      child={
        <>
          <div >
          <Hamburger toggled={isOpen} toggle={Open} direction="right" label="Show menu" />
            <img className="nft-image" src={nftUri} alt="nft-image" />
            {" "}

          </div>
          {(function(){
          if (isOpen) {
          return <div className="ham-menu">
            <p className="ham-item">View</p>
            <hr></hr>
            <p className="ham-item" >Metadata</p>
          </div>
        }})()}

          <div className="wrapper">
            <div className="info-container">
              <p className="owner"> { }</p>
              <p className="name">{name}</p>
            </div>


          </div>

          <div className="wrapper">
            <div className="info-container">
              <p className="owner"> { }</p>
              <p className="name">{status}</p>
            </div>

            <>  {sell? (
            <div className="buttons">
            <button className="buy-now" onClickSell={onClickSell}>Sell</button> 
            </div>   ) : (
              <></>
            )
      }
      </>
            <> 
            {buttonValue ? (
              <div className="buttons" >
                <button className="buy-now" type="button"
                  onClick={handleOpen}>
                  {buttonValue}
                </button>
                <Modal
                  onClose={handleClose}
                  open={open}
                  style={{
                    // position: 'relative',
                    // border: '2px solid #000',
                    // background:'rgb(18 19 17 / 86%)',
                    boxShadow: '2px solid black',
                    height: 'fit-content',
                    margin: 'auto',
                  }}
                >
                  <Nft></Nft>
                  {/* <WithdrawNft></WithdrawNft> */}
                </Modal>
              </div>) : (
              //       <div className="buttons">
              //         <button className="buy-now" onClick={onClick}>{buttonValue}</button> 
              //       </div>

              <div className="price-container">
                <p className="price-label">{price}</p>
                <p className="price">
                  {" "}
                  {price}
                </p>
              </div>)
            }
            </>
          </div>
        </>

      }

    ></Card>

  );

};

export default cardDetail;
