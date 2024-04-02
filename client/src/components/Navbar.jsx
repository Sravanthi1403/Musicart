import styles from "../styles/Navbar.module.css";
import { useState } from "react";
import phone from "../assets/phone.png";
import musicicon from "../assets/music_icon.png";
import cart2 from "../assets/cart2.png";
import search from "../assets/search.png";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../store/AppContext";

export const Navbar = () => {
  const location = useLocation();

  const {
    user,
    isMobile,
    products,
    selectedProductId,
    handleKeyUp,
    cartProducts,
  } = useAppContext();
  const [userModal, setUserModal] = useState(false);
  const toggleUserModal = () => setUserModal((prev) => !prev);

  let totalQuantity = 0;

  if (cartProducts) {
    cartProducts.forEach((item) => {
      const quantity = parseInt(item.quantity);
      totalQuantity += quantity;
    });
  }

  const id = selectedProductId;

  const foundProduct = products.find((product) => product._id === id);
  console.log("found product", foundProduct);
  const getProductName = foundProduct ? foundProduct.name : "";

  const mobilePaths = [
    "/login",
    "/signup",
    "/success",
    "/checkout/:sum",
    "/invoices",
    "/invoice/:id",
  ];

  const shouldRenderNavbar = () => {
    const pathsWithoutNavbar = ["/login", "/signup", "/success"];
    return !pathsWithoutNavbar.includes(location.pathname);
  };

  const username = user ? user.username.trim() : "";
  const words = username.split(" ");

  let usernameFirstLetters;

  if (words.length === 1) {
    usernameFirstLetters = words[0].charAt(0).toUpperCase();
  } else {
    usernameFirstLetters =
      words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  }

  return (
    <>
      {isMobile ? (
        <header>
          <div className={styles.container}>
            {mobilePaths.includes(location.pathname) ? (
              // Specific layout for mobilePaths
              <div className={styles.pathChild}>
                <div className={styles.logo}>
                  <img
                    src={musicicon}
                    alt=""
                    style={{ height: "3rem", width: "3rem" }}
                  />
                  <p className={styles.logo_name}>Musicart</p>
                </div>
              </div>
            ) : (
              <div className={styles.child}>
                <div className={styles.search}>
                  <img src={search} alt="" />
                  <input
                    type="text"
                    placeholder="Search Musicart"
                    onKeyUp={handleKeyUp}
                  />
                </div>
              </div>
            )}
          </div>
        </header>
      ) : (
        <>
          {shouldRenderNavbar() && (
            <header>
              <div className={styles.container}>
                <div className={styles.child1}>
                  <div className={styles.phone}>
                    <img
                      src={phone}
                      style={{ height: "2rem", width: "2rem" }}
                      alt=""
                    />
                    <div>912121131313</div>
                  </div>
                  <div>Get 50% off on selected items | Shop Now</div>
                  {user ? (
                    <nav>
                      <Link to="/logout">Logout</Link>
                    </nav>
                  ) : (
                    <nav>
                      <Link to="/login">Login</Link>
                      &nbsp;&nbsp;|&nbsp;&nbsp;
                      <Link to="/signup">Signup</Link>
                    </nav>
                  )}
                </div>
                <div className={styles.child2}>
                  <div className={styles.childbox}>
                    <img
                      src={musicicon}
                      alt=""
                      style={{ height: "4rem", width: "4rem" }}
                    />
                    <div className={styles.align}>
                      <p className={styles.logo_name}>Musicart</p>
                      <div className={styles.nav}>
                        <Link to="/">Home</Link>
                        {location.pathname === "/viewcart" && (
                          <span>&nbsp;/&nbsp;View Cart</span>
                        )}
                        {location.pathname.startsWith("/checkout/") && (
                          <span>&nbsp;/&nbsp;Checkout</span>
                        )}
                        {(location.pathname === "/invoices" ||
                          location.pathname.startsWith("/invoice")) && (
                          <span>&nbsp;/&nbsp;Invoices</span>
                        )}
                        {location.pathname.startsWith("/product/") && (
                          <span>&nbsp;/&nbsp;{getProductName}</span>
                        )}
                      </div>
                      {user ? (
                        <div className={styles.nav}>
                          {location.pathname === "/viewcart" ||
                          // location.pathname === `/product/${id}` ||
                          location.pathname.startsWith("/product/") ||
                          location.pathname.startsWith("/checkout/") ||
                          location.pathname === "/invoices" ||
                          location.pathname.startsWith("/invoice/") ? (
                            " "
                          ) : (
                            <Link to="/invoices">Invoice</Link>
                          )}
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                  {user ? (
                    <div className={styles.childbox}>
                      <Link to="/viewcart">
                        <div className={styles.view_cart}>
                          <img
                            src={cart2}
                            alt=""
                            style={{ height: "2rem", width: "2rem" }}
                          />
                          <div>View Cart</div>
                          <div>{totalQuantity}</div>
                        </div>
                      </Link>
                      <div
                        className={styles.username}
                        onClick={toggleUserModal}
                      >
                        {usernameFirstLetters}
                        <div
                          className={`${styles.usernameModal} ${
                            userModal ? styles.openUserModal : ""
                          }`}
                        >
                          <div>{user.username}</div>
                          <div>
                            <Link to="/logout">Logout</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </header>
          )}
        </>
      )}
    </>
  );
};

{
  /* {shouldRenderNavbar() && (
        <header>
          <div className={styles.container}>
            {isMobile ? (
              <div className={styles.child}>
                <div className={styles.search}>
                  <img
                    src={search}
                    alt=""
                    style={{ height: "3rem", width: "3rem" }}
                  />
                  <input type="text" placeholder="Search Musicart" />
                </div>
              </div>
            ) : (
              <>
                <div className={styles.child1}>
                  <div className={styles.phone}>
                    <img
                      src={phone}
                      style={{ height: "2rem", width: "2rem" }}
                      alt=""
                    />
                    <div>912121131313</div>
                  </div>
                  <div>Get 50% off on selected items | Shop Now</div>
                  {isAuthenticated ? (
                    <nav>
                      <Link to="/login">Login</Link>
                      &nbsp;&nbsp;|&nbsp;&nbsp;
                      <NavLink to="/signup">Signup</NavLink>
                    </nav>
                  ) : (
                    <div>Logout</div>
                  )}
                </div>
                <div className={styles.child2}>
                  <div className={styles.childbox}>
                    <img
                      src={musicicon}
                      alt=""
                      style={{ height: "4rem", width: "4rem" }}
                    />
                    <div className={styles.align}>
                      <p className={styles.logo_name}>Musicart</p>
                      <div className={styles.nav}>
                        <NavLink to="/">Home</NavLink>
                      </div>
                      {isAuthenticated ? (
                        <div className={styles.nav}>
                          <NavLink to="/invoices">Invoice</NavLink>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                  <div className={styles.childbox}>
                    <div className={styles.view_cart}>
                      <img
                        src={cart2}
                        alt=""
                        style={{ height: "2rem", width: "2rem" }}
                      />
                      <div>View Cart</div>
                      <div>0</div>
                    </div>
                    <div className={styles.username}>DR</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>
      )} */
}
