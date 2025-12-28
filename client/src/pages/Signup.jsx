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

  // ✅ local form error (DO NOT use global error for forms)
  const [formError, setFormError] = useState("");

  const { isMobile, loading, setLoading, setIsLoggedIn } = useAppContext();
  const navigate = useNavigate();

  // handle input change
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    // empty field validation
    if (
      !user.username.trim() ||
      !user.phone.trim() ||
      !user.email.trim() ||
      !user.password.trim()
    ) {
      setFormError("*Required field");
      setLoading(false);
      return;
    } else {
      setFormError("");
    }

    // name validation
    if (user.username.length < 3) {
      toast.error("Name must be at least 3 characters");
      setLoading(false);
      return;
    }

    // phone validation
    if (!/^\d{10}$/.test(user.phone)) {
      toast.error("Enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }

    // email validation
    if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      toast.error("Enter a valid email address");
      setLoading(false);
      return;
    }

    // password validation
    if (user.password.length < 8) {
      toast.error("Password must be at least 8 characters");
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
          headers: { "Content-Type": "application/json" },
        }
      );

      setUser({ username: "", phone: "", email: "", password: "" });
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", true);
      toast.success(response.data.message || "Signup successful");
      navigate("/");
    } catch (error) {
      // ✅ SAFE axios error handling
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";

      toast.error(message);

      setIsLoggedIn(false);
      localStorage.setItem("isLoggedIn", false);
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <form className={styles.form} onSubmit={signupHandler}>
        <h1>Create Account</h1>

        <label>Your name</label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleInput}
          style={formError ? { border: "2px solid red" } : {}}
        />
        {formError && <span className="errorText">{formError}</span>}

        <label>Mobile number</label>
        <input
          type="text"
          name="phone"
          value={user.phone}
          onChange={handleInput}
          style={formError ? { border: "2px solid red" } : {}}
        />
        {formError && <span className="errorText">{formError}</span>}

        <label>Email id</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleInput}
          style={formError ? { border: "2px solid red" } : {}}
        />
        {formError && <span className="errorText">{formError}</span>}

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleInput}
          style={formError ? { border: "2px solid red" } : {}}
        />
        {formError && <span className="errorText">{formError}</span>}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Continue"}
        </button>
      </form>

      <div className={styles.nav}>
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
};
