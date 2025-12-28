import styles from "../styles/Footer.module.css";
import { useAppContext } from "../store/AppContext";
import { Link, useLocation } from "react-router-dom";
import home from "../assets/mobileHome.png";
import cart from "../assets/mobileCart.png";
import invoice from "../assets/mobileInvoice.png";
import login from "../assets/mobileLogin.png";
import logout from "../assets/mobileLogout.png";

export const Footer = () => {
  const location = useLocation();
  const { user, isMobile, cartProducts } = useAppContext();

  let totalQuantity = 0;

  if (cartProducts) {
    cartProducts.forEach((item) => {
      const quantity = parseInt(item.quantity);
      totalQuantity += quantity;
    });
  }

  const mobilePaths = ["/login", "/signup"];
  const invoicePaths = ["/checkout/:sum", "/viewcart"];

  return (
    <>
      {isMobile ? (
        <footer>
          {mobilePaths.includes(location.pathname) ? (
            <div className={styles.footer}>
              Musicart&nbsp;&nbsp;|&nbsp;&nbsp;All rights reserved
            </div>
          ) : (
            <div className={styles.nav}>
              <div
                className={location.pathname === "/" ? styles.activeLink : ""}
              >
                <Link to="/">
                  <img src={home} alt="home" />
                </Link>
                <p>Home</p>
              </div>
              <div
                className={`${styles.cart} ${
                  location.pathname === "/viewcart" ? styles.activeLink : ""
                }`}
              >
                <Link to="/viewcart">
                  <img src={cart} alt="cart" />
                  <div className={styles.cartCount}>{totalQuantity}</div>
                </Link>
                <p>Cart</p>
              </div>
              {invoicePaths.includes(location.pathname) ||
              location.pathname.startsWith("/product/") ? null : (
                <div
                  className={
                    location.pathname === "/invoices" ||
                    location.pathname.startsWith("/invoice/")
                      ? styles.activeLink
                      : ""
                  }
                >
                  <Link to="/invoices">
                    <img src={invoice} alt="invoice" />
                  </Link>
                  <p>Invoices</p>
                </div>
              )}
              <div
                className={
                  location.pathname === "/login" ||
                  location.pathname === "/logout"
                    ? styles.activeLink
                    : ""
                }
              >
                {user ? (
                  <Link to="/logout">
                    <img src={logout} alt="logout" />
                  </Link>
                ) : (
                  <Link to="/login">
                    <img src={login} alt="login!" />
                  </Link>
                )}
                {user ? <p>Logout</p> : <p>Login</p>}
              </div>
            </div>
          )}
        </footer>
      ) : (
        <footer className={styles.footer}>
          Musicart&nbsp;&nbsp;|&nbsp;&nbsp;All rights reserved
        </footer>
      )}
    </>
  );
};
