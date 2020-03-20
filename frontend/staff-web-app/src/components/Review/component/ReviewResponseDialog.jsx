import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { respondToReview } from "../../../redux/actions/reviewActions";

const _ = require("lodash");

const ReviewResponseDialog = ({ review, view, open, onClose }) => {
  const { content, response: resp, productName, reviewId, customer } = review;
  const dispatch = useDispatch();
  const [response, setResponse] = useState(resp ? resp : "");

  const { firstName, lastName, customerId } = customer;
  const disabled = _.get(response, "length", 0) <= 0;

  const onChange = e => {
    setResponse(e.target.value);
  };
  const handleRespondToReview = () => {
    dispatch(respondToReview({ reviewId, response }, onClose));
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={"xs"}>
      <DialogTitle>Reply to feedback </DialogTitle>
      <DialogContent>
        <TextField
          label="Customer Name"
          name="name"
          value={`${firstName} ${lastName}`}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          disabled
        />
        <TextField
          label="Customer ID"
          name="customerId"
          value={customerId}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          disabled
        />
        <TextField
          label="Content"
          name="content"
          value={content}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          multiline
          rowsMax={6}
          disabled
        />
        <TextField
          label="Product Name"
          name="productName"
          value={productName}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          multiline
          rowsMax={6}
          disabled
        />
        <TextField
          label="Reponse"
          name="response"
          value={response}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          onChange={onChange}
          multiline
          rows={3}
          rowsMax={6}
          autoFocus={true}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
          Cancel
        </Button>
        {view ? (
          <Button
            color="primary"
            onClick={handleRespondToReview}
            disabled={disabled}
          >
            Update response
          </Button>
        ) : (
          <Button
            color="primary"
            onClick={handleRespondToReview}
            disabled={disabled}
          >
            Respond to review
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReviewResponseDialog;
