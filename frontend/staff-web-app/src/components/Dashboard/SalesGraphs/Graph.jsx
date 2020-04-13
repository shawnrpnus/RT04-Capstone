import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

function Graph(props) {
  const transactions = useSelector(state => state.transaction.transactions);
  const [state, setState] = useState({});

  return (
    <>
      {transactions ? (
        <LineChart width={730} height={250} data={transactions}
                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="createdDateTime" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="finalTotalPrice" stroke="#8884d8" />
        </LineChart>
      ) : (
        <div />
      )}
    </>
  );
}

export default Graph;
