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
  const { popOptions, lineMode, allStores } = props;

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
  return (
    <>
      {salesByDay ? (
        <ResponsiveContainer
          width="100%"
          height={500}
          style={{ fill: "black" }}
        >
          <AreaChart
            data={salesByDay}
            margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" style={{ opacity: 0.5 }} />
            <XAxis
              dataKey="date"
              tick={<CustomizedAxisTick />}
              domain={["dataMin", "dataMax"]}
              interval="preserveStartEnd"
            >
              <Label value="Date (YYYY-MM-DD)" offset={40} position="bottom" />
            </XAxis>
            <YAxis
              domain={["dataMin", "dataMax"]}
              label={{
                value: "Average Sales ($)",
                angle: -90,
                position: "insideTopLeft",
                dy: 200
              }}
            />
            <Tooltip />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            {lineMode === "separate" && onlineSelected && (
              <Area
                name="Online Average Sales"
                type="monotone"
                dataKey="pointOfPurchaseData.online-averageTotalSales"
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
                  dataKey={`pointOfPurchaseData.${storeId}-averageTotalSales`}
                  fillOpacity={0.6}
                  fill={lineColors[index]}
                />
              ))}
            {lineMode === "combined" && (
              <Area
                name={"Combined Average Sales"}
                type="monotone"
                dataKey="averageTotalSales"
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
