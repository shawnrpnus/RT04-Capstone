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
  const { storeOptions, mode, allStores, yAxis } = props;

  const storeIds = _.keys(storeOptions).filter(
    key => storeOptions[key]
  );

  const reservationsByTimeslot = useSelector(state => state.analytics.reservationsByTimeslot);

  const barColours = ["#8884d8", "#84d8bd", "#d8ca84", "#d88484", "#d884d2"];

  const getStoreNameFromId = storeId => {
    if (allStores) {
      return allStores.find(store => Number(store.storeId) === Number(storeId))
        .storeName;
    }
  };

  const renderYAxisName = () => {
    if (yAxis === "averageReservations") {
      return "Average Reservations";
    } else if (yAxis === "totalReservations") {
      return "Total Reservations";
    }
  };

  return (
    <>
      {reservationsByTimeslot ? (
        <ResponsiveContainer
          width="100%"
          height={550}
          style={{ fill: "black" }}
        >
          <BarChart
            data={reservationsByTimeslot.result}
            margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" style={{ opacity: 0.5 }} />
            <XAxis
              dataKey="timeSlot"
              tick={<CustomizedAxisTick />}
              domain={["dataMin", "dataMax"]}
              interval="preserveStartEnd"
            >
              <Label value="Time Slot (HH:mm)" offset={50} position="bottom" />
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
            {mode === "separate" &&
              storeIds.map((storeId, index) => (
                <Bar
                  key={storeId}
                  name={getStoreNameFromId(storeId)}
                  dataKey={`storeReservationsData.${storeId}-${yAxis}`}
                  stackId={"a"}
                  fillOpacity={0.9}
                  fill={barColours[index]}
                />
              ))}
            {mode === "combined" && (
              <Bar
                name={`Combined ${renderYAxisName()}`}
                dataKey={`${yAxis}`}
                fillOpacity={0.9}
                fill={barColours[barColours.length-1]}
              />
            )}
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
