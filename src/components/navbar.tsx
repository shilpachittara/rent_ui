import React from "react";
import Wallet from "../modules/wallet";
import Logo from "../img_logo.png";


function Navbar() {
  return (
    <div
      className="navbar w-11/12 mb-20 mt-5 shadow-xl rounded-box flex-1 self-center"
      style={{ backgroundColor: "white" }}
    >
      <div className="navbar-start"></div>
      <div className="navbar-center">
        <img
          src={Logo}
          className="lg:h-[18px] xl:h-[21px] 2xl:h-[23px] 3xl:h-[28px] w-[12%]"
          alt="Union One"
        />
        <div className="font-semibold" style={{ color: "rgb(40 50 76)" , margin:'auto 1px auto 6px' }}>
          StreamMoney
        </div>
      </div>
      <div className="navbar-end">
        <button
          className="btn npm"
          onClick={(e) => {
            e.preventDefault();
            window.open("https://www.npmjs.com/package/stream-nft");
          }}
        >
          VIEW SDK
        </button>
        <Wallet></Wallet>
      </div>
    </div>
  );
}
export default Navbar;
