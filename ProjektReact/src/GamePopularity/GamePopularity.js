import React, { useState, useEffect } from "react";
import "rc-slider/assets/index.css";
import Navbar from "../Navbar/Navbar";
import Select from "react-select";
import axios from "axios";
import styles from "./GamePopularity.module.css";
import StatContainer from "../StatContainer/StatContainer";
import ChartDateSlider from "../ChartDateSlider/ChartDateSlider";
import GameLineChart from "./GameLineChart";
import GameSingleLineChart from "./GameSingleLineChart";
import GamePieChart from "./GamePieChart";
import GameRatioLineChart from "./GameRatioLineChart";
import ScaleSwitch from "../ScaleSwitch/ScaleSwitch";
import { COLORS } from "../Colors";

const GamePopularity = () => {
  const [data, setData] = useState(null);
  const [range, setRange] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [games, setGames] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
  const [logScale, setLogScale] = useState(false);

  const calculateChartData = (data, range) => {
    return data.filter((_, index) => index >= range[0] && index <= range[1]);
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchGames = async () => {
    try {
      const token = getToken();
      const response = await axios.get("http://localhost:27067/Game/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = response.data;
      const formattedGames = result.map((game) => ({
        value: game.game_id,
        label: game.game_name,
      }));

      setGames(formattedGames.sort((a, b) => a.label.localeCompare(b.label)));
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

  const fetchData = async (gameId) => {
    try {
      const token = getToken();
      const response = await axios.get(`http://localhost:27067/Game/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
      if (range === null) {
        setRange([0, response.data.length - 1]);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        window.alert("Wystąpił błąd podczas pobierania danych o grze");
        console.error("Error fetching game data:", error);
      }
    }
  };

  const roundToTwoDecimal = (num) => {
    return Math.round(num * 100) / 100;
  };

  const calculateCorrelation = (data) => {
    const players = data.map((item) => item.playersOnSteam);
    const viewers = data.map((item) => item.viewersOnTwitch);
    const playersMean = players.reduce((acc, item) => acc + item, 0) / players.length;
    const viewersMean = viewers.reduce((acc, item) => acc + item, 0) / viewers.length;
    const playersDiff = players.map((item) => item - playersMean);
    const viewersDiff = viewers.map((item) => item - viewersMean);
    const playersDiffSquared = playersDiff.map((item) => item * item);
    const viewersDiffSquared = viewersDiff.map((item) => item * item);
    const playersDiffSquaredSum = playersDiffSquared.reduce((acc, item) => acc + item, 0);
    const viewersDiffSquaredSum = viewersDiffSquared.reduce((acc, item) => acc + item, 0);
    const playersViewersDiffProduct = playersDiff.map((item, index) => item * viewersDiff[index]);
    const playersViewersDiffProductSum = playersViewersDiffProduct.reduce((acc, item) => acc + item, 0);
    const correlation = playersViewersDiffProductSum / Math.sqrt(playersDiffSquaredSum * viewersDiffSquaredSum);
    return correlation;
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (currentGame) {
      fetchData(currentGame.value);
    }
  }, [currentGame]);

  useEffect(() => {
    if (data && range) {
      setChartData(calculateChartData(data, range));
    }
  }, [data, range]);

  return (
    <div className={styles.mainBody}>
      <Navbar currentPage="gamePopularity" />
      <div className={chartData !== null && range != null ? styles.fixedBackgroundNoShadow : styles.fixedBackground}>
        {games !== null ? (
          <Select
            placeholder="Wybierz grę"
            className={styles.gameSelect}
            options={games}
            onChange={(selectedOption) => {
              setCurrentGame(selectedOption);
            }}
          />
        ) : null}
        {chartData !== null && range != null ? (
          <div className={styles.datePicker}>
            <ChartDateSlider
              max={data.length - 1}
              firstDate={data[range[0]].date}
              lastDate={data[range[1]].date}
              range={range}
              onChange={setRange}
            />
            <ScaleSwitch logScale={logScale} onSet={setLogScale} />
          </div>
        ) : null}
      </div>
      {chartData !== null && range != null ? (
        <div>
          <GameLineChart data={chartData} range={range} logScale={logScale} />
          <StatContainer
            title="Współczynnik korelacji liczby widzów i graczy"
            value={roundToTwoDecimal(calculateCorrelation(chartData))}
            color={COLORS.secondary}
          />
          <table className={styles.statsTable}>
            <tbody>
              <tr>
                <td>
                  <GameSingleLineChart
                    data={chartData}
                    dataKey="playersOnSteam"
                    label="Gracze"
                    color={COLORS.players}
                    logScale={logScale}
                  />
                </td>
                <td>
                  <GameSingleLineChart
                    data={chartData}
                    dataKey="viewersOnTwitch"
                    label="Widzowie"
                    color={COLORS.viewers}
                    logScale={logScale}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <StatContainer
                    title="Średnia liczba graczy"
                    value={Math.round(
                      chartData.reduce((acc, item) => acc + item.playersOnSteam, 0) / chartData.length
                    ).toLocaleString("pl-PL")}
                    color={COLORS.players}
                  />
                </td>
                <td>
                  <StatContainer
                    title="Średnia liczba widzów"
                    value={Math.round(
                      chartData.reduce((acc, item) => acc + item.viewersOnTwitch, 0) / chartData.length
                    ).toLocaleString("pl-PL")}
                    color={COLORS.viewers}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <StatContainer
                    title="Maksymalna liczba graczy"
                    value={Math.max(...chartData.map((item) => item.playersOnSteam)).toLocaleString("pl-PL")}
                    color={COLORS.players}
                  />
                </td>
                <td>
                  <StatContainer
                    title="Maksymalna liczba widzów"
                    value={Math.max(...chartData.map((item) => item.viewersOnTwitch)).toLocaleString("pl-PL")}
                    color={COLORS.viewers}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <StatContainer
                    title="Minimalna liczba graczy"
                    value={Math.min(...chartData.map((item) => item.playersOnSteam)).toLocaleString("pl-PL")}
                    color={COLORS.players}
                  />
                </td>
                <td>
                  <StatContainer
                    title="Minimalna liczba widzów"
                    value={Math.min(...chartData.map((item) => item.viewersOnTwitch)).toLocaleString("pl-PL")}
                    color={COLORS.viewers}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <StatContainer
                    title="Suma graczy"
                    value={chartData.reduce((acc, item) => acc + item.playersOnSteam, 0).toLocaleString("pl-PL")}
                    color={COLORS.players}
                  />
                </td>
                <td>
                  <StatContainer
                    title="Suma widzów"
                    value={chartData.reduce((acc, item) => acc + item.viewersOnTwitch, 0).toLocaleString("pl-PL")}
                    color={COLORS.viewers}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <GamePieChart data={chartData} />
                </td>
              </tr>
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  <StatContainer
                    title="Średni stosunek liczby graczy do liczby widzów"
                    value={roundToTwoDecimal(
                      chartData.reduce((acc, item) => acc + item.playersOnSteam, 0) /
                        chartData.reduce((acc, item) => acc + item.viewersOnTwitch, 0)
                    )}
                    color={COLORS.secondary}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <GameRatioLineChart data={chartData} logScale={logScale} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default GamePopularity;
