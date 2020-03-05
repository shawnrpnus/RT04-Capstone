import makeStyles from "@material-ui/core/styles/makeStyles";

import sectionCommentsStyle from "../../assets/jss/material-kit-pro-react/views/blogPostSections/sectionCommentsStyle";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Media from "../Layout/components/Media/Media";
import React, { useEffect, useState } from "react";
import CustomInput from "../UI/CustomInput/CustomInput";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import { Delete, Edit, Place } from "@material-ui/icons";
import withStyles from "@material-ui/core/styles/withStyles";
import { clearErrors } from "../../redux/actions";
import InputAdornment from "@material-ui/core/InputAdornment";
import CustomTextField from "../UI/CustomInput/CustomTextField";
import Review from "../../models/review/Review";
import AddEditReviewRequest from "../../models/review/AddEditReviewRequest";
import {
  createReviewDetails,
  updateReviewDetails
} from "../../redux/actions/reviewAction";

const useStyles = makeStyles(sectionCommentsStyle);
const StyledRating = withStyles({
  iconFilled: {
    color: "#ff6d75"
  },
  iconHover: {
    color: "#ff3d47"
  }
})(Rating);
export default function AddEditReview(props) {
  const { reviews, currReview, setCurrReview, addNewReview, setAddNewReview} = props;
  const classes = useStyles();
  //Redux
  const dispatch = useDispatch();
  const history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const currCustomer = useSelector(state => state.customer.loggedInCustomer);
  const errors = useSelector(state => state.errors);
  const currentProductDetail = useSelector(
    state => state.product.currentProductDetail
  );

  //State
  const [inputState, setInputState] = useState({
    reviewId: currReview ? currReview.reviewId : "",
    content: currReview ? currReview.content : "",
    rating: currReview ? currReview.rating : 3
  });
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
  const dateTime = new Date();
  const formatted_date =
    dateTime.getDate() +
    " " +
    months[dateTime.getMonth()] +
    " " +
    dateTime.getFullYear();

  const onChange = e => {
    e.persist();
    console.log(e);
    setInputState(inputState => ({
      ...inputState,
      [e.target.name]: e.target.value
    }));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
    // console.log(inputState);
  };

  const onSubmit = () => {
    if (currReview) { //edit review
      const review = new Review(
        inputState.reviewId,
        inputState.content,
        inputState.rating
      );
      const req = new AddEditReviewRequest(
        review,
        currentProductDetail.product.productId,
        currCustomer.customerId
      );
      console.log(req);
      dispatch(
        updateReviewDetails(
          req,
          currentProductDetail.product.productId,
          enqueueSnackbar
        )
      );
      setCurrReview('');
    } else { //add new review
      const review = new Review(
        inputState.reviewId,
        inputState.content,
        inputState.rating,
        currentProductDetail.product
      );
      const req = new AddEditReviewRequest(
        review,
        currentProductDetail.product.productId,
        currCustomer.customerId
      );
      console.log(req);
      dispatch(
        createReviewDetails(
          req,
          currentProductDetail.product.productId,
          enqueueSnackbar
        )
      );

    }
    if(currReview) {
      setCurrReview('');
    } else {
      setAddNewReview(!addNewReview);
    }
  };

  return (
    <div>
      {currReview ? (
        <h3 className={classes.title}>Edit a review</h3>
      ) : (
        <h3 className={classes.title}>Add a review</h3>
      )}

      <form>
        <Media
          title={
            <span>
              {currCustomer.firstName} {currCustomer.lastName}{" "}
              <small>· {formatted_date}</small>
              <br />
              <Rating
                name="simple-controlled"
                value={inputState.rating}
                onChange={(event, newValue) => {
                  setInputState(inputState => ({
                    ...inputState,
                    rating: newValue
                  }));
                }}
              />
            </span>
          }
          body={
            <CustomTextField
              fieldLabel="Write your review here"
              fieldName="content"
              inputState={inputState}
              onChange={onChange}
              errors={errors}
            />
          }
          footer={
            <span>
              <Button
                onClick={() => {
                  if(currReview) {
                    setCurrReview('');
                  } else {
                    setAddNewReview(!addNewReview);
                  }
                  dispatch(clearErrors());
                }}
                className={classes.footerButtons}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onSubmit();
                  dispatch(clearErrors());
                }}
                color="primary"
                className={classes.footerButtons}
              >
                Post review
              </Button>
            </span>
          }
        />
      </form>
    </div>
  );
}
