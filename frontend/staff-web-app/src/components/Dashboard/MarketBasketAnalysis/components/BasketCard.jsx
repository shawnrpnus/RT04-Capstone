import React from "react";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const BasketCard = ({ products }) => {
  return (
    <Grid
      container
      style={{
        justifyContent: "center",
      }}
    >
      {products.map(({ product, colourToSizeImageMaps }, index) => {
        return (
          <div key={index} style={{ textAlign: "center", width: "200px" }}>
            <Link to={`/product/viewProductDetails/${product.productId}`}>
              <img
                style={{ height: "150px", width: "50%" }}
                src={colourToSizeImageMaps[0].productImages[0].productImageUrl}
              />
            </Link>
            <Typography variant="body2">{product.productName}</Typography>
          </div>
        );
      })}
    </Grid>
    // <CardActions>
    //   <Button size="small">Learn More</Button>
    // </CardActions>
  );
};

export default BasketCard;
