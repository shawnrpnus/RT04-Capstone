import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import { replyToEmail } from "../../../redux/actions/feedbackAction";
import { Grid } from "@material-ui/core";

const _ = require("lodash");

const FeedbackDialog = ({ feedback, open, onClose }) => {
  const {
    status,
    contactUsId,
    customerEmail,
    firstName,
    lastName,
    content,
    contactUsCategory
  } = feedback;
  const dispatch = useDispatch();
  const [reply, setReply] = useState("");

  const onChange = e => {
    setReply(e.target.value);
  };
  const handleReplyEmail = () => {
    dispatch(replyToEmail({ contactUsId, customerEmail, reply }, onClose()));
  };

  let style;
  switch (status) {
    case "REPLIED":
      style = { backgroundColor: "#1975d2" };
      break;
    case "PENDING_ACTION":
      style = { backgroundColor: "#feaa4b" };
      break;
    default:
      // resolved
      style = { backgroundColor: "#33ba0a" };
  }

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={"sm"}>
      <DialogTitle>Reply to feedback </DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item md={4}>
            <TextField
              label="Category"
              name="contactUsCategory"
              value={contactUsCategory}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item md={4}>
            <TextField
              label="Email"
              name="customerEmail"
              value={customerEmail}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              // onChange={this.onChange}
            />
          </Grid>
          <Grid item md={4}>
            <TextField
              label="Name"
              name="name"
              value={firstName + lastName}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              // onChange={this.onChange}
            />
          </Grid>
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2%"
          }}
        >
          <Chip style={{ ...style, color: "white" }} label={status} />
        </div>

        <TextField
          label="Content"
          name="content"
          value={content}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          // onChange={this.onChange}
          multiline
          rowsMax={6}
        />

        <TextField
          label="Reply"
          name="reply"
          value={reply}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          onChange={onChange}
          multiline
          rows={3}
          rowsMax={6}
          autofocus
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={handleReplyEmail}
          disabled={_.get(reply.trim(), "length", 0) <= 0}
        >
          Reply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;
