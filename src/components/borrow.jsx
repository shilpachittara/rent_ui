import React, { useEffect, useState } from "react";
import Listing from "./listings";
import Rent from "./rent";
function Toggle() {
  return (
    <div className="container mx-auto center">
      <Rent />
      <Listing />
    </div>
  );
}

export default Toggle;
