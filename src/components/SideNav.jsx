import React from "react";
import "../css/SideNav.css";
import { Link } from "react-router-dom";
import { TfiGallery } from "react-icons/tfi";
import {
  // AiOutlineLogin,
  AiOutlineCloudUpload,
  AiOutlineClose,
} from "react-icons/ai";
import { BiLogOutCircle } from "react-icons/bi";

const SideNav = ({ logout, handleShowSide }) => {
  return (
    <>
      <div className="dark-bg" onClick={handleShowSide}></div>
      <div className="sidebar">
        <div className="logo-cont">
          <div className="logo">
            <Link to="/" onClick={handleShowSide}>
              <span className="text">
                <h2>PictureGram</h2>
              </span>
            </Link>
          </div>
          <AiOutlineClose onClick={handleShowSide} />
        </div>
        <ul className="menus">
          <>
            <li>
              <Link to="/" onClick={handleShowSide}>
                <TfiGallery className="icon" />
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/upload" onClick={handleShowSide}>
                <AiOutlineCloudUpload className="icon" />
                Upload
              </Link>
            </li>
            <li onClick={logout} className="logout-mobile">
              <BiLogOutCircle className="icon" />
              <span>Logout</span>
            </li>
          </>
          {/* {user ? (
            <>
              <li>
                <Link to="/" onClick={handleShowSide}>
                  <TfiGallery className="icon" />
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/upload" onClick={handleShowSide}>
                  <AiOutlineCloudUpload className="icon" />
                  Upload
                </Link>
              </li>
              <li onClick={logout} className="logout-mobile">
                <BiLogOutCircle className="icon" />
                <span>Logout</span>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" onClick={handleShowSide}>
                <AiOutlineLogin className="icon" />
                Login
              </Link>
            </li>
          )} */}
        </ul>
      </div>
    </>
  );
};

export default SideNav;
