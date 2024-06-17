import { Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Cell } from "recharts";
import ChartContainer from "../ChartContainer/ChartContainer";
import DownloadDataButton from "../DownloadDataButton/DownloadDataButton";
import { COLORS } from "../Colors";
const GamePieChart = ({ data }) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const calculateData = (data) => {
    const totalPlayers = data.reduce((acc, item) => acc + item.playersOnSteam, 0);
    const totalViewers = data.reduce((acc, item) => acc + item.viewersOnTwitch, 0);
    return [
      {
        name: "Gracze",
        value: totalPlayers,
      },
      {
        name: "Widzowie",
        value: totalViewers,
      },
    ];
  };

  const getDownloadableData = (data) => {
    const calculatedData = calculateData(data);
    return {
      totalPlayers: calculatedData[0].value,
      totalViewers: calculatedData[1].value,
      playersPercentage: calculatedData[0].value / (calculatedData[0].value + calculatedData[1].value),
      viewersPercentage: calculatedData[1].value / (calculatedData[0].value + calculatedData[1].value),
    };
  };

  return (
    <ChartContainer>
      <h2>Udziały graczy i widzów</h2>
      <ResponsiveContainer height={400}>
        <PieChart>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={calculateData(data)}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={160}
            fill="#8884d8"
          >
            <Cell fill={COLORS.players} />
            <Cell fill={COLORS.viewers} />
          </Pie>
          <Legend />
          <Tooltip formatter={(value) => value.toLocaleString("pl-PL")} />
        </PieChart>
      </ResponsiveContainer>
      <DownloadDataButton
        data={getDownloadableData(data)}
        dateStart={data[0].date}
        dateEnd={data[data.length - 1].date}
        filePrefix="gameSharesData"
        dataTitle="udziałów graczy i widzów"
      />
    </ChartContainer>
  );
};

export default GamePieChart;
