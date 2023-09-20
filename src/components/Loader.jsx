import React from "react";
import loadingImage from "../images/loading.gif";
import "../css/Loader.css";

const Loader = () => {
  return (
    <div className="loader">
      <img src={loadingImage} alt="" />
    </div>
  );
};

export default Loader;
