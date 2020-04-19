import React, { PureComponent } from "react";
import { useSelector } from "react-redux";
import {
  Area,
  AreaChart, Bar, BarChart,
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import "../SalesGraphs/graphStyle.css";

const _ = require("lodash");

function Graph(props) {
  const { yAxis } = props;

  const salesByCategory = useSelector(state => state.analytics.salesByCategory);

  const barColours = ["#8884d8", "#84d8bd", "#d8ca84", "#d88484", "#d884d2"];

  const renderYAxisName = () => {
    if (yAxis === "numPurchases") {
      return "Number of Purchases";
    } else if (yAxis === "revenue") {
      return "Revenue ($)";
    }
  };

  const formatter = (leafNodeName) => {
    const category = salesByCategory.result.find(item => item.leafNodeName === leafNodeName);
    return category.categoryName;
  }
  return (
    <>
      {salesByCategory ? (
        <ResponsiveContainer
          width="100%"
          height={550}
          style={{ fill: "black" }}
        >
          <BarChart
            data={salesByCategory.result}
            margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" style={{ opacity: 0.5 }} />
            <XAxis
              dataKey="leafNodeName"
              tick={<CustomizedAxisTick formatter={formatter} />}
              domain={["dataMin", "dataMax"]}
              interval={0}
            >
              <Label value="Category" offset={50} position="bottom" />
            </XAxis>
            <YAxis
              domain={[dataMin => Math.max(0, dataMin-1000), "dataMax"]}
              label={{
                value: renderYAxisName(),
                angle: -90,
                position: "insideTopLeft",
                dy: 200
              }}
            />
            <Tooltip />
            <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar
                name={`${renderYAxisName()}`}
                dataKey={`${yAxis}`}
                fillOpacity={0.9}
                fill={barColours[barColours.length-1]}
              />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div />
      )}
    </>
  );
}

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload, formatter } = this.props;


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
          {formatter(payload.value)}
        </text>
      </g>
    );
  }
}

export default Graph;
