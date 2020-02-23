import React, { Component } from "react";
import "moment";
import * as PropTypes from "prop-types";
import withPage from "../../Layout/page/withPage";
import { css } from "@emotion/core";
import { ClipLoader } from "react-spinners";
import { connect } from "react-redux";
import StaffForm from "./StaffForm";
import { clearErrors, updateErrors } from "../../../redux/actions";
import {createNewStaff} from "../../../redux/actions/staffActions";
import Address from "../../../models/address";
import Role from "../../../models/staff/role";
import Department from "../../../models/staff/department";
import Staff from "../../../models/staff/staff";
import StaffCreateRequest from "../../../models/staff/StaffCreateRequest";


class StaffFormContainer extends Component {

    static propTypes = {
        mode: PropTypes.oneOf(["create"]),
        errors: PropTypes.object,
        clearErrors: PropTypes.func.isRequired,
        updateStore: PropTypes.func,
        retrieveStoreById: PropTypes.func,
        createNewStaff: PropTypes.func
    };

    //  componentDidMount() {
    //     this.checkMode();
    // }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.mode !== prevProps.mode) {
            //  this.checkMode();
            this.props.clearErrors();
        }
    }

    // checkMode() {
    //    const { mode, history } = this.props;
    // if (mode === "view" || mode === "update") {
    //        const staffId = this.props.match.params.staffId;
    //    this.props.retrieveStoreById(staffId, history);
    //   }
    // }

    updateErrors = errorMap => {
        this.props.updateErrors(errorMap);
    };

    handleSubmit = (e, formState) => {
        e.preventDefault();
        const {
            firstName,
            lastName,
            leavesRemaining,
            nric,
            email,
            roleName,
            salary,
            departmentName,
            line1,
            line2,
            buildingName,
            postalCode
        } = formState;
        const newStaff = new Staff(firstName, lastName, leavesRemaining, nric, email);
        const role = new Role(roleName, salary);
        const department = new Department(departmentName);
        const address = new Address(line1, line2, postalCode, buildingName);
        const req = new StaffCreateRequest(
            newStaff,
            role,
            department,
            address
        );
        switch (this.props.mode) {
            case "create":
                this.props.createNewStaff(req, this.props.history);
                break;
            case "update":
                // req.staffId = this.props.currentStaff.staffId;
                // this.props.updateStaff(req, this.props.history);
                break;
            default:
        }
    };


    render() {
        const {
            errors,
            clearErrors,
            mode,
            //currentStore,
            location,
            updateErrors,
            renderLoader
        } = this.props;

        const header =
            mode === "view"
                ? "Staff Information"
                : mode === "update"
                ? "Update Staff Information"
                : mode === "create"
                    ? "Create New Staff"
                    : "";

        return (
            <React.Fragment>
                <div className="card__title">
                    <h5 className="bold-text">{header}</h5>
                </div>
                {mode === "create" ? (
                    <StaffForm
                        handleSubmit={this.handleSubmit}
                        clearErrors={clearErrors}
                        errors={errors}
                        updateErrors={updateErrors}
                        history={this.props.history}
                        key={location.pathname}
                    />
                ) : (
                    renderLoader()
                )}
            </React.Fragment>
        );

    }

}

//mapping global state to this component
const mapStateToProps = state => ({
    currentStaff: state.staffEntity.currentStaff,
    errors: state.errors
});

const mapDispatchToProps = {
    createNewStaff, //api/staffEntity/createNewStaff
    clearErrors,
    updateErrors,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withPage(StaffFormContainer, "Staff Management"));