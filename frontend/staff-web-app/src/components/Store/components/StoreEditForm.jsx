import React, {Component} from 'react';
import 'moment';
import {connect} from "react-redux";
import { withRouter } from "react-router";

import {clearErrors, createNewStore} from "../../../redux/actions";
import CreateStoreRequest from "../../../models/store/createStoreRequest";
import Address from "../../../models/address";
import {KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import {Grid, MenuItem, Select} from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import {Button, ButtonToolbar} from "reactstrap";

let moment = require('moment');

const resolvePath = require('object-resolve-path');

class StoreEditForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            storeName: "",
            numChangingRooms: "10",
            openingTime: "09:00:00",
            closingTime: "22:00:00",
            numManagers: "1",
            numAssistants: "5",
            line1: "",
            line2: "",
            buildingName: "",
            postalCode: "",
            openingTimeMoment: moment("09:00", "HH:mm"),
            closingTimeMoment: moment("22:00", "HH:mm")
        }

    }

    onChange = (e) => {
        const name = e.target.name;
        this.setState({[name]: e.target.value}); //computed property name syntax
        if (Object.keys(this.props.errors).length !== 0) this.props.clearErrors();
        console.log(this.state);
    }

    handleTimeChange = (time, attr) => {
        const momentAttr = attr + "Moment";
        const timeString = time.format("HH:mm") + ":00";
        this.setState({
            [attr]: timeString,
            [momentAttr]: time
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {storeName, numChangingRooms, openingTime,
            closingTime, numManagers, numAssistants, line1, line2,
            buildingName, postalCode} = this.state
        const address = new Address(line1, line2, postalCode, buildingName);
        const req = new CreateStoreRequest(
            storeName,
            numChangingRooms,
            openingTime,
            closingTime,
            numManagers,
            numAssistants,
            address
        );
        this.props.createNewStore(req, this.props.history);
    }

    render() {
        const {errors} = this.props;

        const numberOptions = Array.from({length: 20}, (v, k) => k + 1);
        return (
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <form className="material-form" onSubmit={this.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <MaterialTextField fieldLabel="Store Name"
                                               onChange={this.onChange}
                                               fieldName="storeName"
                                               state={this.state}
                                               errors={errors}/>
                        </Grid>
                        <Grid item xs={6}>
                            <div className="material-form__label">Opening Time</div>
                            <KeyboardTimePicker
                                className="material-form__field"
                                style={{"margin-top": 0}}
                                margin="normal"
                                variant="dialog"
                                inputVariant="outlined"
                                value={this.state.openingTimeMoment}
                                onChange={(time) => {
                                    this.handleTimeChange(time, "openingTime")
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <div className="material-form__label">Closing Time</div>
                            <KeyboardTimePicker
                                className="material-form__field"
                                style={{"margin-top": 0}}
                                margin="normal"
                                variant="dialog"
                                inputVariant="outlined"
                                value={this.state.closingTimeMoment}
                                onChange={(time) => {
                                    this.handleTimeChange(time, "closingTime")
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <div className="material-form__label">Number of changing rooms</div>
                            <Select className="material-form__field"
                                    labelId="label" id="select" value={this.state.numChangingRooms}>
                                {numberOptions.map(option =>
                                    <MenuItem value={option}>{option}</MenuItem>)
                                }
                            </Select>
                        </Grid>
                        <Grid item xs={4}>
                            <div className="material-form__label">Number of managers</div>
                            <Select className="material-form__field"
                                    labelId="label" id="select" value={this.state.numManagers}>
                                {numberOptions.map(option =>
                                    <MenuItem value={option}>{option}</MenuItem>)
                                }
                            </Select>
                        </Grid>
                        <Grid item xs={4}>
                            <div className="material-form__label">Number of assistants</div>
                            <Select className="material-form__field"
                                    labelId="label" id="select" value={this.state.numAssistants}>
                                {numberOptions.map(option =>
                                    <MenuItem value={option}>{option}</MenuItem>)
                                }
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <MaterialTextField fieldLabel="Address Line 1"
                                               onChange={this.onChange}
                                               fieldName="line1"
                                               state={this.state}
                                               errors={errors}/>
                        </Grid>
                        <Grid item xs={12}>
                            <MaterialTextField fieldLabel="Address Line 2"
                                               onChange={this.onChange}
                                               fieldName="line2"
                                               state={this.state}
                                               errors={errors}/>
                        </Grid>
                        <Grid item xs={6}>
                            <MaterialTextField fieldLabel="Building Name"
                                               onChange={this.onChange}
                                               fieldName="buildingName"
                                               state={this.state}
                                               errors={errors}/>
                        </Grid>
                        <Grid item xs={6}>
                            <MaterialTextField fieldLabel="Postal Code"
                                               onChange={this.onChange}
                                               fieldName="postalCode"
                                               state={this.state}
                                               errors={errors}/>
                        </Grid>

                    </Grid>
                    <ButtonToolbar className="form__button-toolbar">
                        <Button color="primary" type="submit">Submit</Button>
                        <Button type="button">
                            Cancel
                        </Button>
                    </ButtonToolbar>
                </form>
            </MuiPickersUtilsProvider>
        )

    }
}


const mapStateToProps = (state) => ({
    createdUpdatedStore: state.store.createdUpdatedStore,
    errors: state.errors
})

const mapDispatchToProps = {
    createNewStore,
    clearErrors
}

const connectedForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(StoreEditForm);

export default withRouter(connectedForm);
