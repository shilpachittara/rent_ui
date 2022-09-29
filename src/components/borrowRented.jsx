import React, { useState } from "react";
import Rent from "./rent";

const borrowRented = ({ id , selection, onClick, type}) => {
  return (
    <>
      <div className="container mx-auto center">
        <Rent id={id}  selection={selection} type={type}/>
      </div>

      <button className="btn btn-left" onClick={onClick}>
                Back</button>
    </>
  );
};

export default borrowRented;