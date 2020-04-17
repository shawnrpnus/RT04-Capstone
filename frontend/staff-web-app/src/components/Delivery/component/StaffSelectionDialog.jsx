import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "material-ui-confirm";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import { retrieveAllDeliveryStaff } from "./../../../redux/actions/staffActions";
import { createDeliveryForTransaction } from "../../../redux/actions/deliveryActions";
import { createDeliveryForRestockOrderItem } from "../../../redux/actions/deliveryActions";
import {
  automateDeliveryAllocation,
  estimateNumberOfDeliveryManRequired,
} from "../../../redux/actions/deliveryActions";

const _ = require("lodash");

const StaffSelectionDialog = ({
  open,
  onClose,
  transaction = false,
  instoreRestockOrderItem = false,
  request,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const confirmDialog = useConfirm();
  const staffList = useSelector((state) => state.staffEntity.allStaff);
  const [staffIds, setStaffIds] = useState([]);
  const [numOfDeliverymanRequired, setNumOfDeliverymanRequired] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(100);
  const [recalculate, setRecalculate] = useState(false);
  const [disableRecalculate, setDisableRecalculate] = useState(false);

  const onSelectStaff = (e) => {
    if (e.target.value.length <= numOfDeliverymanRequired)
      setStaffIds(e.target.value);
  };

  useEffect(() => {
    dispatch(retrieveAllDeliveryStaff());
    const fetchEstimatedNumberOfDeliveryManRequired = async () => {
      setNumOfDeliverymanRequired(
        await estimateNumberOfDeliveryManRequired(
          transaction,
          instoreRestockOrderItem,
          maxCapacity
        )
      );
    };
    fetchEstimatedNumberOfDeliveryManRequired();
    setRecalculate(false);
    setStaffIds([]);
  }, [recalculate]);

  const handleAllocateDelivery = () => {
    confirmDialog({
      description: "A new delivery will be created",
    })
      .then(() => {
        if (transaction) {
          request.staffIds = staffIds;
          request.maxCapacity = Number(maxCapacity);
          dispatch(createDeliveryForTransaction(request, history));
        } else if (instoreRestockOrderItem) {
          request.staffIds = staffIds;
          request.maxCapacity = Number(maxCapacity);
          console.log(request);
          dispatch(createDeliveryForRestockOrderItem(request, history));
        } else {
          dispatch(automateDeliveryAllocation(staffIds, onClose, maxCapacity));
        }
      })
      .catch(() => null);
  };

  const onChangeNumber = (e) => {
    let value = e.target.value;
    value = parseFloat(e.target.value).toString();
    if (value === "NaN") value = "";
    setMaxCapacity(Number(value));
    if (disableRecalculate) setDisableRecalculate(false);
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={"xs"}>
      <DialogTitle style={{ textAlign: "center" }}>
        Delivery staff allocation
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Max capacity per delivery"
          name="maxCapacity"
          value={maxCapacity}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={onChangeNumber}
        />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          disabled={maxCapacity === 0 || disableRecalculate}
          onClick={() => {
            setRecalculate(true);
            setDisableRecalculate(true);
          }}
          style={{ margin: "2% 0" }}
        >
          Recalculate
        </Button>
        <Typography
          variant="h6"
          style={{ textAlign: "center", margin: "1% 0" }}
        >
          {numOfDeliverymanRequired} staff(s) needed
        </Typography>
        <InputLabel>Select staff: </InputLabel>
        <Select
          labelId="demo-mutiple-checkbox-label"
          id="demo-mutiple-checkbox"
          input={<Input />}
          fullWidth
          // defaultValue={""}
          value={staffIds}
          multiple
          onChange={onSelectStaff}
          renderValue={(selected) => {
            let names = staffList.map((staff) => {
              if (selected.includes(staff.staffId)) return staff.username;
            });
            names = names.filter((name) => name !== undefined);
            return names.join(", ");
          }}
        >
          {staffList &&
            staffList.map(({ staffId, username }) => {
              return (
                <MenuItem key={staffId} value={staffId}>
                  <Checkbox checked={staffIds.indexOf(staffId) > -1} />
                  <ListItemText primary={username} />
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
          disabled={staffIds.length === 0}
        >
          Allocate delivery to staff
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffSelectionDialog;
