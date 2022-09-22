import React from "react";

import Card from "./nft";
import OwnedList from "./ownedList";
function Init() {
  return (
    <div className="container mx-auto center">
      <Card />
      <OwnedList />
    </div>
  );
}

export default Init;
