import { useState } from "react";
import styles from "../styles/LoginSignup.module.css";
import musicicon from "../assets/music_icon.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../App";
import { toast } from "react-toastify";
import { useAppContext } from "../store/AppContext";

export const Signup = () => {
  const [user, setUser] = useState({
    username: "",
    phone: "",
    email: "",
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

  const signupHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !user.username.trim() ||
      !user.phone.trim() ||
      !user.email.trim() ||
      !user.password.trim()
    ) {
      setError("*Required field");
      setLoading(false);
      return;
    } else {
      setError("");
    }

    // Validate name
    if (user.username.length < 3) {
      toast.error(
        "Please enter a valid name. It should be at least 3 characters long."
      );
      setLoading(false);
      return;
    }
    // Validate phone number
    if (!/^\d{10}$/.test(user.phone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }
    // Validate email
    if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    // Validate password
    if (user.password.length < 8) {
      toast.error("Please enter a password with at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${server}/user/signup`,
        {
          username: user.username,
          phone: user.phone,
          email: user.email,
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
        setUser({ username: "", phone: "", email: "", password: "" });
        console.log(response.data);
        setLoading(false);
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", true);
        navigate("/");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error during registration", error);
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
          <h1>Create Account</h1>
          <label htmlFor="username">Your name</label>
          <input
            type="text"
            autoComplete="off"
            required
            name="username"
            id="username"
            value={user.username}
            onChange={handleInput}
            style={error ? { border: "2px solid red" } : {}}
          />
          {error && <span className="errorText">{error}</span>}
          <label htmlFor="phone">Mobile number</label>
          <input
            type="text"
            autoComplete="off"
            required
            name="phone"
            id="phone"
            value={user.phone}
            onChange={handleInput}
            style={error ? { border: "2px solid red" } : {}}
          />
          {error && <span className="errorText">{error}</span>}
          <label htmlFor="email">Email id</label>
          <input
            type="email"
            autoComplete="off"
            required
            name="email"
            id="email"
            value={user.email}
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
          <p>
            By enrolling your mobile phone number, you consent to receive
            automated security notifications via text message from Musicart.
            Message and data rates may apply.
          </p>

          <button
            disabled={error ? true : false}
            type="submit"
            onClick={(e) => signupHandler(e)}
          >
            {loading ? "Please wait..." : "Continue"}
          </button>

          <p>
            By continuing, you agree to Musicart privacy notice and conditions
            of use.
          </p>
        </form>
        <div className={styles.nav}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </>
  );
};
