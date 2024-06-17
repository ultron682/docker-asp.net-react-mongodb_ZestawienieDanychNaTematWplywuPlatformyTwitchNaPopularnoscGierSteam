import Navbar from "../Navbar/Navbar";
import React from "react";
import styles from "./Sources.module.css";
import ChartContainer from "../ChartContainer/ChartContainer";

const Sources = () => {
  return (
    <div>
      <Navbar currentPage="sources" />
      <ChartContainer>
        <div className={styles.content}>
          <h1 style={{ textAlign: "center" }}>Źródła</h1>
          <div className={styles.source}>
            <div className={styles.sourceTitle}>Zbiór danych dotyczących statystyk gier na platformie Steam</div>
            <a href="https://data.mendeley.com/datasets/ycy3sy3vj2/1" className={styles.sourceAddress}>
              https://data.mendeley.com/datasets/ycy3sy3vj2/1
            </a>
          </div>
          <div className={styles.source}>
            <div className={styles.sourceTitle}>Zbiór danych dotyczących statystyk gier na platformie Twitch</div>
            <a
              href="https://www.kaggle.com/datasets/rankirsh/evolution-of-top-games-on-twitch"
              className={styles.sourceAddress}
            >
              https://www.kaggle.com/datasets/rankirsh/evolution-of-top-games-on-twitch
            </a>
          </div>
        </div>
      </ChartContainer>
    </div>
  );
};

export default Sources;
