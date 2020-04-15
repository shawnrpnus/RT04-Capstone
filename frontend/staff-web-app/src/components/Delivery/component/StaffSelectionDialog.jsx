import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import { retrieveAllDeliveryStaff } from "./../../../redux/actions/staffActions";
import {
  automateDeliveryAllocation,
  estimateNumberOfDeliveryManRequired
} from "../../../redux/actions/deliveryActions";

const _ = require("lodash");

const StaffSelectionDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const staffList = useSelector(state => state.staffEntity.allStaff);
  const [staffId, setStaffId] = useState("");
  const [numOfDeliverymanRequired, setNumOfDeliverymanRequired] = useState("");

  const onSelectStaff = e => {
    console.log(e.target.value);
    setStaffId(e.target.value);
  };

  useEffect(() => {
    dispatch(retrieveAllDeliveryStaff());
    const fetchEstimatedNumberOfDeliveryManRequired = async () => {
      setNumOfDeliverymanRequired(await estimateNumberOfDeliveryManRequired());
    };
    fetchEstimatedNumberOfDeliveryManRequired();
  }, []);

  const handleAllocateDelivery = () => {
    dispatch(automateDeliveryAllocation(staffId, onClose));
  };

  console.log(numOfDeliverymanRequired);

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={"xs"}>
      <DialogTitle style={{ textAlign: "center" }}>
        Delivery staff allocation
        <br />
        {numOfDeliverymanRequired} staff(s) needed
      </DialogTitle>
      <DialogContent>
        <InputLabel>Select staff: </InputLabel>
        <Select fullWidth defaultValue={""} onChange={onSelectStaff}>
          {staffList &&
            staffList.map(({ staffId, username }) => {
              return (
                <MenuItem key={staffId} value={staffId}>
                  {username}
                </MenuItem>
              );
            })}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="secondary">
          Close
        </Button>
        <Button
          color="primary"
          onClick={handleAllocateDelivery}
          disabled={!staffId}
        >
          Allocate delivery to staff
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffSelectionDialog;
