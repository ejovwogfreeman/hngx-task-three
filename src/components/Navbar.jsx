import React from "react";
import { Link } from "react-router-dom/dist";
import {
  AiOutlineCloudUpload,
  AiOutlineMenu,
  // AiOutlineLogin,
} from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import SideNav from "./SideNav";
import "../css/Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { BiLogOutCircle } from "react-icons/bi";
import { toast } from "react-toastify";

const Navbar = ({ showSide, handleShowSide }) => {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("user");
    toast.success("YOU LOGGED OUT");
    navigate("/login");
  };
  const location = useLocation();
  return (
    <>
      {location.pathname === "/login" ? (
        ""
      ) : (
        <>
          <nav>
            <Link to="/">
              <h1>PictureGram</h1>
            </Link>
            <span className="links">
              <>
                {" "}
                <Link to="/">
                  <TfiGallery />
                  <span>Gallery</span>
                </Link>
                <Link to="/upload">
                  <AiOutlineCloudUpload />
                  <span>Upload</span>
                </Link>
                <span className="logout" onClick={logout}>
                  <BiLogOutCircle />
                  <span>Logout</span>
                </span>
              </>
              {/* {user ? (
                <>
                  {" "}
                  <Link to="/">
                    <TfiGallery />
                    <span>Gallery</span>
                  </Link>
                  <Link to="/upload">
                    <AiOutlineCloudUpload />
                    <span>Upload</span>
                  </Link>
                  <span className="logout" onClick={logout}>
                    <BiLogOutCircle />
                    <span>Logout</span>
                  </span>
                </>
              ) : (
                <>
                  {" "}
                  <Link to="/login">
                    <AiOutlineLogin />
                    <span>Login</span>
                  </Link>
                </>
              )} */}
            </span>
            <div className="side-bar">
              <AiOutlineMenu onClick={handleShowSide} />
            </div>
          </nav>
          {showSide && (
            <SideNav
              // user={user}
              logout={logout}
              showSide={showSide}
              handleShowSide={handleShowSide}
            />
          )}
        </>
      )}
    </>
  );
};

export default Navbar;
