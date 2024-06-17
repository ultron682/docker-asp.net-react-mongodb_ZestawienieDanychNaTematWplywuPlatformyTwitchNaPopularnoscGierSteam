import React from "react";
import styles from "./DownloadDataButton.module.css";

const DownloadDataButton = ({ data, dateStart, dateEnd, filePrefix, dataTitle }) => {
  return (
    <div className={styles.downloadButtonContainer}>
      <button
        className={styles.downloadButton}
        onClick={() => {
          if (
            window.confirm(
              "Czy chcesz pobrać dane " +
                dataTitle +
                "?\r" +
                "Wybrany zakres to: \r[" +
                dateStart +
                " - " +
                dateEnd +
                "]"
            )
          ) {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", filePrefix + "_" + dateStart + "_" + dateEnd + ".json");
            document.body.appendChild(downloadAnchorNode); // dla firefoxa
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
          }
        }}
      >
        Pobierz dane
      </button>
    </div>
  );
};

export default DownloadDataButton;
