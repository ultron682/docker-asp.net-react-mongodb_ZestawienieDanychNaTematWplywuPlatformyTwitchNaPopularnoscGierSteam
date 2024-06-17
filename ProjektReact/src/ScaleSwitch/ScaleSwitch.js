import React from "react";
import styles from "./ScaleSwitch.module.css";

const ScaleSwitch = ({ logScale, onSet }) => {
  return (
    <div className={styles.scaleSwitchContainer}>
      <div className={styles.scaleSwitch}>
        <div className={styles.label}>Skala:</div>
        <div className={styles.options}>
          <div
            className={logScale ? styles.option : styles.optionActive}
            onClick={() => {
              if (logScale) {
                onSet(false);
              }
            }}
          >
            Liniowa
          </div>
          <div
            className={logScale ? styles.optionActive : styles.option}
            onClick={() => {
              if (!logScale) {
                onSet(true);
              }
            }}
          >
            Logarytmiczna
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScaleSwitch;
