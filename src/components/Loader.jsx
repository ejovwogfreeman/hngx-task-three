import React from "react";
import loader from "../images/loading.gif";
import "../css/Loader.css";

const Loader = () => {
  return (
    <div className="loader">
      <img src={loader} alt="" />
    </div>
  );
};

export default Loader;
