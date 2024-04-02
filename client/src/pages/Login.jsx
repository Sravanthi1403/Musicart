import { useState } from "react";
import styles from "../styles/LoginSignup.module.css";
import musicicon from "../assets/music_icon.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../App";
import { toast } from "react-toastify";
import { useAppContext } from "../store/AppContext";

export const Login = () => {
  const [user, setUser] = useState({
    PhoneOrEmail: "",
    password: "",
  });

  const { isMobile, loading, setLoading, setIsLoggedIn, error, setError } =
    useAppContext();

  const navigate = useNavigate();

  // handling the input values
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user.PhoneOrEmail.trim() || !user.password.trim()) {
      setError("*Required field");
      setLoading(false);
      return;
    } else {
      setError("");
    }

    // Checking if PhoneOrEmail is a valid email address
    if (/^\d+$/.test(user.PhoneOrEmail)) {
      // Validate phone number
      if (!/^\d{10}$/.test(user.PhoneOrEmail)) {
        toast.error("Please enter a valid 10-digit mobile number.");
        setLoading(false);
        return;
      }
    } else {
      // Validate email
      if (!/^\S+@\S+\.\S+$/.test(user.PhoneOrEmail)) {
        toast.error("Please enter a valid email address.");
        setLoading(false);
        return;
      }
    }

    // Validate password
    if (!user.password || user.password.length < 8) {
      toast.error(
        !user.password
          ? "Password field cannot be empty."
          : "Please enter a password with at least 8 characters."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${server}/user/login`,
        {
          PhoneOrEmail: user.PhoneOrEmail,
          password: user.password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setUser({ PhoneOrEmail: "", password: "" });
        console.log(response.data);
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", true);
        setLoading(false);
        navigate("/");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error during login", error);
      setLoading(false);
      setIsLoggedIn(false);
      localStorage.setItem("isLoggedIn", false);
    }
  };

  return (
    <>
      <div className={styles.formContainer}>
        <div className={styles.company}>
          {isMobile ? (
            <p>Welcome</p>
          ) : (
            <>
              <img
                src={musicicon}
                alt=""
                style={{ height: "3rem", width: "3rem" }}
              />
              <p>Musicart</p>
            </>
          )}
        </div>
        <form className={styles.form}>
          <h1>Sign in</h1>
          <label htmlFor="PhoneOrEmail">
            Enter your email or mobile number
          </label>
          <input
            type="text"
            autoComplete="off"
            required
            name="PhoneOrEmail"
            id="PhoneOrEmail"
            value={user.PhoneOrEmail}
            onChange={handleInput}
            style={error ? { border: "2px solid red" } : {}}
          />
          {error && <span className="errorText">{error}</span>}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            autoComplete="off"
            required
            name="password"
            id="password"
            value={user.password}
            onChange={handleInput}
            style={error ? { border: "2px solid red" } : {}}
          />
          {error && <span className="errorText">{error}</span>}
          <button type="submit" onClick={(e) => loginHandler(e)}>
            {loading ? "Please wait..." : "Continue"}
          </button>
          <p>
            By continuing, you agree to Musicart privacy notice and conditions
            of use.
          </p>
        </form>
        <div className={styles.nav}>
          <div className={styles.navChild1}>
            <div></div>
            New to Musicart?
            <div></div>
          </div>
          <Link to="/signup">
            <div className={styles.navChild2}>Create your Musicart account</div>
          </Link>
        </div>
      </div>
    </>
  );
};
