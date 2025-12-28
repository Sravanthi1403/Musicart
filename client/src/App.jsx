import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { SingleProductDetails } from "./pages/SingleProductDetails";
import { ViewCart } from "./pages/ViewCart";
import { Checkout } from "./pages/Checkout";
import { Success } from "./pages/Success";
import { Invoices } from "./pages/Invoices";
import { Invoice } from "./pages/Invoice";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Logout } from "./components/Logout";
import "./index.css";
import { PageNotFound } from "./pages/PageNotFound";

// export const server = "https://musicart-backend-a2u2.onrender.com/api";
// export const server = "http://localhost:5173";
export const server = "http://localhost:8000/api";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/product/:id" element={<SingleProductDetails />} />
          <Route path="/viewcart" element={<ViewCart />} />
          <Route path="/checkout/:sum" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
