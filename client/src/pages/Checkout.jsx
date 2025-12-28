import { useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../store/AppContext";
import backArrow from "../assets/backArrow.png";
import styles from "../styles/Checkout.module.css";
import axios from "axios";
import { server } from "../App";
import { toast } from "react-toastify";

export const Checkout = () => {
  const { sum } = useParams();

  const { isMobile, user, cartProducts, fetchCartProducts, fetchAllInvoices } =
    useAppContext();

  console.log("Checkout cartProducts:", cartProducts);
  console.log("fetchCartProducts:", fetchCartProducts);

  const address = useRef("");

  const [paymentMethodOption, setPaymentMethodOption] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");

  const navigate = useNavigate();

  const handleSelectedProduct = (productId) => {
    const product = cartProducts.find((product) => product._id === productId);
    console.log("Selected product:", product);

    setSelectedProduct(product);
  };

  const handleAddressChange = (event) => {
    address.current = event.target.value.slice(0, 100);
  };

  const handlePaymentMethodChange = (event) => {
    const selectedOption = event.target.value;
    setPaymentMethodOption(selectedOption);
  };

  const handlePlaceOrder = async () => {
    if (!address.current.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!paymentMethodOption) {
      toast.error("Payment method is required.");
      return;
    }
    const orderData = {
      username: user.username,
      address,
      paymentMethod: paymentMethodOption,
      orderPrice: Number(sum),
      cartProducts: cartProducts.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(
        `${server}/orders/placeOrder`,
        orderData,
        { withCredentials: true }
      );
      if (response.status >= 200 && response.status < 300) {
        fetchAllInvoices();
        const deleteCartResponse = await axios.delete(
          `${server}/cart/deleteAllItems?userId=${user._id}`,
          { withCredentials: true }
        );
        if (deleteCartResponse.status === 200) {
          console.log("Cart items deleted successfully");
          fetchCartProducts();
          navigate("/success");
        }
        console.log(response.data.message);
        address.current = "";
        setPaymentMethodOption("");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Loading checkout details...</h2>
      </div>
    );
  }

  return (
    <>
      <div className={styles.checkoutContainer}>
        <div className={styles.backButton}>
          <Link to="/viewcart">
            {isMobile ? (
              <div>
                <img src={backArrow} alt="" />
              </div>
            ) : (
              <button>Back to cart</button>
            )}
          </Link>
        </div>
        <div className={styles.checkoutHeading}>
          <h1>Checkout</h1>
        </div>
        <div className={styles.parent}>
          <div className={styles.child1}>
            <div className={styles.orderDeliveryDetails}>
              <div className={styles.delivery}>
                <div className={styles.name}>1. Delivery address</div>
                <div className={styles.values}>
                  <p>{user.username}</p>
                  <textarea
                    onChange={handleAddressChange}
                    maxLength={100}
                    rows={3}
                    placeholder="Enter delivery address..."
                  />
                  {/* <p>Characters remaining: {100 - address.length}</p> */}
                </div>
              </div>
              <div className={styles.payment}>
                <div className={styles.name}>2. Payment method</div>
                <div className={styles.values}>
                  <select
                    required
                    value={paymentMethodOption}
                    onChange={handlePaymentMethodChange}
                  >
                    <option value="" disabled defaultValue hidden>
                      Mode of payment
                    </option>
                    <option value="PayOnDelivery">Pay on Delivery</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
              </div>
              <div className={styles.reviewItems}>
                <div className={styles.name}>3. Review items and delivery</div>
                <div className={styles.values}>
                  <div className={styles.images}>
                    {cartProducts.map((product) => {
                      return (
                        <div key={product._id} className={styles.image}>
                          <img
                            src={
                              product.productId?.carousel_images
                                ? product.productId.carousel_images[0]
                                : ""
                            }
                            onClick={() => handleSelectedProduct(product._id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className={styles.imageDetails}>
                    <h2>
                      {selectedProduct?.productId?.name ||
                        cartProducts?.[0]?.productId?.name ||
                        ""}
                    </h2>

                    <p>
                      Color :&nbsp;&nbsp;
                      {selectedProduct?.productId?.color ||
                        cartProducts?.[0]?.productId?.color ||
                        ""}
                    </p>

                    <p>
                      Estimated delivery: <br /> Monday - FREE Standard Delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.totalOrderValue}>
              <button
                className={styles.placeOrderButton}
                onClick={() => {
                  handlePlaceOrder();
                }}
              >
                Place your order
              </button>
              <div>
                <h4 className={styles.name}>
                  Order Total : ₹{parseInt(sum).toLocaleString()}.00
                </h4>
                <p>
                  By placing your order, you agree to Musicart privacy notice
                  and conditions of use.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.child2}>
            <div className={styles.orderDetails}>
              <div className={styles.placeOrder}>
                <button
                  className={styles.placeOrderButton}
                  onClick={() => {
                    handlePlaceOrder();
                  }}
                >
                  Place your order
                </button>
                <p className={styles.policyText}>
                  By placing your order, you agree to Musicart privacy notice
                  and conditions of use.
                </p>
              </div>
              <div className={styles.orderSummary}>
                <h2>Order Summary</h2>
                <div>
                  <p className={styles.types}>
                    Items : <br /> Delivery :
                  </p>
                  <p className={styles.values}>
                    ₹{parseInt(sum - 45).toLocaleString()}.00 <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;₹45.00
                  </p>
                </div>
              </div>
              <div className={styles.orderTotal}>
                <p className={styles.name}>Order Total :</p>
                <span className={styles.name}>
                  ₹{parseInt(sum).toLocaleString()}.00
                </span>
              </div>
              {isMobile ? (
                <div>
                  <button
                    className={styles.placeOrderButton}
                    onClick={() => {
                      handlePlaceOrder();
                    }}
                  >
                    Place your order
                  </button>
                  <p className={styles.policyText}>
                    By placing your order, you agree to Musicart privacy notice
                    and conditions of use.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
