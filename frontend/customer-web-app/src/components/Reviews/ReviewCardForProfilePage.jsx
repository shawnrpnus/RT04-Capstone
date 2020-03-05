import { useDispatch, useSelector } from "react-redux";
import sectionCommentsStyle from "../../assets/jss/material-kit-pro-react/views/blogPostSections/sectionCommentsStyle";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useSnackbar } from "notistack";
import { retrieveReviewsByCustomerId } from "../../redux/actions/reviewAction";
import React, { useEffect } from "react";
import GridContainer from "../Layout/components/Grid/GridContainer";
import GridItem from "../Layout/components/Grid/GridItem";
import Button from "@material-ui/core/Button";
import { Add, Clear, Delete, Edit } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { getUpcomingReservations } from "../../redux/actions/reservationActions";
import Rating from "@material-ui/lab/Rating";
import Media from "../Layout/components/Media/Media";

const useStyles = makeStyles(sectionCommentsStyle);
const _ = require("lodash");

export default function ReviewCardForProfilePage() {
  const currCustomer = useSelector(state => state.customer.loggedInCustomer);
  const reviews = useSelector(state => state.review.allReviews);
  const classes = useStyles();

  useEffect(() => {
    dispatch(retrieveReviewsByCustomerId(currCustomer.customerId));
  }, []);

  console.log(reviews);

  //Redux
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={10} md={12}>
          <div>
            <h3 className={classes.title}>Reviews</h3>
          </div>
          {reviews !== null
            ? reviews.map(function(item, i) {
                const months = [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December"
                ];
                const dateTime = new Date(item.createdDateTime);
                const formatted_date =
                  dateTime.getDate() +
                  " " +
                  months[dateTime.getMonth()] +
                  " " +
                  dateTime.getFullYear();

                return (
                  <GridContainer key={item.reviewId} justify="center">
                    <GridItem xs={12} sm={10} md={12}>
                      <Media
                        title={
                          <span>
                            <Link
                              to={`/shop/product/${_.get(
                                item,
                                "product.productId"
                              )}`}
                            >
                              <Button
                                style={{ padding: "0px 2px" }}
                                color="white"
                                size="lg"
                              >
                                {_.get(item, "product.productName")}{" "}
                              </Button>
                            </Link>

                            <small>· {formatted_date}</small>
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
                  </GridContainer>
                );
              })
            : ""}
        </GridItem>
      </GridContainer>
    </div>
  );
}
