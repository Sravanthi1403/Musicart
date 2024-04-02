import styles from "../styles/ViewCart.module.css";
import { Link } from "react-router-dom";
import { useAppContext } from "../store/AppContext";
import backArrow from "../assets/backArrow.png";
import myCart from "../assets/myCart.png";
import axios from "axios";
import { server } from "../App";

export const ViewCart = () => {
  const { isMobile, cartProducts, setIsCartUpdated, loading } = useAppContext();

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    try {
      const response = await axios.put(
        `${server}/cart/updateQuantity`,
        { cartItemId, newQuantity },
        { withCredentials: true }
      );
      console.log("Quantity updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsCartUpdated(true);
      setTimeout(() => {
        setIsCartUpdated(false);
      }, 1000);
    }
  };

  let totalSum = 0;

  cartProducts.forEach((item) => {
    const itemPrice = parseInt(item.productId.price.replace(",", ""));
    const itemQuantity = parseInt(item.quantity);
    totalSum += itemPrice * itemQuantity;
  });
  const orderPrice = totalSum + 45;

  return (
    <>
      <div className={styles.viewCartContainer}>
        <div className={styles.backButton}>
          <Link to="/">
            {isMobile ? (
              <div>
                <img src={backArrow} alt="" />
              </div>
            ) : (
              <button>Back to products</button>
            )}
          </Link>
        </div>
        <div className={styles.myCartHeading}>
          <img src={myCart} alt="" />
          <h1>My Cart</h1>
        </div>
        <div className={styles.parent}>
          {isMobile ? (
            <>
              <div className={styles.cartItems}>
                {loading ? "Loading..." : ""}
                {cartProducts ? (
                  cartProducts.map((product) => (
                    <div className={styles.item} key={product._id}>
                      <div className={styles.productImage}>
                        <img
                          src={product.productId.carousel_images[0]}
                          alt=""
                        />
                      </div>
                      <div className={styles.details}>
                        <p>{product.productId.name}</p>
                        <h2>₹{product.productId.price}</h2>
                        <p>Color : {product.productId.color}</p>
                        <p>In Stock</p>
                        <p>Convenience Fee ₹45</p>
                        <p className={styles.total}>
                          Total:{" "}
                          <span>
                            ₹
                            {(
                              parseInt(
                                product.productId.price.replace(",", "")
                              ) * parseInt(product.quantity)
                            ).toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <h2>
                    Your cart is currently empty. Start shopping now to add
                    items and enjoy a seamless checkout experience!
                  </h2>
                )}
              </div>
              <div className={styles.amount}>
                <p>Total Amount</p>
                <span> ₹{orderPrice.toLocaleString()} </span>
              </div>
              <Link to={`/checkout/${orderPrice}`}>
                <button className={styles.placeOrderButton}>PLACE ORDER</button>
              </Link>
            </>
          ) : (
            <>
              <div className={styles.child1}>
                <div className={styles.cartItems}>
                  {loading ? "Loading..." : ""}
                  {cartProducts ? (
                    cartProducts.map((product) => (
                      <div className={styles.item} key={product._id}>
                        <div className={styles.productImage}>
                          <img
                            src={product.productId.carousel_images[0]}
                            alt=""
                          />
                        </div>
                        <div className={styles.details}>
                          <h2>{product.productId.name}</h2>
                          <br />
                          <p>Color : {product.productId.color}</p>
                          <br />
                          <p>{product.productId.available}</p>
                        </div>
                        <div className={styles.price}>
                          <h2>Price</h2>
                          <br />
                          <p>₹{product.productId.price}</p>
                        </div>
                        <div className={styles.quantity}>
                          <h2>Quantity</h2>
                          <br />
                          <select
                            name="quantity"
                            id="quantity"
                            defaultValue={product.quantity}
                            onChange={(event) =>
                              handleQuantityChange(
                                product._id,
                                event.target.value
                              )
                            }
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                          </select>
                        </div>
                        <div className={styles.totalValue}>
                          <h2>Total</h2>
                          <br />
                          <p>
                            ₹
                            {(
                              parseInt(
                                product.productId.price.replace(",", "")
                              ) * parseInt(product.quantity)
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <h2>
                      Your cart is currently empty. Start shopping now to add
                      items and enjoy a seamless checkout experience!
                    </h2>
                  )}
                </div>
                <div className={styles.countTotalItemsPriceValue}>
                  <p>
                    {cartProducts.length}{" "}
                    {cartProducts.length === 1 ? (
                      <span>Item</span>
                    ) : (
                      <span>Items</span>
                    )}
                  </p>
                  <p>₹{totalSum.toLocaleString()}</p>
                </div>
              </div>
              <div className={styles.child2}>
                <h2>PRICE DETAILS</h2>
                <div className={styles.priceDetails}>
                  <p className={styles.MRPs}>
                    Total MRP <br />
                    <br /> Discount on MRP <br /> <br />
                    Convenience Fee
                  </p>
                  <p className={styles.values}>
                    ₹{totalSum.toLocaleString()} <br />
                    <br />
                    ₹0 <br />
                    <br /> ₹45
                  </p>
                </div>
                <div className={styles.amount}>
                  <span>Total Amount</span>
                  <p> ₹{orderPrice.toLocaleString()} </p>
                </div>
                <Link to={`/checkout/${orderPrice}`}>
                  <button className={styles.placeOrderButton}>
                    PLACE ORDER
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
