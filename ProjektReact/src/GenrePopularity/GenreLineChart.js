import React, { useState, useEffect } from "react";
import "rc-slider/assets/index.css";
import { Legend, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import ChartDateSlider from "../ChartDateSlider/ChartDateSlider";

import DownloadDataButton from "../DownloadDataButton/DownloadDataButton";
import ChartContainer from "../ChartContainer/ChartContainer";
import ScaleSwitch from "../ScaleSwitch/ScaleSwitch";

const GenreLineChart = ({ data, customRange }) => {
  const [range, setRange] = useState(customRange);
  const [hidden, setHidden] = useState({});
  const [logScale, setLogScale] = useState(false);

  const colorPalette = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#FF6633",
    "#FFB399",
  ];

  function getColorForGenre(index, type) {
    let color = colorPalette[index % colorPalette.length];
    let f = parseInt(color.slice(1), 16),
      t = type === "players" ? 0 : 127,
      R = f >> 16,
      G = (f >> 8) & 0x00ff,
      B = f & 0x0000ff;
    return (
      "#" +
      (
        0x1000000 +
        (Math.round((t - R) * 0.4) + R) * 0x10000 +
        (Math.round((t - G) * 0.4) + G) * 0x100 +
        (Math.round((t - B) * 0.4) + B)
      )
        .toString(16)
        .slice(1)
    );
  }

  useEffect(() => {
    if (!customRange) {
      setRange([0, data.length - 1]);
    }

    setHidden(
      data[0]
        ? Object.keys(data[0].genres).reduce((acc, genre, index) => {
            acc["genres." + genre + ".players"] = index === 0 ? false : true;
            acc["genres." + genre + ".viewers"] = index === 0 ? false : true;
            return acc;
          }, {})
        : {}
    );
  }, []);

  const formatName = (name) => {
    var prettyName = name.replace("genres.", "").replace(".players", "").replace(".viewers", "");
    prettyName = prettyName.charAt(0).toUpperCase() + prettyName.slice(1);
    prettyName += name.includes(".players") ? " - Gracze" : " - Widzowie";
    return prettyName;
  };

  const renderLegend = () => {
    return (
      <div style={{ marginLeft: "20px" }}>
        {Object.keys(hidden).map((key, index) => {
          const color = getColorForGenre(Math.floor(index / 2), key.includes(".players") ? "players" : "viewers");
          return (
            <div key={`item-${index}`} style={{ color: color, fontWeight: "bold", marginBlock: "5px" }}>
              <input
                key={`item-${index}`}
                type="checkbox"
                checked={!hidden[key]}
                style={{ accentColor: color }}
                onChange={() =>
                  setHidden({
                    ...hidden,
                    [key]: !hidden[key],
                  })
                }
              />
              {formatName(key)}
            </div>
          );
        })}
      </div>
    );
  };

  const calculateRangedData = (data, range) => {
    if (!range) {
      return [];
    }
    const slicedData = data.slice(range[0], range[1] + 1);

    return slicedData;
  };

  const getDownloadableData = (data, range, hidden) => {
    if (!range) {
      return [];
    }
    const rangeData = calculateRangedData(data, range);
    const genres = Object.keys(data[0].genres);

    const downloadableData = rangeData.map((item) => {
      const result = { date: item.date };
      genres.forEach((genre) => {
        if (!hidden["genres." + genre + ".players"]) {
          result["genres." + genre + ".players"] = item.genres[genre].players;
        }
        if (!hidden["genres." + genre + ".viewers"]) {
          result["genres." + genre + ".viewers"] = item.genres[genre].viewers;
        }
      });
      return result;
    });
    return downloadableData;
  };

  return (
    <ChartContainer>
      <h2>Historia popularności gatunków</h2>
      {!customRange && range ? (
        <ChartDateSlider
          max={data.length - 1}
          firstDate={data[range[0]].date}
          lastDate={data[range[1]].date}
          range={range}
          onChange={setRange}
        />
      ) : null}
      <ScaleSwitch logScale={logScale} onSet={setLogScale} />
      <ResponsiveContainer width="100%" height={700}>
        <LineChart
          // key={Object.values(hidden).join(",")}
          data={calculateRangedData(data, range)}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 75,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={60} minTickGap={50} tickMargin={50} />
          <YAxis
            scale={logScale ? "log" : "linear"}
            domain={[logScale ? "auto" : 0, "auto"]}
            tickFormatter={(value) => value.toLocaleString("pl-PL")}
            width={100}
          />
          <Tooltip
            animationDuration={0}
            formatter={(value, name, props) => {
              if (name !== "date") {
                return [value.toLocaleString("pl-PL"), formatName(name)];
              }
            }}
          />
          <Legend align="right" layout="vertical" verticalAlign="middle" content={renderLegend} width={300} />
          {Object.keys(data[0].genres).map((genre, index) => (
            <>
              <Line
                key={"genres." + genre + ".players"}
                dataKey={"genres." + genre + ".players"}
                stroke={getColorForGenre(index, "players")}
                strokeWidth={2}
                hide={hidden["genres." + genre + ".players"]}
                dot={false}
              />
              <Line
                key={"genres." + genre + ".viewers"}
                dataKey={"genres." + genre + ".viewers"}
                stroke={getColorForGenre(index, "viewers")}
                strokeWidth={2}
                hide={hidden["genres." + genre + ".viewers"]}
                dot={false}
              />
            </>
          ))}
        </LineChart>
      </ResponsiveContainer>
      {range ? (
        <DownloadDataButton
          data={getDownloadableData(data, range, hidden)}
          dateStart={data[range[0]].date}
          dateEnd={data[range[1]].date}
          filePrefix="lineData"
          dataTitle="historii popularności gatunków"
        />
      ) : null}
    </ChartContainer>
  );
};

export default GenreLineChart;
