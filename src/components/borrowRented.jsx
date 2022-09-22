import React, { useState } from "react";
import Rent from "./rent";

const borrowRented = ({ id , onClick}) => {
  return (
    <>
      <div className="container mx-auto center">
        <Rent id={id} />
      </div>

      <button className="btn btn-left" onClick={onClick}>
                Back to Borrow </button>
    </>
  );
};

export default borrowRented;