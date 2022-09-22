/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import "./styles/CardDetail.css";
import Card from "./card";

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
}) => {
  const [isLike, setIsLike] = useState(false);
  const [colors, setColors] = useState([]);

  const like = () => setIsLike(!isLike);

  const getColors = (colors) => {
    setColors((c) => [...c, ...colors]);
    //console.log(colors);
  };

  return (
    <Card
      blurColor={colors[0]}
      child={
        <>
    
            <div > 
              <img className="nft-image" src={nftUri} alt="nft-image"/>
              {" "}
            </div>
         
          <div className="wrapper">
            <div className="info-container">
              <p className="owner"> {}</p>
              <p className="name">{name}</p>
            </div>

           
          </div>

          <div className="wrapper">
            <div className="info-container">
              <p className="owner"> {}</p>
              <p className="name">{status}</p>
            </div>

            <> {buttonValue? (
            <div className="buttons">
            <button className="buy-now" onClick={onClick}>{buttonValue}</button> 
            </div> ) : (
            <div className="price-container">
            <p className="price-label">Price</p>
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
