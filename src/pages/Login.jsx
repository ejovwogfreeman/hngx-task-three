import React, { useState } from "react";
import "../css/Login.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      sessionStorage.setItem("user", JSON.stringify(user));
      toast.success("LOGIN SUCCESSFUL");
      navigate("/");
    } catch (error) {
      toast.error("INVALID CREDENTIALS");
      setEmail("");
      setPassword("");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>PictureGram</h2>
        <label htmlFor="">Username (Email)</label>
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
          <button disabled={isLoading} type="submit">
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

// UserName: user@example.com
// Password: 1Password
