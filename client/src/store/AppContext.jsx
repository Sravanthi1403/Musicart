import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { server } from "../App";
import axios from "axios";
import { Navigate } from "react-router-dom";

const AppContext = createContext();

/* localStorage parser */
const safeParse = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    if (!value || value === "undefined") return fallback;
    return JSON.parse(value);
  } catch (err) {
    return fallback;
  }
};

// eslint-disable-next-line react/prop-types
export const AppContextProvider = ({ children }) => {
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    safeParse("isLoggedIn", false)
  );
  const [user, setUser] = useState(() => safeParse("userProfile", null));

  // Product State
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Cart State
  const [cartProducts, setCartProducts] = useState(() =>
    safeParse("cartProducts", [])
  );
  const [isCartUpdated, setIsCartUpdated] = useState(false);

  // Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Invoice State
  const [invoices, setInvoices] = useState(() => safeParse("invoices", []));

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    if (isLoggedIn) {
      userProfileApi();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchProducts();
    fetchCartProducts();
    fetchAllInvoices();
  }, []);

  useEffect(() => {
    if (isCartUpdated) {
      fetchCartProducts();
    }
  }, [isCartUpdated]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------- API CALLS ---------------- */

  const userProfileApi = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/user/user-profile`, {
        withCredentials: true,
      });
      setUser(response.data.userData);
      localStorage.setItem(
        "userProfile",
        JSON.stringify(response.data.userData)
      );
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", true);
    } catch (error) {
      logoutAPICall();
    } finally {
      setLoading(false);
    }
  };

  const logoutAPICall = async () => {
    await axios.get(`${server}/user/logout`, { withCredentials: true });
    localStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
    <Navigate to="/" />;
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${server}/products`);
      setProducts(response.data.products || []);
    } catch {
      setProducts([]);
    }
  };

  const fetchCartProducts = async () => {
    try {
      const response = await axios.get(`${server}/cart/getCartProducts`, {
        withCredentials: true,
      });
      setCartProducts(response.data.cartItems || []);
      localStorage.setItem(
        "cartProducts",
        JSON.stringify(response.data.cartItems || [])
      );
    } catch {
      setCartProducts([]);
    }
  };

  const fetchAllInvoices = async () => {
    try {
      const response = await axios.get(`${server}/orders/myOrders`, {
        withCredentials: true,
      });
      setInvoices(response.data.userOrders || []);
      localStorage.setItem(
        "invoices",
        JSON.stringify(response.data.userOrders || [])
      );
    } catch {
      setInvoices([]);
    }
  };

  const fetchSearchResults = async (query) => {
    setLoading(true);
    try {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      const response = await axios.get(
        `${server}/products/productSearch?search=${query}`,
        { withCredentials: true }
      );

      setSearchResults(response.data || []);
      setIsSearching(true);
    } catch (error) {
      console.error("Search error", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const searchTimeoutRef = useRef(null);

  const handleKeyUp = useCallback((e) => {
    const value = e.target.value.trim();

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(() => {
      fetchSearchResults(value);
    }, 300);
  }, []);

  const handleAddToCart = async (productId, userId) => {
    await axios.post(
      `${server}/cart/addProductToCart?productId=${productId}&userId=${userId}`
    );
    setIsCartUpdated(true);
    setTimeout(() => setIsCartUpdated(false), 1000);
  };

  return (
    <AppContext.Provider
      value={{
        error,
        setError,
        loading,
        setLoading,
        isMobile,
        user,
        logoutAPICall,
        products,
        selectedProductId,
        setSelectedProductId,
        setIsLoggedIn,
        isSearching,
        handleKeyUp,
        searchResults,
        handleAddToCart,
        cartProducts,
        invoices,
        fetchCartProducts,
        setIsCartUpdated,
        fetchAllInvoices,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
