import React, { useState, useEffect } from "react";
import "rc-slider/assets/index.css";
import { Legend, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Bar, BarChart } from "recharts";
import ChartDateSlider from "../ChartDateSlider/ChartDateSlider";
import DownloadDataButton from "../DownloadDataButton/DownloadDataButton";
import ChartContainer from "../ChartContainer/ChartContainer";
import ScaleSwitch from "../ScaleSwitch/ScaleSwitch";
import { COLORS } from "../Colors";

const GenreBarChart = ({ data, customRange }) => {
  const [range, setRange] = useState(customRange);
  const [logScale, setLogScale] = useState(false);
  const [summedData, setSummedData] = useState([]);
  const [domain, setDomain] = useState([0, 0]);
  useEffect(() => {
    if (!customRange) {
      setRange([0, data.length - 1]);
    }
    setSummedData(calculateRangedSums(data, range));
  }, []);

  useEffect(() => {
    setDomain(findMinMax(summedData));
  }, [summedData]);

  useEffect(() => {
    setSummedData(calculateRangedSums(data, range));
  }, [range]);

  const CustomizedAxisTick = (props) => {
    const { x, y, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="start" fill="#666" transform="rotate(60)">
          {payload.value}
        </text>
      </g>
    );
  };

  const findMinMax = (data) => {
    if (data.length === 0) {
      return [0, 0];
    }
    let min = data[0].players;
    let max = data[0].players;
    for (let i = 1; i < data.length; i++) {
      let value = data[i].players;
      min = value < min ? value : min;
      max = value > max ? value : max;
    }
    return [Math.floor(min * 0.7), max];
  };

  const calculateRangedSums = (data, range) => {
    if (!range) {
      return [];
    }
    const genres = Object.keys(data[0].genres);
    const slicedData = data.slice(range[0], range[1] + 1);

    const summedData = genres.map((genre) => {
      let totalPlayers = 0;
      let totalViewers = 0;

      slicedData.forEach((item) => {
        if (item.genres[genre]) {
          totalPlayers += item.genres[genre].players;
          totalViewers += item.genres[genre].viewers;
        }
      });

      return {
        genre,
        players: Math.floor(totalPlayers),
        viewers: Math.floor(totalViewers),
      };
    });
    return summedData;
  };
  return (
    <ChartContainer>
      <h2>Sumaryczna popularność gatunków</h2>
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
      <ResponsiveContainer width="95%" height={550} style={{ marginBottom: "50px" }}>
        <BarChart
          data={summedData}
          height={500}
          margin={{
            top: 50,
            right: 30,
            left: 20,
            bottom: 75,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="genre" tick={<CustomizedAxisTick />} minTickGap={0} interval={0} />
          <YAxis
            scale={logScale ? "log" : "linear"}
            domain={logScale ? domain : [0, "auto"]}
            tickFormatter={(value) => value.toLocaleString("pl-PL")}
            width={100}
            allowDataOverflow={true}
          />
          <Tooltip
            animationDuration={0}
            formatter={(value, name, props) => {
              if (name !== "date") {
                return [value.toLocaleString("pl-PL"), name];
              }
            }}
          />
          <Legend align="center" layout="horizontal" verticalAlign="top" />
          <Bar name="Gracze" dataKey={"players"} fill={COLORS.players} stackId={"a"} />
          <Bar name="Widzowie" dataKey={"viewers"} fill={COLORS.viewers} stackId={"b"} />
        </BarChart>
      </ResponsiveContainer>
      {range ? (
        <DownloadDataButton
          data={calculateRangedSums(data, range)}
          dateStart={data[range[0]].date}
          dateEnd={data[range[1]].date}
          filePrefix="barData"
          dataTitle="sumarycznej popularności gatunków z wykresu słupkowego"
        />
      ) : null}
    </ChartContainer>
  );
};

export default GenreBarChart;
