/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Card from "./nft";

const CreateListing = ({ id ,type, onClick}) => {
  return (
    <>
      <div className="container mx-auto center">
        <Card id={id} type={type}/>
      </div>

      <button className="btn btn-left" onClick={onClick}>
                Back</button>
    </>
  );
};

export default CreateListing;
