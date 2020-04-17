import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import {updateLeave} from "../../../redux/actions/leaveActions";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const _ = require("lodash");

const UpdateLeaveDialog = ({ open, onClose, leaveId, loggedInStaff, history }) => {
    const dispatch = useDispatch();
    const [fromDateTime, setFromDateTime] = useState("2020-04-18");
    const [toDateTime, setToDateTime] = useState("2020-04-18");

    const onChangeFrom =(date) => {
        setFromDateTime(date);
    };

    const onChangeTo =(date) => {
        setToDateTime(date);
    };

    const handleUpdate = () => {
        let applicant = loggedInStaff;
        dispatch(updateLeave({leaveId, applicant ,fromDateTime, toDateTime}, history));
        onClose();

    };

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth={"sm"}>
            <DialogTitle>
                Update Leave{" "}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid item md={4}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Enter Start Date"
                            value={fromDateTime}
                            onChange={date => {
                                onChangeFrom(date);
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                    <Grid item md={4}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Enter End Date"
                            value={toDateTime}
                            onChange={date => {
                                onChangeTo(date);
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                    </MuiPickersUtilsProvider>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={handleUpdate}
                >
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateLeaveDialog;
