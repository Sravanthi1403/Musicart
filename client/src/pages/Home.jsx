import { useState, useRef, useEffect } from "react";
import styles from "../styles/Home.module.css";
import hero from "../assets/hero.png";
import search from "../assets/search.png";
import cart from "../assets/cart.png";
import gridIconOutline from "../assets/gridIconOutline.png";
import gridIconFilled from "../assets/gridIconFilled.png";
import listIconOutline from "../assets/listIconOutline.png";
import listIconFilled from "../assets/listIconFilled.png";
import feedback from "../assets/feedback.png";
import { CustomSelect } from "../components/CustomSelect";
import axios from "axios";
import { server } from "../App";
import { useAppContext } from "../store/AppContext";
import { Link } from "react-router-dom";

export const Home = () => {
  const {
    error,
    setError,
    loading,
    setLoading,
    isMobile,
    products,
    user,
    isSearching,
    handleKeyUp,
    searchResults,
    handleAddToCart,
  } = useAppContext();

  const [isGridViewActive, setIsGridViewActive] = useState(true);
  const [sortingOption, setSortingOption] = useState("");
  const [filters, setFilters] = useState({
    headphoneType: "",
    company: "",
    color: "",
    priceRange: "",
  });
  const isFiltersEmpty = Object.values(filters).every((value) => value === "");

  const [sortedProducts, setSortedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [feedbackType, setFeedbackType] = useState("");
  const feedbackMessageRef = useRef("");

  const [feedbackModal, setFeedbackModal] = useState(false);

  const toggleFeedbackModal = () => setFeedbackModal((prev) => !prev);

  const headphoneTypes = [
    "In-ear headphone",
    "On-ear headphone",
    "Over-ear headphone",
  ];
  const companies = ["boAt", "Bose", "JBL", "Sony", "Sennheiser"];
  const colors = ["Black", "Blue", "Red", "Silver", "White"];
  const priceRanges = ["₹0 - ₹1,000", "₹1,000 - ₹10,000", "₹10,000 - ₹20,000"];
  const sortBy = [
    "Price : Lowest",
    "Price : Highest",
    "Name : (A-Z)",
    "Name : (Z-A)",
  ];
  const feedbackTypeOptions = ["Bugs", "Feedback", "Query"];

  useEffect(() => {
    fetchFilteredProducts();
  }, [filters]);

  useEffect(() => {
    fetchSortedProducts();
  }, [sortingOption]);

  const handleSortChange = (option) => {
    setSortingOption(option.trim());
  };

  const handleFilterChange = (option, filterType) => {
    setFilters({
      ...filters,
      [filterType]: option,
    });
  };

  const handleFeedbackTypeChange = (option) => {
    setFeedbackType(option.trim());
  };

  const handleFeedbackMessageChange = (event) => {
    feedbackMessageRef.current = event.target.value.slice(0, 100);
  };

  const fetchSortedProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${server}/products/sort?sortBy=${sortingOption}`,
        {
          withCredentials: true,
        }
      );
      setSortedProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      setLoading(false);
    }
  };

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/products/filter`, {
        params: { filters: JSON.stringify(filters) },
        withCredentials: true,
      });
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      setLoading(false);
    }
  };

  const MAX_TITLE_LENGTH = isMobile ? 15 : 25;
  const SLICE_LENGTH = isMobile ? 13 : 23;

  const getClippedTitle = (title) => {
    return title.length > MAX_TITLE_LENGTH
      ? `${title.slice(0, SLICE_LENGTH)}...`
      : title;
  };

  const handleFeedbackSubmit = async () => {
    setLoading(true);
    if (!feedbackMessageRef.current.trim() || !feedbackType) {
      setError("*Required field");
      setLoading(false);
      return;
    } else {
      setError("");
    }
    const feedback = {
      username: user.username,
      feedbackMessageRef: feedbackMessageRef.current,
      feedbackType,
    };
    try {
      const response = await axios.post(`${server}/feedbacks`, feedback, {
        withCredentials: true,
      });
      if (response.status >= 200 && response.status < 300) {
        console.log(response.data.message);
        toggleFeedbackModal();
        setLoading(false);
        feedbackMessageRef.current = "";
        setFeedbackType("");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error placing order:", error);
    }
  };

  return (
    <>
      <main>
        <div className={styles.container}>
          <section className={styles.heroSection}>
            <div className={styles.heroText}>
              <p>
                Grab upto 50% off on <br /> Selected headphones
              </p>
              {isMobile ? (
                <div className={styles.buyNowButton}> Buy Now </div>
              ) : null}
            </div>
            <img src={hero} alt="" />
          </section>
          <section className={styles.searchAndFiltersSection}>
            {isMobile ? null : (
              <div className={styles.search}>
                <img
                  src={search}
                  alt=""
                  style={{ height: "2.5rem", width: "2.5rem" }}
                />
                <input
                  type="text"
                  placeholder="Search by product name"
                  onKeyUp={handleKeyUp}
                />
              </div>
            )}
            {isMobile ? (
              <div className={styles.optionsSection}>
                <div className={styles.sort}>
                  <CustomSelect
                    options={sortBy}
                    placeholder="Sort by"
                    onSelect={handleSortChange}
                  />
                </div>
                <div className={styles.filters}>
                  <CustomSelect
                    options={headphoneTypes}
                    placeholder="Headphone type"
                    onSelect={(option) =>
                      handleFilterChange(option, "headphoneType")
                    }
                  />
                  <CustomSelect
                    options={companies}
                    placeholder="Company"
                    onSelect={(option) => handleFilterChange(option, "company")}
                  />
                  <CustomSelect
                    options={colors}
                    placeholder="Color"
                    onSelect={(option) => handleFilterChange(option, "color")}
                  />
                  <CustomSelect
                    options={priceRanges}
                    placeholder="Price"
                    onSelect={(option) =>
                      handleFilterChange(option, "priceRange")
                    }
                  />
                </div>
              </div>
            ) : (
              <div className={styles.optionsSection}>
                <div className={styles.views}>
                  <img
                    src={isGridViewActive ? gridIconFilled : gridIconOutline}
                    alt="Grid View"
                    onClick={() => setIsGridViewActive(true)}
                  />
                  <img
                    src={!isGridViewActive ? listIconFilled : listIconOutline}
                    alt="List View"
                    onClick={() => setIsGridViewActive(false)}
                  />
                </div>
                <div className={styles.filters}>
                  <CustomSelect
                    options={headphoneTypes}
                    placeholder="Headphone type"
                    onSelect={(option) =>
                      handleFilterChange(option, "headphoneType")
                    }
                  />
                  <CustomSelect
                    options={companies}
                    placeholder="Company"
                    onSelect={(option) => handleFilterChange(option, "company")}
                  />
                  <CustomSelect
                    options={colors}
                    placeholder="Color"
                    onSelect={(option) => handleFilterChange(option, "color")}
                  />
                  <CustomSelect
                    options={priceRanges}
                    placeholder="Price"
                    onSelect={(option) =>
                      handleFilterChange(option, "priceRange")
                    }
                  />
                </div>
                <div className={styles.sort}>
                  Sort By :
                  <CustomSelect
                    options={sortBy}
                    placeholder="Featured"
                    onSelect={handleSortChange}
                  />
                </div>
              </div>
            )}
          </section>
          <section className={styles.cardsSection}>
            <ul
              className={
                isGridViewActive ? styles.gridStyles : styles.listStyles
              }
            >
              {loading ? "Loading..." : ""}
              {isSearching
                ? searchResults.map((product) => (
                    <li
                      key={product._id}
                      className={
                        isGridViewActive
                          ? styles.gridViewProductDetails
                          : styles.listViewProductDetails
                      }
                    >
                      <Link to={`/product/${product._id}`}>
                        <div
                          className={
                            isGridViewActive
                              ? styles.gridViewProductImage
                              : styles.listViewProductImage
                          }
                        >
                          <img src={product.carousel_images[0]} alt="" />
                        </div>
                      </Link>
                      {user ? (
                        <img
                          src={cart}
                          alt=""
                          className={styles.cartImage}
                          onClick={() => handleAddToCart(product._id)}
                        />
                      ) : null}
                      <Link to={`/product/${product._id}`}>
                        <div
                          className={
                            isGridViewActive
                              ? styles.details
                              : `${styles.details} ${styles.listViewDetails}`
                          }
                        >
                          <h3 className={styles.productName}>
                            {isGridViewActive
                              ? getClippedTitle(product.name)
                              : product.name}
                          </h3>
                          <p className={styles.price}>
                            Price - ₹ {product.price}
                          </p>
                          <p>
                            {product.color}&nbsp;|&nbsp;{product.category}
                          </p>
                          {isGridViewActive ? null : (
                            <>
                              <p>{product.description}</p>
                              <button className={styles.detailsButton}>
                                Details
                              </button>
                            </>
                          )}
                          {isGridViewActive ? (
                            <div className={styles.tooltip}>{product.name}</div>
                          ) : null}
                        </div>
                      </Link>
                    </li>
                  ))
                : sortingOption !== ""
                ? isFiltersEmpty
                  ? sortedProducts.map((product) => (
                      <li
                        key={product._id}
                        className={
                          isGridViewActive
                            ? styles.gridViewProductDetails
                            : styles.listViewProductDetails
                        }
                      >
                        <Link to={`/product/${product._id}`}>
                          <div
                            className={
                              isGridViewActive
                                ? styles.gridViewProductImage
                                : styles.listViewProductImage
                            }
                          >
                            <img src={product.carousel_images[0]} alt="" />
                          </div>
                        </Link>
                        {user ? (
                          <img
                            src={cart}
                            alt=""
                            className={styles.cartImage}
                            onClick={() => handleAddToCart(product._id)}
                          />
                        ) : null}
                        <Link to={`/product/${product._id}`}>
                          <div
                            className={
                              isGridViewActive
                                ? styles.details
                                : `${styles.details} ${styles.listViewDetails}`
                            }
                          >
                            <h3 className={styles.productName}>
                              {isGridViewActive
                                ? getClippedTitle(product.name)
                                : product.name}
                            </h3>
                            <p className={styles.price}>
                              Price - ₹ {product.price}
                            </p>
                            <p>
                              {product.color}&nbsp;|&nbsp;{product.category}
                            </p>
                            {isGridViewActive ? null : (
                              <>
                                <p>{product.description}</p>
                                <button className={styles.detailsButton}>
                                  Details
                                </button>
                              </>
                            )}
                            {isGridViewActive ? (
                              <div className={styles.tooltip}>
                                {product.name}
                              </div>
                            ) : null}
                          </div>
                        </Link>
                      </li>
                    ))
                  : filteredProducts.map((product) => (
                      <li
                        key={product._id}
                        className={
                          isGridViewActive
                            ? styles.gridViewProductDetails
                            : styles.listViewProductDetails
                        }
                      >
                        <Link to={`/product/${product._id}`}>
                          <div
                            className={
                              isGridViewActive
                                ? styles.gridViewProductImage
                                : styles.listViewProductImage
                            }
                          >
                            <img src={product.carousel_images[0]} alt="" />
                          </div>
                        </Link>
                        {user ? (
                          <img
                            src={cart}
                            alt=""
                            className={styles.cartImage}
                            onClick={() => handleAddToCart(product._id)}
                          />
                        ) : null}
                        <Link to={`/product/${product._id}`}>
                          <div
                            className={
                              isGridViewActive
                                ? styles.details
                                : `${styles.details} ${styles.listViewDetails}`
                            }
                          >
                            <h3 className={styles.productName}>
                              {isGridViewActive
                                ? getClippedTitle(product.name)
                                : product.name}
                            </h3>
                            <p className={styles.price}>
                              Price - ₹ {product.price}
                            </p>
                            <p>
                              {product.color}&nbsp;|&nbsp;{product.category}
                            </p>
                            {isGridViewActive ? null : (
                              <>
                                <p>{product.description}</p>
                                <button className={styles.detailsButton}>
                                  Details
                                </button>
                              </>
                            )}
                            {isGridViewActive ? (
                              <div className={styles.tooltip}>
                                {product.name}
                              </div>
                            ) : null}
                          </div>
                        </Link>
                      </li>
                    ))
                : isFiltersEmpty
                ? products.map((product) => (
                    <li
                      key={product._id}
                      className={
                        isGridViewActive
                          ? styles.gridViewProductDetails
                          : styles.listViewProductDetails
                      }
                    >
                      <Link to={`/product/${product._id}`}>
                        <div
                          className={
                            isGridViewActive
                              ? styles.gridViewProductImage
                              : styles.listViewProductImage
                          }
                        >
                          <img src={product.carousel_images[0]} alt="" />
                        </div>
                      </Link>
                      {user ? (
                        <img
                          src={cart}
                          alt=""
                          className={styles.cartImage}
                          onClick={() => handleAddToCart(product._id)}
                        />
                      ) : null}
                      <Link to={`/product/${product._id}`}>
                        <div
                          className={
                            isGridViewActive
                              ? styles.details
                              : `${styles.details} ${styles.listViewDetails}`
                          }
                        >
                          <h3 className={styles.productName}>
                            {isGridViewActive
                              ? getClippedTitle(product.name)
                              : product.name}
                          </h3>
                          <p className={styles.price}>
                            Price - ₹ {product.price}
                          </p>
                          <p>
                            {product.color}&nbsp;|&nbsp;{product.category}
                          </p>
                          {isGridViewActive ? null : (
                            <>
                              <p>{product.description}</p>
                              <button className={styles.detailsButton}>
                                Details
                              </button>
                            </>
                          )}
                          {isGridViewActive ? (
                            <div className={styles.tooltip}>{product.name}</div>
                          ) : null}
                        </div>
                      </Link>
                    </li>
                  ))
                : filteredProducts.map((product) => (
                    <li
                      key={product._id}
                      className={
                        isGridViewActive
                          ? styles.gridViewProductDetails
                          : styles.listViewProductDetails
                      }
                    >
                      <Link to={`/product/${product._id}`}>
                        <div
                          className={
                            isGridViewActive
                              ? styles.gridViewProductImage
                              : styles.listViewProductImage
                          }
                        >
                          <img src={product.carousel_images[0]} alt="" />
                        </div>
                      </Link>
                      {user ? (
                        <img
                          src={cart}
                          alt=""
                          className={styles.cartImage}
                          onClick={() => handleAddToCart(product._id)}
                        />
                      ) : null}
                      <Link to={`/product/${product._id}`}>
                        <div
                          className={
                            isGridViewActive
                              ? styles.details
                              : `${styles.details} ${styles.listViewDetails}`
                          }
                        >
                          <h3 className={styles.productName}>
                            {isGridViewActive
                              ? getClippedTitle(product.name)
                              : product.name}
                          </h3>
                          <p className={styles.price}>
                            Price - ₹ {product.price}
                          </p>
                          <p>
                            {product.color}&nbsp;|&nbsp;{product.category}
                          </p>
                          {isGridViewActive ? null : (
                            <>
                              <p>{product.description}</p>
                              <button className={styles.detailsButton}>
                                Details
                              </button>
                            </>
                          )}
                          {isGridViewActive ? (
                            <div className={styles.tooltip}>{product.name}</div>
                          ) : null}
                        </div>
                      </Link>
                    </li>
                  ))}
            </ul>
          </section>
        </div>
        {isMobile ? null : (
          <div className={styles.feedback} onClick={toggleFeedbackModal}>
            <div className={styles.feedbackImage}>
              <img src={feedback} alt="" />
            </div>
            <div
              className={`${styles.feedbackFormModal} ${
                feedbackModal ? styles.openFeedbackModal : ""
              }`}
            >
              <div className={styles.feedbackType}>
                <h2>Type of feedback</h2>
                <CustomSelect
                  error={error}
                  options={feedbackTypeOptions}
                  placeholder="Choose the Type"
                  onSelect={handleFeedbackTypeChange}
                />
              </div>
              {error && <span className="errorText">{error}</span>}
              <div className={styles.feedbackData}>
                <h2>Feedback</h2>
                <textarea
                  style={error ? { border: "2px solid red" } : {}}
                  value={feedbackMessageRef.current.value}
                  onChange={handleFeedbackMessageChange}
                  maxLength={100}
                  rows={5}
                  placeholder="Type your feedback..."
                />
                {/* <p>Characters remaining: {100 - address.length}</p> */}
              </div>
              {error && <span className="errorText">{error}</span>}
              <div className={styles.feedbackSubmitButton}>
                <button onClick={() => handleFeedbackSubmit()}>
                  {loading ? "Please wait..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

{
  /* <select
                    required
                    value={feedbackType}
                    onChange={handleFeedbackTypeChange}
                  >
                    <option value="" disabled defaultValue hidden>
                      Choose the Type
                    </option>
                    <option value="Bugs">Bugs</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Query">Query</option>
                  </select> */
}
