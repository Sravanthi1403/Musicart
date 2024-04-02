import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../store/AppContext";
import backArrow from "../assets/backArrow.png";
import styles from "../styles/Checkout.module.css";

export const Invoice = () => {
  const { id } = useParams();
  console.log("invoice id", id);
  const { isMobile, invoices, loading } = useAppContext();
  console.log("invoices from invoice", invoices);
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleSelectedProduct = (productId) => {
    const product = invoice.cartItems.find(
      (product) => product._id === productId
    );
    setSelectedProduct(product);
  };

  const invoice = invoices.find((invoice) => invoice._id === id);
  console.log("selected invoice", invoice);

  return (
    <>
      <div className={styles.checkoutContainer}>
        <div className={styles.backButton}>
          <Link to="/invoices">
            {isMobile ? (
              <div>
                <img src={backArrow} alt="" />
              </div>
            ) : (
              <button>Back to Invoices</button>
            )}
          </Link>
        </div>
        <div className={styles.checkoutHeading}>
          <h1>Invoice</h1>
        </div>
        <div className={styles.parent}>
          <div className={styles.child1}>
            <div className={styles.orderDeliveryDetails}>
              <div className={styles.delivery}>
                <div className={styles.name}>1. Delivery address</div>
                <div className={styles.values}>
                  <p>{invoice.username}</p>
                  <p className={styles.addressStaticValue}>
                    {invoice.address}{" "}
                  </p>
                </div>
              </div>
              <div className={styles.payment}>
                <div className={styles.name}>2. Payment method</div>
                <div className={styles.values}>
                  <div className={styles.paymentStaticValue}>
                    {invoice.paymentMethod}
                  </div>
                </div>
              </div>
              <div className={styles.reviewItems}>
                <div className={styles.name}>3. Review items and delivery</div>
                <div className={styles.values}>
                  <div className={styles.images}>
                    {loading ? "Loading..." : ""}
                    {invoice.cartItems ? (
                      invoice.cartItems.map((product) => (
                        <>
                          <div className={styles.image}>
                            <img
                              key={product._id}
                              src={product.productId.carousel_images[0]}
                              onClick={() => {
                                handleSelectedProduct(product._id);
                              }}
                            />
                          </div>
                        </>
                      ))
                    ) : (
                      <div>No data present</div>
                    )}
                  </div>
                  <div className={styles.imageDetails}>
                    <h2>
                      {selectedProduct
                        ? selectedProduct.productId.name
                        : invoice.cartItems
                        ? invoice.cartItems[0].productId.name
                        : ""}
                    </h2>
                    <p>
                      Color :&nbsp;&nbsp;
                      {selectedProduct
                        ? selectedProduct.productId.color
                        : invoice.cartItems
                        ? invoice.cartItems[0].productId.color
                        : ""}
                    </p>
                    <p>
                      Estimated delivery: <br /> Monday - FREE Standard Delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.child2}>
            <div className={styles.orderDetails}>
              <div className={styles.orderSummary}>
                <h2>Order Summary</h2>
                <div>
                  <p className={styles.types}>
                    Items : <br /> Delivery :
                  </p>
                  <p className={styles.values}>
                    ₹{(parseInt(invoice.orderPrice) - 45).toLocaleString()}
                    .00 <br />
                    ₹45.00
                  </p>
                </div>
              </div>
              <div className={styles.orderTotal}>
                <p className={styles.name}>Order Total :</p>
                <span className={styles.name}>
                  ₹{parseInt(invoice.orderPrice).toLocaleString()}
                  .00
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
