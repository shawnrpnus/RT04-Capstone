import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { retrieveLowStockProducts } from "../../../redux/actions/dashboardActions";

const _ = require("lodash");

const useStyles = makeStyles({
  card: {
    textAlign: "center"
  }
});

const LowStockAlert = props => {
  const dispatch = useDispatch();
  const store = props.store;
  const classes = useStyles();
  const [numOfLowStockProducts, setNumOfLowStockProducts] = useState("");

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      if (store)
        setNumOfLowStockProducts(await retrieveLowStockProducts(store.storeId));
      else setNumOfLowStockProducts(await retrieveLowStockProducts());
    };
    fetchLowStockProducts();
  }, []);

  return (
    <Link to="/productStock/viewAll">
      <Card className={classes.card}>
        {numOfLowStockProducts !== 0 ? (
          <>
            <Typography
              style={{ color: "red", marginTop: "5%", fontWeight: "bold" }}
            >
              Low stock alert
            </Typography>
            <CardContent>
              <Typography>
                {numOfLowStockProducts} item(s) is/are low in stock
              </Typography>
            </CardContent>
          </>
        ) : (
          <Typography
            style={{
              color: "green",
              margin: "5% 0",
              fontWeight: "bold"
            }}
          >
            All products are sufficiently stocked
          </Typography>
        )}
      </Card>
    </Link>
  );
};

export default LowStockAlert;
