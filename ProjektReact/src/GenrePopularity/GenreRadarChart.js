import React, { useState, useEffect } from "react";
import "rc-slider/assets/index.css";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import ChartDateSlider from "../ChartDateSlider/ChartDateSlider";

import DownloadDataButton from "../DownloadDataButton/DownloadDataButton";
import ChartContainer from "../ChartContainer/ChartContainer";
import ScaleSwitch from "../ScaleSwitch/ScaleSwitch";
import { COLORS } from "../Colors";

const GenreRadarChart = ({ data, customRange }) => {
  const [range, setRange] = useState(customRange);
  const [maxValue, setMaxValue] = useState(0);
  const [logScale, setLogScale] = useState(false);

  useEffect(() => {
    if (!customRange) {
      setRange([0, data.length - 1]);
    }
  }, []);

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

      if (totalPlayers > maxValue) {
        setMaxValue(totalPlayers);
      }
      if (totalViewers > maxValue) {
        setMaxValue(totalViewers);
      }

      return {
        genre,
        players: totalPlayers,
        viewers: totalViewers,
      };
    });
    return summedData;
  };

  return (
    <ChartContainer>
      <h2>Sumaryczna popularność gatunków</h2>
      <div>
        {!customRange && range ? (
          <ChartDateSlider
            max={data.length - 1}
            firstDate={data[range[0]].date}
            lastDate={data[range[1]].date}
            range={range}
            onChange={setRange}
          />
        ) : null}
      </div>
      <div>
        <ScaleSwitch logScale={logScale} onSet={setLogScale} />
        <ResponsiveContainer width="90%" height={550}>
          <RadarChart outerRadius={200} data={calculateRangedSums(data, range)}>
            <PolarGrid />
            <PolarAngleAxis dataKey="genre" />
            <PolarRadiusAxis
              scale={logScale ? "log" : "linear"}
              domain={[logScale ? "auto" : 0, "auto"]}
              tick={false}
            />
            <Legend />
            <Tooltip
              animationDuration={0}
              formatter={(value, name, props) => {
                if (name !== "date") {
                  return [value.toLocaleString("pl-PL"), name];
                }
              }}
            />
            <Radar name="Gracze" dataKey="players" stroke={COLORS.players} fill={COLORS.players} fillOpacity={0.3} />
            <Radar name="Widzowie" dataKey="viewers" stroke={COLORS.viewers} fill={COLORS.viewers} fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {range ? (
        <DownloadDataButton
          data={calculateRangedSums(data, range)}
          dateStart={data[range[0]].date}
          dateEnd={data[range[1]].date}
          filePrefix="radarData"
          dataTitle="sumarycznej popularności gatunków z wykresu radarowego"
        />
      ) : null}
    </ChartContainer>
  );
};

export default GenreRadarChart;
