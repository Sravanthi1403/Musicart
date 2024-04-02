import { useState } from "react";
import styles from "../styles/Home.module.css";
import arrow from "../assets/arrow.png";
import arrow2 from "../assets/arrow2.png";

export const CustomSelect = ({ error, options, placeholder, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (typeof onSelect === "function") {
      onSelect(option);
    }
  };

  return (
    <div className={styles["custom-select"]}>
      <span
        className={styles.placeholder}
        style={error ? { border: "2px solid red" } : {}}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption || placeholder}
        <img src={arrow} className={styles.arrow} alt="" />
        <img src={arrow2} className={styles.arrow2} alt="" />
      </span>
      <div
        className={`${styles.optionsContainer} ${isOpen ? styles.open : ""}`}
      >
        <ul className={styles.options}>
          <li>Featured</li>
          {options.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
