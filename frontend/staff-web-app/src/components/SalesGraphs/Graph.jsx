import React, { PureComponent } from "react";
import { useSelector } from "react-redux";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import "./graphStyle.css";

function Graph(props) {
  const salesByDay = useSelector(state => state.analytics.salesByDay);

  return (
    <>
      {salesByDay ? (
        <ResponsiveContainer
          width="100%"
          height={400}
          style={{ fill: "black" }}
        >
          <LineChart
            data={salesByDay}
            margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" style={{opacity: 0.5}}/>
            <XAxis dataKey="date" tick={<CustomizedAxisTick />} domain={['dataMin', 'dataMax']} interval="preserveStartEnd">
              <Label value="Date (YYYY-MM-DD)" offset={40} position="bottom" />
            </XAxis>
            <YAxis
              label={{
                value: "Average Sales ($)",
                angle: -90,
                position: "insideTopLeft",
                dy: 200
              }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="averageTotalSales"
              stroke="#8884d8"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div />
      )}
    </>
  );
}

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          opacity={1}
          transform="rotate(-35)"
        >
          {payload.value}
        </text>
      </g>
    );
  }
}

export default Graph;
