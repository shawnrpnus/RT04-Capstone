import React, { useEffect, useState, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import * as QRCode from "easyqrcodejs";
import colourList from "../../scss/colours";
import { useDispatch } from "react-redux";
import {
  closeCircularProgress,
  openCircularProgress
} from "../../redux/actions/utilActions";

const _ = require("lodash");
const jsog = require("jsog");

const colours = _.keyBy(colourList, "hex");

function QrCodes(props) {
  const dispatch = useDispatch();
  const [productStocks, setProductStocks] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!productStocks) {
      setProductStocks(jsog.parse(localStorage.getItem("productStocks")));
      setLoaded(true);
    }
    return () => localStorage.removeItem("productStocks");
  }, [loaded]);

  console.log(productStocks);
  return (
    <Grid container style={{ display: "table" }}>
      {productStocks &&
        loaded &&
        productStocks.map(productStock => (
          <QRCodeItem productStock={productStock} />
        ))}
      {loaded && !productStocks && (
        <h4
          className="page-title"
          style={{
            textAlign: "center",
            marginTop: "50px",
            textTransform: "none"
          }}
        >
          No QR Codes selected for generation. Please return to Product Stocks
          page to generate.
        </h4>
      )}
    </Grid>
  );
}

function QRCodeItem(props) {
  const { productStock } = props;

  const productName = productStock.productVariant.product.productName;
  const colour = colours[productStock.productVariant.colour].name;
  const size = productStock.productVariant.sizeDetails.productSize;
  const title = `${productName} (${colour}, ${size})`;
  const options = {
    text: productStock.productStockId.toString(),
    title: title,
    titleFont: "bold 22px Arial",
    subTitle: productStock.productVariant.sku,
    subTitleFont: "22px Arial",
    titleHeight: 130,
    titleBackgroundColor: "#FBCEB1",
    subTitleColor: "black",
    width: 350,
    height: 350
  };

  const qrCodeRef = useRef(null);

  useEffect(() => {
    new QRCode(qrCodeRef.current, options);
  });

  return (
    <Grid
      item
      xs={6}
      sm={4}
      md={3}
      style={{
        padding: "15px 15px",
        pageBreakInside: "avoid",
        display: "inline-block"
      }}
    >
      <div ref={qrCodeRef} style={{ pageBreakInside: "avoid" }} />
    </Grid>
  );
}

export default QrCodes;
