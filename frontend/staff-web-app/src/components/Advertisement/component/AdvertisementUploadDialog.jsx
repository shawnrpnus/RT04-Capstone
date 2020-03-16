import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import { createAdvertisement } from "../../../redux/actions/advertisementActions";
import FileUpload from "./FileUpload";

const _ = require("lodash");

const AdvertisementUploadDialog = ({ open, onClose, staffId }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState([]);
  const [activate, setActivate] = useState(false);

  const handleCreateAdvertisement = () => {
    const request = { staffId, activate };
    const form = new FormData();
    form.append("advertisement", file[0]);
    form.append("request", JSON.stringify(request));
    dispatch(createAdvertisement(form, onClose));
  };

  const handleOnDrop = file => {
    setFile(file);
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={"sm"}>
      <DialogTitle>Create Advertisement</DialogTitle>
      <DialogContent>
        <Grid container item xs={12} style={{ justifyContent: "flex-end" }}>
          <Typography>
            Activate :
            <Checkbox
              checked={activate}
              onChange={() => setActivate(!activate)}
              color="secondary"
            />
          </Typography>
        </Grid>
      </DialogContent>
      <FileUpload handleOnDrop={handleOnDrop}></FileUpload>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={handleCreateAdvertisement}
          disabled={file.length === 0}
          style={{ margin: "2% 0" }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvertisementUploadDialog;
