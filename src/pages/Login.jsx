import React, { useState } from "react";
import "../css/Login.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubit = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sessionStorage.setItem("user", JSON.stringify(user));
        toast.success("LOGIN SUCCESSFUL");
        navigate("/");
      })
      .catch((error) => {
        toast.error("INVALID CREDRENTIALS");
        setEmail("");
        setPassword("");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubit}>
        <h2>PictureGram</h2>
        <label htmlFor="">UserNamene(Email)</label>
        <input
          type="text"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="">Password</label>
        <input
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button">
          <button>Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;

// UserName: user@example.com
// Password: 1Password
