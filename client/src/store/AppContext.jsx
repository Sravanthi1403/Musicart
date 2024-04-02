import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { server } from "../App";
import axios from "axios";
import { Navigate } from "react-router-dom";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [user, setUser] = useState(() => {
    let userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      return JSON.parse(userProfile);
    }
    return null;
  });
  const [products, setProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState(() => {
    let cartProducts = localStorage.getItem("cartProducts");
    if (cartProducts) {
      return JSON.parse(cartProducts);
    }
    return null;
  });
  const [isCartUpdated, setIsCartUpdated] = useState(false);
  const [invoices, setInvoices] = useState(() => {
    let invoices = localStorage.getItem("invoices");
    if (invoices) {
      return JSON.parse(invoices);
    }
    return null;
  });
  console.log("invoices", invoices);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn) {
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    {
      isLoggedIn && userProfileApi();
    }
    console.log("userProfileApi running");
  }, [isLoggedIn]);

  useEffect(() => {
    fetchProducts();
    fetchCartProducts();
    fetchAllInvoices();
  }, []);

  useEffect(() => {
    {
      isCartUpdated && fetchCartProducts();
    }
  }, [isCartUpdated]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const userProfileApi = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/user/user-profile`, {
        withCredentials: true,
      });
      setLoading(false);
      setUser(response.data.userData);
      localStorage.setItem(
        "userProfile",
        JSON.stringify(response.data.userData)
      );
      console.log("user data", response.data.userData);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        // Unauthorized error (token expired or invalid)
        console.error("Unauthorized access. Logging out...");
        logoutAPICall();
        return;
      }
      console.error("Error fetching user data ", error);
    }
  };

  const logoutAPICall = async () => {
    await axios.get(`${server}/user/logout`, { withCredentials: true });
    localStorage.removeItem("userProfile");
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("cartProducts");
    localStorage.removeItem("invoices");
    <Navigate to="/" />;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/products`, {
        withCredentials: true,
      });
      setLoading(false);
      setProducts(response.data.products);
      console.log("products data", response.data.products);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products data ", error);
    }
  };

  const fetchCartProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/cart/getCartProducts`, {
        withCredentials: true,
      });
      setLoading(false);
      setCartProducts(response.data.cartItems);
      localStorage.setItem(
        "cartProducts",
        JSON.stringify(response.data.cartItems)
      );
      console.log("cart products data", response.data.cartItems);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products from cart", error);
    }
  };
  const fetchAllInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/orders/getAllOrders`, {
        withCredentials: true,
      });
      setLoading(false);
      setInvoices(response.data.allOrders);
      localStorage.setItem("invoices", JSON.stringify(response.data.allOrders));
      console.log("all orders data", response.data.allOrders);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching invoices", error);
    }
  };

  const fetchSearchResults = async (query) => {
    setLoading(true);
    try {
      if (query.trim() === "") {
        setSearchResults([]);
        return;
      }
      const response = await axios.get(
        `${server}/products/productSearch?search=${query}`,
        {
          withCredentials: true,
        }
      );

      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error searching products:", error);
      setLoading(false);
    }
  };

  const handleKeyUp = useCallback((e) => {
    const delay = 300;
    let timeoutId;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (e.target.value.trim() === "") {
        setIsSearching(false);
      } else {
        setIsSearching(true);
        fetchSearchResults(e.target.value);
      }
    }, delay);
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await axios.post(
        `${server}/cart/addProductToCart?productId=${productId}`
      );
      console.log("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    } finally {
      setIsCartUpdated(true);
      setTimeout(() => {
        setIsCartUpdated(false);
      }, 1000);
    }
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
        fetchCartProducts,
        cartProducts,
        setIsCartUpdated,
        invoices,
        fetchAllInvoices,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
