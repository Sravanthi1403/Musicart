import musicicon from "../assets/music_icon.png";
import confetti from "../assets/confetti.png";
import styles from "../styles/Success.module.css";
import { Link } from "react-router-dom";

export const Success = () => {
  return (
    <>
      <div className={styles.successPageContainer}>
        <div className={styles.company}>
          <img src={musicicon} alt="musicicon" />
          <h1>Musicart</h1>
        </div>
        <div className={styles.flexbox}>
          <div className={styles.success}>
            <img src={confetti} alt="confetti" />
            <div>
              <h1>Order is placed successfully!</h1>
              <p>
                You will be receiving a confirmation email with order details
              </p>
            </div>
            <Link to="/">
              <button className={styles.goBackButton}>
                Go back to Home Page
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
