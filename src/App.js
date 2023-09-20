import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ImageUpload from "./pages/ImageUpload";
import ImageGallery from "./pages/ImageGallery";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Toastify from "./components/Toastify";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [showSide, setShowSide] = useState(false);
  const handleShowSide = () => {
    setShowSide(!showSide);
    console.log("hello");
  };
  return (
    <BrowserRouter>
      <Toastify />
      <Navbar showSide={showSide} handleShowSide={handleShowSide} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<ImageGallery />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/upload" element={<ImageUpload />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
