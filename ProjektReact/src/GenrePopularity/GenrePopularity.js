import React, { useState, useEffect } from "react";
import "rc-slider/assets/index.css";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import GenreRadarChart from "./GenreRadarChart";
import GenreLineChart from "./GenreLineChart";
import GenreBarChart from "./GenreBarChart";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import styles from "./GenrePopularity.module.css";

const GenrePopularity = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem("token");
  };
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const fetchGenres = async () => {
    try {
      const token = getToken();
      const response = await axios.get("http://localhost:27067/Game/all-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = response.data;
      setData(result);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        window.alert("Wystąpił błąd podczas pobierania listy gier");
        console.error("Error fetching game list:", error.message);
      }
    }
  };

  const showPage = async () => {
    await sleep(1500);
    setLoading(false);
  };

  useEffect(() => {
    showPage();
  }, [data]);

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <div>
      <Navbar currentPage="genrePopularity" />
      {loading ? (
        <LoadingSpinner />
      ) : (
        data && (
          <div className={styles.contentContainer}>
            <div style={{ marginTop: 100 }} />
            <GenreLineChart data={data} />
            <GenreBarChart data={data} />
            <GenreRadarChart data={data} />
          </div>
        )
      )}
    </div>
  );
};

export default GenrePopularity;
