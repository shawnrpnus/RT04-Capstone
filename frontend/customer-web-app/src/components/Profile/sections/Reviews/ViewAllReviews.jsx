import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import sectionCommentsStyle
  from "../../../../assets/jss/material-kit-pro-react/views/blogPostSections/sectionCommentsStyle";
import {retrieveReviewsByCustomerId} from "../../../../redux/actions/reviewAction";
import GridContainer from "../../../Layout/components/Grid/GridContainer";
import GridItem from "../../../Layout/components/Grid/GridItem";
import Media from "../../../Layout/components/Media/Media";
import ImageGallery from "react-image-gallery";
import wishtlistStyle from "../../../../assets/jss/material-kit-pro-react/views/wishlistStyle";

const useStyles = makeStyles(sectionCommentsStyle);
const useStylesForImage = makeStyles(wishtlistStyle);

const _ = require("lodash");
const moment = require("moment");

export default function ReviewCardForProfilePage(props) {
  const currCustomer = useSelector(state => state.customer.loggedInCustomer);
  const reviews = useSelector(state => state.review.allReviews);
  const classes = useStyles();
  const classesImage = useStyles();

  useEffect(() => {
    dispatch(retrieveReviewsByCustomerId(currCustomer.customerId));
  }, []);

  //Redux
  const dispatch = useDispatch();

  return (
    <GridContainer>
      <GridItem xs={12} sm={10} md={12}>
        {reviews &&
        reviews.map(function(item, i) {
          const dateString = moment(item.createdDateTime).format(
            "D MMMM YYYY"
          );
          const productVariant = _.get(item,"product.productVariants[0]");
          const productId = item.product.productId;
          // const product = item.product;
          //
          // const productImage = product.productVariants[0].productImages[0];
          // // console.log(product);
          // console.log(item);
          // const imageSet = csiMap.productImages.map(prodImage => {
          //   return {
          //     original: prodImage.productImageUrl,
          //     thumbnail: prodImage.productImageUrl
          //   };
          // });
          return (

            <GridContainer
              key={item.reviewId}
              // justify="center"
              // style={{
              //   border: ".5px solid #e8e7e7",
              //   boxShadow: "0 2px 4px 0 rgba(155,155,155,.2)"
              // }}
            >
              <GridItem md={2} xs={6} style={{marginTop:"10px",marginBottom:"10px"}}>
                {/* Modified CSS */}
                <div className={classesImage.imgContainer}>
                  <Link to={`/shop/product/${productId}`}>
                    <img style={{maxWidth:"100%", maxHeight:"100%"}}
                      className={classesImage.img}
                      src={_.get(
                        productVariant,
                        "productImages[0].productImageUrl",
                        ""
                      )}
                      // alt="ProdImg"
                    />
                  </Link>
                </div>
              </GridItem>
              <GridItem xs={7} sm={6} md={6}>
                <Media
                  title={
                    <span>
                        <Link
                          to={`/shop/product/${_.get(
                            item,
                            "product.productId"
                          )}`}
                        >
                          <Button style={{ padding: "0px 2px" }} size="large">
                            {_.get(item, "product.productName")}{" "}
                          </Button>
                        </Link>

                        <small>· {dateString}</small>
                        <br />
                        <Rating
                          name="read-only"
                          value={item.rating}
                          readOnly
                          size="small"
                        />
                      </span>
                  }
                  body={
                    <p
                      style={{ fontSize: "14px" }}
                      className={classes.color555}
                    >
                      {item.content}
                    </p>
                  }
                />
              </GridItem>
              <GridItem md={3} xs={6}>
              </GridItem>
            </GridContainer>
          );
        })}
      </GridItem>
    </GridContainer>
  );
}
