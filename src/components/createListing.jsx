/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Card from "./nft";

const CreateListing = ({ id , onClick}) => {
  return (
    <>
      <div className="container mx-auto center">
        <Card id={id} />
      </div>

      <button className="btn btn-left" onClick={onClick}>
                Back to Listing </button>
    </>
  );
};

export default CreateListing;
