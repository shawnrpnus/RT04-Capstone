import React, { useEffect, useState } from "react";
import { useConfirm } from "material-ui-confirm";
import Dialog from "@material-ui/core/Dialog";
import SignatureCanvas from "react-signature-canvas";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { Cancel } from "@material-ui/icons";
import { toast } from "react-toastify";

const _ = require("lodash");

const SignaturePad = ({
  onClose,
  open,
  confirmDelivery,
  onCloseOuterDialog,
}) => {
  const classes = useStyles();
  const [sigPad, setSigPad] = useState({});
  const [trimmedDataURL, setTrimmedDataURL] = useState("");
  const confirmDialog = useConfirm();

  // console.log(trimmedDataURL);

  const clear = () => sigPad.clear();

  const confirm = () => {
    const dataUrl = sigPad.getTrimmedCanvas().toDataURL("image/png");
    setTrimmedDataURL(dataUrl);
    // not empty
    if (
      dataUrl !==
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII="
    ) {
      confirmDialog({
        description: "Delivery will be confirmed",
      })
        .then(() => {
          confirmDelivery();
          onClose();
          onCloseOuterDialog();
        })
        .catch(() => null);
    } else {
      toast.error("Please sign to confirm delivery", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={"xs"}>
      <div className={classes.container}>
        <div className={classes.sigContainer}>
          <Grid container>
            <Grid item xs={6}>
              <p>Sign here </p>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "right" }}>
              <Tooltip
                title={<span style={{ fontSize: 15 }}>Close dialog</span>}
              >
                <IconButton onClick={onClose} style={{ padding: 1 }}>
                  <Cancel />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <SignatureCanvas
            penColor="black"
            canvasProps={{ className: classes.sigPad }}
            ref={(ref) => {
              setSigPad(ref);
            }}
          />
        </div>
        <Grid container>
          <Grid item xs={6}>
            <Button
              className={classes.buttons}
              onClick={clear}
              color="secondary"
            >
              Clear
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              className={classes.buttons}
              onClick={confirm}
              color="primary"
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
};

export default SignaturePad;

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: "300px",
  },
  sigContainer: {
    width: "90%",
    height: "80%",
    margin: "5% auto 0 auto",
    backgroundColor: "#fff",
  },
  sigPad: {
    width: "100%",
    height: "88%",
    border: "1px solid black",
    backgroundColor: "#f5f5f5",
  },
  buttons: {
    width: "100%",
    height: "30px",
  },
});
