import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "../styles/SingleProductDetails.module.css";
import { useAppContext } from "../store/AppContext";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export const MyImage = ({ product }) => {
  const { isMobile } = useAppContext();
  return (
    <>
      {isMobile ? (
        <div className={styles.images}>
          <Carousel responsive={responsive}>
            <img src={product.carousel_images[1]} alt="" />

            <img src={product.carousel_images[2]} alt="" />

            <img src={product.carousel_images[3]} alt="" />

            <img src={product.carousel_images[4]} alt="" />
          </Carousel>
        </div>
      ) : (
        <>
          <div className={styles.mainImage}>
            <img src={product.carousel_images[0]} alt="" />
          </div>

          <div className={styles.subImages}>
            <Carousel responsive={responsive}>
              <img src={product.carousel_images[1]} alt="" />
              <img src={product.carousel_images[2]} alt="" />
              <img src={product.carousel_images[3]} alt="" />
              <img src={product.carousel_images[4]} alt="" />
            </Carousel>
          </div>
        </>
      )}
    </>
  );
};
