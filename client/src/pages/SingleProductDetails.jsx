import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../store/AppContext";
import backArrow from "../assets/backArrow.png";
import fiveStar from "../assets/five.jpg";
import fourHalfStar from "../assets/fourHalf.jpg";
import fourStar from "../assets/four.jpg";
import threeHalfStar from "../assets/threeHalf.jpg";
import threeStar from "../assets/three.jpg";
import styles from "../styles/SingleProductDetails.module.css";
import { MyImage } from "../components/MyImage";

export const SingleProductDetails = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const { isMobile, products, setSelectedProductId, user, handleAddToCart } =
    useAppContext();

  useEffect(() => {
    setSelectedProductId(id);
  }, [id, setSelectedProductId]);

  useEffect(() => {
    const foundProduct = products.find((product) => product._id === id);
    setProduct(foundProduct);
    console.log("foundProduct", foundProduct);
  }, [id, products]);

  const getStarImage = (rating) => {
    switch (rating) {
      case 5:
        return fiveStar;
      case 4.5:
        return fourHalfStar;
      case 4:
        return fourStar;
      case 3.5:
        return threeHalfStar;
      case 3:
        return threeStar;
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.productContainer}>
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
        <div className={styles.productDetails}>
          {isMobile ? (
            user ? (
              <Link to="/viewcart">
                <button
                  className={styles.buyNowButton}
                  onClick={() => handleAddToCart(id)}
                >
                  Buy Now
                </button>
              </Link>
            ) : (
              <Link to="/login">
                <button className={styles.buyNowButton}>Buy Now</button>
              </Link>
            )
          ) : null}
          {product ? (
            <>
              {isMobile ? null : (
                <div className={styles.productTitle}>{product.description}</div>
              )}
              <div className={styles.parent}>
                <div className={styles.child1}>
                  <MyImage product={product} />
                </div>
                <div className={styles.child2}>
                  <h1>{product.name}</h1>
                  <p className={styles.stars}>
                    <img
                      src={getStarImage(parseFloat(product.stars))}
                      alt="rating"
                    />
                    <span>({product.reviewsno} Customer reviews)</span>
                  </p>
                  <p className={styles.detailsText}>
                    Price - ₹ {product.price}
                  </p>
                  <p className={styles.detailsText}>
                    {product.color}&nbsp;|&nbsp;{product.category}
                  </p>
                  <div>
                    <p className={styles.about}>About this item</p>
                    <ul>
                      {product.about.map((item) => (
                        <li key="index">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <p className={styles.detailsText}>
                    <span>Available&nbsp;-&nbsp;</span>
                    {product.available}
                  </p>
                  <p className={styles.detailsText}>
                    <span>Brand&nbsp;-&nbsp;</span>
                    {product.brand}
                  </p>
                  {user ? (
                    <Link to="/viewcart">
                      <button
                        className={styles.addCartButton}
                        onClick={() => handleAddToCart(id)}
                      >
                        Add to cart
                      </button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <button className={styles.addCartButton}>
                        Add to cart
                      </button>
                    </Link>
                  )}
                  {user ? (
                    <Link to="/viewcart">
                      <button
                        className={styles.buyNowButton}
                        onClick={() => handleAddToCart(id)}
                      >
                        Buy Now
                      </button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <button className={styles.buyNowButton}>Buy Now</button>
                    </Link>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};
