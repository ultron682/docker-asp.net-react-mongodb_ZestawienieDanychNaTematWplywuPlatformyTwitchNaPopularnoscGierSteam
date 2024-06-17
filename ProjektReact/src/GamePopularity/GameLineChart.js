import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ChartContainer from "../ChartContainer/ChartContainer";
import DownloadDataButton from "../DownloadDataButton/DownloadDataButton";
import { COLORS } from "../Colors";
const GameLineChart = ({ data, logScale }) => {
  return (
    <ChartContainer>
      <h2>Historia liczby graczy i widzów</h2>
      <ResponsiveContainer width="95%" height={500}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 75,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={60} minTickGap={50} tickMargin={50} />
          <YAxis domain={[logScale ? "auto" : 0, "dataMax"]} scale={logScale ? "log" : "linear"} />
          <Tooltip
            animationDuration={0}
            formatter={(value) => {
              return value.toLocaleString("pl-PL");
            }}
          />
          <Legend align="center" layout="horizontal" verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="playersOnSteam"
            name="Gracze"
            stroke={COLORS.players}
            strokeWidth="2px"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="viewersOnTwitch"
            name="Widzowie"
            stroke={COLORS.viewers}
            strokeWidth="2px"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <DownloadDataButton
        data={data}
        dateStart={data[0].date}
        dateEnd={data[data.length - 1].date}
        filePrefix="gamePlayersAndViewersData"
        dataTitle="historii liczby graczy i widzów"
      />
    </ChartContainer>
  );
};

export default GameLineChart;
