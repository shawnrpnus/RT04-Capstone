import React, { Component, PureComponent } from "react";
import withPage from "../../Layout/page/withPage";
import { connect } from "react-redux";
import { clearErrors, updateErrors } from "../../../redux/actions";
import { createNewStaff, retrieveAllRoles, retrieveAllDepartments } from "../../../redux/actions/staffActions";
import Address from "../../../models/address";
import Staff from "../../../models/staff/staff";
import StaffCreateRequest from "../../../models/staff/StaffCreateRequest";
import MomentUtils from "@date-io/moment";
import {Grid, TextField} from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import {
    MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { Button, ButtonToolbar } from "reactstrap";
import * as PropTypes from "prop-types";
import InputAdornment from "@material-ui/core/InputAdornment";
import axios from "axios";
import MaterialNumberSelect from "../../../shared/components/Form/MaterialNumberSelect";
import ContentSaveIcon from "mdi-react/ContentSaveIcon";
import CloseCircleIcon from "mdi-react/CloseCircleIcon";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {retrieveAllCategoryTagStyle} from "../../../redux/actions/productActions";

class StaffCreateForm extends Component {
    static propTypes = {
        errors: PropTypes.object,
        clearErrors: PropTypes.func,
        disabled: PropTypes.bool,
    };

    componentDidMount() {
        this.props.retrieveAllRoles();
        this.props.retrieveAllDepartments();

    }


    onSelectRole =  (event, selectedRole) => {
        if (selectedRole === null) return;
        console.log(selectedRole.roleId);
        this.setState({roleId: selectedRole.roleId});
    };

    onSelectDepartment =  (event, selectedDepartment) => {
        if (selectedDepartment === null) return;
        console.log(selectedDepartment);
        this.setState({departmentId: selectedDepartment.departmentId});
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
            departmentId : "",
            roleId : "",
            salary: "",
            line1: "",
            line2:  "",
            buildingName:  "",
            postalCode: ""
        };
    }

    onChange = e => {
        const name = e.target.name;
        console.log(e);
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
            this.state.email,
            this.state.salary
        );

        const staffAddress = new Address(this.state.line1, this.state.line2, this.state.postalCode, this.state.buildingName);
        const req = new StaffCreateRequest(staff, this.roleId, this.departmentId, staffAddress);

                this.props.createNewStaff(req, this.props.history);


    };

    render() {

        //pulling out the fields from props
        const {errors, disabled} = this.props;
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
                            <Autocomplete
                                id="tags-standard"
                                options={this.props.allDepartments}
                                getOptionLabel={option => option.departmentName}
                                onChange={(event, value) => this.onSelectDepartment(event, value)}
                                getOptionSelected={(option, value) =>
                                    option.departmentId === value.departmentId
                                }
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Department"
                                        fullWidth
                                    />
                                )}
                                errors={errors}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                id="tags-standard"
                                options={this.props.allRoles}
                                getOptionLabel={option => option.roleName}
                                onChange={(event, value) => this.onSelectRole(event, value)}
                                getOptionSelected={(option, value) =>
                                    option.roleId === value.roleId

                                }
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Role"
                                        fullWidth
                                    />
                                )}
                                errors={errors}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MaterialTextField
                                fieldLabel="Salary"
                                onChange={this.onChange}
                                fieldName="salary"
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


                </form>
            </MuiPickersUtilsProvider>

        );


    }


}
//mapping global state to this component
    const mapStateToProps = state => ({
    allRoles: state.staffEntity.allRoles,
        allDepartments: state.staffEntity.allDepartments,
    errors: state.errors
});

    const mapDispatchToProps = {
    createNewStaff, //api/staffEntity/createNewStaff
    clearErrors,
    updateErrors,
        retrieveAllRoles,
        retrieveAllDepartments
};

    export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withPage(StaffCreateForm, "Staff Management"));

