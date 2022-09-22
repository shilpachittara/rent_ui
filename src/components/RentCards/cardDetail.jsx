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
  onClickBuy,
  getBookLink
}) => {
  const [isLike, setIsLike] = useState(false);
  const [colors, setColors] = useState([]);

  const [buy, setBuy] = useState(false);

  const [bookAccess, setBookAccess] = useState(false);

  const like = () => setIsLike(!isLike);

  const getColors = (colors) => {
    setColors((c) => [...c, ...colors]);
    //console.log(colors);
  };

  const init = () => {
    if('Listed' === status){
      setBuy(true);
    }
    if('Rented' === status){
      setBookAccess(true);
    }
  }
  useEffect(() => {
    init();
  }, );

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

            <>  {buy? (
            <div className="buttons">
            <button className="buy-now" onClick={onClickBuy}>Buy</button> 
            </div>   ) : (
              <></>
            )
      }
          </>

          <>  {bookAccess? (
            <div className="buttons">
            <button className="buy-now" onClick={getBookLink}>Read</button> 
            </div>   ) : (
              <></>
            )
      }
          </>
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
