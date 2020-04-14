import React, { PureComponent } from "react";
import { useSelector } from "react-redux";
import {
  Area,
  AreaChart,
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
import "./graphStyle.css";

const _ = require("lodash");

function Graph(props) {
  const { popOptions, lineMode, allStores, yAxis } = props;

  const storeIds = _.keys(popOptions).filter(
    key => key !== "online" && popOptions[key]
  );
  const onlineSelected = popOptions.online;

  const salesByDay = useSelector(state => state.analytics.salesByDay);

  const lineColors = ["#8884d8", "#84d8bd", "#d8ca84", "#d88484", "#d884d2"];

  const getStoreNameFromId = storeId => {
    if (allStores) {
      return allStores.find(store => Number(store.storeId) === Number(storeId))
        .storeName;
    }
  };

  const renderYAxisName = () => {
    if (yAxis === "averageTotalSales") {
      return "Average Sales ($)";
    } else if (yAxis === "totalSales") {
      return "Total Sales ($)";
    } else if (yAxis === "totalTransactions") {
      return "Total Transactions";
    }
  };

  return (
    <>
      {salesByDay ? (
        <ResponsiveContainer
          width="100%"
          height={550}
          style={{ fill: "black" }}
        >
          <AreaChart
            data={salesByDay}
            margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" style={{ opacity: 0.5 }} />
            <XAxis
              dataKey="date"
              tick={<CustomizedAxisTick />}
              domain={["dataMin", "dataMax"]}
              interval="preserveStartEnd"
            >
              <Label value="Date (YYYY-MM-DD)" offset={50} position="bottom" />
            </XAxis>
            <YAxis
              domain={["dataMin", "dataMax"]}
              label={{
                value: renderYAxisName(),
                angle: -90,
                position: "insideTopLeft",
                dy: 200
              }}
            />
            <Tooltip />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            {lineMode === "separate" && onlineSelected && (
              <Area
                name={`Online ${renderYAxisName()}`}
                type="monotone"
                dataKey={`pointOfPurchaseData.online-${yAxis}`}
                stroke={lineColors[lineColors.length - 1]}
                fillOpacity={1}
                fill={lineColors[lineColors.length - 1]}
              />
            )}
            {lineMode === "separate" &&
              storeIds.map((storeId, index) => (
                <Area
                  key={storeId}
                  name={getStoreNameFromId(storeId)}
                  type="monotone"
                  stroke={lineColors[index]}
                  dataKey={`pointOfPurchaseData.${storeId}-${yAxis}`}
                  fillOpacity={0.6}
                  fill={lineColors[index]}
                />
              ))}
            {lineMode === "combined" && (
              <Area
                name={`Combined ${renderYAxisName()}`}
                type="monotone"
                dataKey={`${yAxis}`}
                stroke={lineColors[1]}
                fillOpacity={1}
                fill={lineColors[1]}
              />
            )}
          </AreaChart>
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
