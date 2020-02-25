import React, { Component, PureComponent } from "react";
import withPage from "../../Layout/page/withPage";
import { css } from "@emotion/core";
import { ClipLoader } from "react-spinners";
import { connect } from "react-redux";
import { clearErrors, updateErrors } from "../../../redux/actions";
import { createNewStaff } from "../../../redux/actions/staffActions";
import Address from "../../../models/address";
import Role from "../../../models/staff/role";
import Department from "../../../models/staff/department";
import Staff from "../../../models/staff/staff";
import StaffCreateRequest from "../../../models/staff/StaffCreateRequest";
import MomentUtils from "@date-io/moment";
import { Grid } from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import {
    KeyboardTimePicker,
    MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { Button, ButtonToolbar } from "reactstrap";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";
import InputAdornment from "@material-ui/core/InputAdornment";
import axios from "axios";
import MaterialNumberSelect from "../../../shared/components/Form/MaterialNumberSelect";
import PencilIcon from "mdi-react/PencilIcon";
import ContentSaveIcon from "mdi-react/ContentSaveIcon";
import CloseCircleIcon from "mdi-react/CloseCircleIcon";
import DeleteIcon from "mdi-react/DeleteIcon";
import TableEyeIcon from "mdi-react/TableEyeIcon";
import withMaterialConfirmDialog from "../../Layout/page/withMaterialConfirmDialog";

class StaffCreateForm extends Component {
    static propTypes = {
        errors: PropTypes.object,
        clearErrors: PropTypes.func,
        disabled: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            staffId : undefined,
            firstName: "",
            lastName : "",
            email: "",
            nric: "",
            leaveRemaining : "",
            departmentName : "",
            roleName : "",
            baseSalary: "",
            line1: "",
            line2:  "",
            buildingName:  "",
            postalCode: ""
        };
    }

    onChange = e => {
        const name = e.target.name;
        this.setState({[name]: e.target.value}); //computed property name syntax
        if (Object.keys(this.props.errors).length !== 0) {
            this.props.clearErrors();
        }
    };

    onCancel = () => {
        this.props.history.goBack();
    };

    handlePostalCodeClick = () => {
        const postalCode = this.state.postalCode;
        axios.get(`https://geocode.xyz/${postalCode}?geoit=json`).then(response => {
            const {data} = response;
            if (!data.error && data.standard.countryname === "Singapore") {
                const addrLine1 = data.standard.addresst;
                this.setState({line1: addrLine1});
            } else {
                const customErrors = {
                    postalCode: "Postal code is invalid"
                };
                this.props.updateErrors(customErrors);
            }
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const staff = new Staff(
            this.state.firstName,
            this.state.lastName,
            this.state.leaveRemaining,
            this.state.nric,
            this.state.email
        );
        const role = new Role(this.state.roleName, this.state.baseSalary);
        const department = new Department(this.state.departmentName);
        const staffAddress = new Address(this.state.line1, this.state.line2, this.state.postalCode, this.state.buildingName);
        const req = new StaffCreateRequest(staff, role, department, staffAddress);

                this.props.createNewStaff(req, this.props.history);


    };

    render() {
        //pulling out the fields from props
        const {handleSubmit, errors, disabled, currentStore} = this.props;
        const postalCodeProps = {
            endAdornment: (
                <InputAdornment position="end">
                    <Button
                        size="sm"
                        color="success"
                        outline
                        aria-label="toggle password visibility"
                        onClick={this.handlePostalCodeClick}
                        disabled={disabled}
                    >
                        Autofill
                    </Button>
                </InputAdornment>
            )
        };

        const hasErrors = Object.keys(this.props.errors).length !== 0;

        return (
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <form className="material-form">
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <MaterialTextField
                                fieldLabel="First Name"
                                onChange={this.onChange}
                                fieldName="firstName"
                                state={this.state}
                                errors={errors}
                                disabled={disabled}
                                autoFocus={true}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MaterialTextField
                                fieldLabel="Last Name"
                                onChange={this.onChange}
                                fieldName="lastName"
                                state={this.state}
                                errors={errors}
                                disabled={disabled}
                                autoFocus={true}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MaterialTextField
                                fieldLabel="NRIC"
                                onChange={this.onChange}
                                fieldName="nric"
                                state={this.state}
                                errors={errors}
                                disabled={disabled}
                                autoFocus={true}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MaterialTextField
                                fieldLabel="Email"
                                onChange={this.onChange}
                                fieldName="email"
                                state={this.state}
                                errors={errors}
                                disabled={disabled}
                                autoFocus={true}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MaterialTextField
                                fieldLabel="Department"
                                onChange={this.onChange}
                                fieldName="departmentName"
                                state={this.state}
                                errors={errors}
                                disabled={disabled}
                                autoFocus={true}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MaterialTextField
                                fieldLabel="Role"
                                onChange={this.onChange}
                                fieldName="roleName"
                                state={this.state}
                                errors={errors}
                                disabled={disabled}
                                autoFocus={true}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MaterialTextField
                                fieldLabel="Base Salary"
                                onChange={this.onChange}
                                fieldName="baseSalary"
                                state={this.state}
                                errors={errors}
                                disabled={disabled}
                                autoFocus={true}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MaterialNumberSelect
                                onChange={this.onChange}
                                state={this.state}
                                fieldLabel="Leave Remaining"
                                fieldName="leaveRemaining"
                                optionStart={1}
                                optionEnd={20}
                                disabled={disabled}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MaterialTextField
                                type="number"
                                fieldLabel="Postal Code"
                                onChange={this.onChange}
                                fieldName="postalCode"
                                state={this.state}
                                errors={errors}
                                disabled={disabled}
                                onBlur={this.onBlur}
                                InputProps={postalCodeProps}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MaterialTextField
                                fieldLabel="Building Name"
                                onChange={this.onChange}
                                fieldName="buildingName"
                                state={this.state}
                                errors={errors}
                                disabled={disabled}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MaterialTextField
                                fieldLabel="Address Line 1"
                                onChange={this.onChange}
                                fieldName="line1"
                                state={this.state}
                                errors={errors}
                                disabled={disabled}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MaterialTextField
                                fieldLabel="Address Line 2"
                                onChange={this.onChange}
                                fieldName="line2"
                                state={this.state}
                                errors={errors}
                                disabled={disabled}
                            />
                        </Grid>
                    </Grid>
                    {!disabled ? (
                        <ButtonToolbar className="form__button-toolbar">
                            <Button
                                color="primary"
                                className="icon"
                                onClick={e => this.handleSubmit(e)}
                                disabled={hasErrors}
                            >
                                <p>
                                    <ContentSaveIcon/>
                                    Submit
                                </p>
                            </Button>
                            <Button type="button" className="icon" onClick={this.onCancel}>
                                <p>
                                    <CloseCircleIcon/>
                                    Cancel
                                </p>
                            </Button>
                        </ButtonToolbar>
                    ) : (
                        <ButtonToolbar className="form__button-toolbar">
                            <Link to={`/store/update/${currentStore.storeId}`}>
                                <Button className="icon" color="primary">
                                    <p>
                                        <PencilIcon/>
                                        Update
                                    </p>
                                </Button>
                            </Link>
                            <Button
                                className="icon"
                                color="danger"
                                onClick={() => this.handleDelete(currentStore.storeId)}
                            >
                                <p>
                                    <DeleteIcon/>
                                    Delete
                                </p>
                            </Button>
                            <Link to={`/store/viewAll`}>
                                <Button className="icon">
                                    <p>
                                        <TableEyeIcon/>
                                        View All
                                    </p>
                                </Button>
                            </Link>
                        </ButtonToolbar>
                    )}
                </form>
            </MuiPickersUtilsProvider>
        );
    }
}
//mapping global state to this component
    const mapStateToProps = state => ({
    errors: state.errors
});

    const mapDispatchToProps = {
    createNewStaff, //api/staffEntity/createNewStaff
    clearErrors,
    updateErrors
};

    export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withPage(StaffCreateForm, "Staff Management"));

