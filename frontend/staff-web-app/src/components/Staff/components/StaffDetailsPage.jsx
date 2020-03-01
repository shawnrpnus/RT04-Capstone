import React, { Component, PureComponent } from "react";
import withPage from "../../Layout/page/withPage";
import { connect } from "react-redux";
import { clearErrors, updateErrors } from "../../../redux/actions";
import { Grid, TextField } from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Button, ButtonToolbar } from "reactstrap";
import * as PropTypes from "prop-types";
import InputAdornment from "@material-ui/core/InputAdornment";
import axios from "axios";
import MaterialNumberSelect from "../../../shared/components/Form/MaterialNumberSelect";

class StaffDetailsPage extends Component {
    static propTypes = {
        errors: PropTypes.object,
    };



    constructor(props) {
        super(props);
        this.state = {
            staffId: this.props.loggedInStaff.staffId,
            firstName: this.props.loggedInStaff.firstName,
            lastName:this.props.loggedInStaff.lastName,
            email: this.props.loggedInStaff.email,
            nric: this.props.loggedInStaff.nric,
            leaveRemaining: this.props.loggedInStaff.leaveRemaining,
            salary: this.props.loggedInStaff.salary,
            username:this.props.loggedInStaff.username,
            line1: this.props.loggedInStaff.address.line1,
            line2: this.props.loggedInStaff.address.line2,
            buildingName: this.props.loggedInStaff.address.buildingName,
            postalCode: this.props.loggedInStaff.address.postalCode,
            departmentName: this.props.loggedInStaff.department.departmentName,
            roleName:this.props.loggedInStaff.role.roleName,
        };
    }

    onChange = e => {
        const name = e.target.name;
        console.log(e);
        this.setState({ [name]: e.target.value }); //computed property name syntax
        if (Object.keys(this.props.errors).length !== 0) {
            this.props.clearErrors();
        }
    };

    render() {
        const { errors, disabled } = this.props;
        return(
            <form className="material-form">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <MaterialTextField
                            fieldLabel="ID"
                            onChange={this.onChange}
                            fieldName="staffId"
                            state={this.state}
                            errors={errors}
                            disabled={true}
                            autoFocus={true}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MaterialTextField
                            fieldLabel="Account username"
                            onChange={this.onChange}
                            fieldName="username"
                            state={this.state}
                            errors={errors}
                            disabled={true}
                            autoFocus={true}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MaterialTextField
                            fieldLabel="First Name"
                            onChange={this.onChange}
                            fieldName="firstName"
                            state={this.state}
                            errors={errors}
                            disabled={true}
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
                            disabled={true}
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
                            disabled={true}
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
                            disabled={true}
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
                        disabled={true}
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
                    disabled={true}
                    autoFocus={true}
                />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MaterialTextField
                            fieldLabel="Salary"
                            onChange={this.onChange}
                            fieldName="salary"
                            state={this.state}
                            errors={errors}
                            disabled={true}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <MaterialTextField
                            onChange={this.onChange}
                            state={this.state}
                            fieldLabel="Leave Remaining"
                            fieldName="leaveRemaining"
                            disabled={true}
                         errors={errors}/>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <MaterialTextField
                            fieldLabel="Postal Code"
                            onChange={this.onChange}
                            fieldName="postalCode"
                            state={this.state}
                            errors={errors}
                            disabled={true}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <MaterialTextField
                            fieldLabel="Building Name"
                            onChange={this.onChange}
                            fieldName="buildingName"
                            state={this.state}
                            errors={errors}
                            disabled={true}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <MaterialTextField
                            fieldLabel="Address Line 1"
                            onChange={this.onChange}
                            fieldName="line1"
                            state={this.state}
                            errors={errors}
                            disabled={true}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <MaterialTextField
                            fieldLabel="Address Line 2"
                            onChange={this.onChange}
                            fieldName="line2"
                            state={this.state}
                            errors={errors}
                            disabled={true}
                        />
                    </Grid>
                </Grid>
            </form>
        );
    }

}

//mapping global state to this component
const mapStateToProps = state => ({
    loggedInStaff : state.staffEntity.loggedInStaff,
    errors: state.errors
});

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withPage(StaffDetailsPage, "Your Profile"));