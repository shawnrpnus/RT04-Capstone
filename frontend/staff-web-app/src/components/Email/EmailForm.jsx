import React, { useState } from "react";
import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import { massSendEmail } from "./../../redux/actions/emailActions";
import { useConfirm } from "material-ui-confirm";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const _ = require("lodash");

const EmailForm = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const confirmDialog = useConfirm();
  const [state, setState] = useState({
    subject: "",
    content: "",
    instruction: "",
    buttonText: "",
    link: ""
  });

  const onChange = ({ target: input }) => {
    const newState = { ...state };
    newState[input.name] = input.value;
    setState(newState);
  };

  const handleSubmit = () => {
    confirmDialog({ description: "Sending email to all customers" })
      .then(() => {
        dispatch(massSendEmail(state, onClose));
      })
      .catch(() => null);
  };

  const { subject, content, instruction, buttonText, link } = state;
  const array = [instruction, buttonText, link];
  const required = subject !== "" && content !== "";
  const combo = array.every(e => e !== "") || array.every(e => e === "");

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={"sm"}>
      <DialogTitle style={{ textAlign: "center" }}>Mass Email</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item md={12}>
            <TextField
              label="Subject"
              name="subject"
              value={subject}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              onChange={onChange}
              autoFocus={true}
              required
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Content"
              name="content"
              value={content}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              onChange={onChange}
              required
              multiline
              rows={3}
              rowsMax={6}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Instruction"
              name="instruction"
              value={instruction}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              onChange={onChange}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Button Text"
              name="buttonText"
              value={buttonText}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              onChange={onChange}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Action Link"
              name="link"
              value={link}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              onChange={onChange}
            />
          </Grid>
          <small style={{ color: "red", visibility: combo && "hidden" }}>
            Instructions, button text and action link must all be filled
            together or left blank together
          </small>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid item md={12} style={{ textAlign: "right" }}>
          <Button autoFocus onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleSubmit}
            disabled={!required || !combo}
          >
            Send
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default EmailForm;
