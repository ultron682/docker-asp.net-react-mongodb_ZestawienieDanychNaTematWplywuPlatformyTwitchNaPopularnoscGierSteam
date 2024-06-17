import React from "react";
import "rc-slider/assets/index.css";
import styles from "./ChartContainer.module.css";
const ChartContainer = ({ children }) => {
  return <div className={styles.chartContainer}>{children}</div>;
};

export default ChartContainer;
