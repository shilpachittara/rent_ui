/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useState } from "react";
import "./RentCards/styles/CardDetail.css";
import Card from "./RentCards/card";
import Image from "../img1.png";
import 'reactjs-popup/dist/index.css';


import Hamburger from 'hamburger-react'

const bookCard = ({
  onClick,

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
            <img className="nft-image" src={Image} alt="nft-image" />
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
              <p className="name">E-book collection</p>
            </div>


          </div>

          <div className="wrapper">
            <div className="info-container">
              <p className="owner"> { }</p>
              <p className="name">Available </p>
            </div>

            <div className="buttons">
            <button className="buy-now" onClick={onClick}>open</button> 
            </div>  
          </div>
        </>

      }

    ></Card>

  );

};

export default bookCard;
