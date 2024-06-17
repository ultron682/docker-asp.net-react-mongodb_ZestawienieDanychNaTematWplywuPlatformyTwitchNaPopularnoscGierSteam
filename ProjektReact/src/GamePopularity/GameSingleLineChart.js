import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ChartContainer from "../ChartContainer/ChartContainer";
import DownloadDataButton from "../DownloadDataButton/DownloadDataButton";
const GameSingleLineChart = ({ data, dataKey, label, color, logScale }) => {
  return (
    <ChartContainer>
      <h2>{label}</h2>
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
          <Line type="monotone" dataKey={dataKey} name={label} stroke={color} strokeWidth="2px" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <DownloadDataButton
        data={data}
        dateStart={data[0].date}
        dateEnd={data[data.length - 1].date}
        filePrefix={`game${dataKey === "playersOnSteam" ? "Players" : "Viewers"}Data`}
        dataTitle={`historii liczby ${dataKey === "playersOnSteam" ? "graczy" : "widzów"}`}
      />
    </ChartContainer>
  );
};

export default GameSingleLineChart;
