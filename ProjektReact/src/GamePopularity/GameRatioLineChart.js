import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ChartContainer from "../ChartContainer/ChartContainer";
import DownloadDataButton from "../DownloadDataButton/DownloadDataButton";
import { COLORS } from "../Colors";

const GameRatioLineChart = ({ data, logScale }) => {
  const calculateRatio = (data) => {
    return data.map((item) => ({
      date: item.date,
      playersViewersRatio: roundToTwoDecimal(item.playersOnSteam / item.viewersOnTwitch),
    }));
  };
  const roundToTwoDecimal = (num) => {
    return Math.round(num * 100) / 100;
  };
  return (
    <ChartContainer>
      <h2>Historia stosunku liczby graczy do widzów</h2>
      <ResponsiveContainer width="95%" height={500}>
        <LineChart
          data={calculateRatio(data)}
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
          <Tooltip animationDuration={0} />
          <Line
            type="monotone"
            dataKey="playersViewersRatio"
            name="Stosunek"
            stroke={COLORS.secondary}
            strokeWidth="2px"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <DownloadDataButton
        data={calculateRatio(data)}
        dateStart={data[0].date}
        dateEnd={data[data.length - 1].date}
        filePrefix="gameRatioData"
        dataTitle="historii stosunku liczby graczy do widzów"
      />
    </ChartContainer>
  );
};

export default GameRatioLineChart;
