import styles from "../styles/Invoices.module.css";
import { Link } from "react-router-dom";
import { useAppContext } from "../store/AppContext";
import backArrow from "../assets/backArrow.png";
import myInvoicesIcon from "../assets/myInvoicesIcon.png";
import invoiceIcon from "../assets/invoiceIcon.png";

export const Invoices = () => {
  const { isMobile, invoices, loading } = useAppContext();

  return (
    <>
      <div className={styles.invoicesContainer}>
        <div className={styles.buttonStyles}>
          <Link to="/">
            {isMobile ? (
              <div>
                <img src={backArrow} alt="" />
              </div>
            ) : (
              <button>Back to Home</button>
            )}
          </Link>
        </div>
        <div className={styles.invoicesHeading}>
          {isMobile ? <img src={myInvoicesIcon} alt="invoices" /> : null}
          <h1>My Invoices</h1>
        </div>
        <div className={styles.invoicesMainSection}>
          <div className={styles.invoices}>
            {loading ? "Loading..." : ""}
            {invoices.map((invoice) => (
              <div className={styles.invoice} key={invoice._id}>
                <div className={styles.details}>
                  <img src={invoiceIcon} alt="invoice" />
                  <div className={styles.userDetails}>
                    <p>{invoice.username}</p>
                    <p>{invoice.address}</p>
                  </div>
                </div>
                <div className={styles.buttonStyles}>
                  <Link to={`/invoice/${invoice._id}`}>
                    <button>View Invoice</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
