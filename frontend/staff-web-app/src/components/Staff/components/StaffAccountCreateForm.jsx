import React, { Component, PureComponent } from "react";
import withPage from "../../Layout/page/withPage";
import { connect } from "react-redux";
import { clearErrors, updateErrors } from "../../../redux/actions";
import { createNewStaffAccount} from "../../../redux/actions/staffActions";
import StaffAccountCreateRequest from "../../../models/staff/StaffAccountCreateRequest";
import { Button, ButtonToolbar } from "reactstrap";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";
import InputAdornment from "@material-ui/core/InputAdornment";
import axios from "axios";
import {
    KeyboardTimePicker,
    MuiPickersUtilsProvider
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Grid } from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import MaterialNumberSelect from "../../../shared/components/Form/MaterialNumberSelect";
import PencilIcon from "mdi-react/PencilIcon";
import ContentSaveIcon from "mdi-react/ContentSaveIcon";
import CloseCircleIcon from "mdi-react/CloseCircleIcon";
import DeleteIcon from "mdi-react/DeleteIcon";
import TableEyeIcon from "mdi-react/TableEyeIcon";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

class StaffAccountCreateForm extends Component {
    static propTypes = {
        errors: PropTypes.object,
        clearErrors: PropTypes.func,
        disabled: PropTypes.bool,
    };


    constructor(props) {
            super(props);
            this.state = {
                staffId : ""
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

handleSubmit = (e) => {
        e.preventDefault();

        const req = new StaffAccountCreateRequest(this.state.staffId);

                this.props.createNewStaffAccount(req, this.props.history);


    };

    render() {
        //pulling out the fields from props
        const {errors, disabled} = this.props;

        const hasErrors = Object.keys(this.props.errors).length !== 0;

        return (
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <form className="material-form">
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <MaterialTextField
                                fieldLabel="Staff ID"
                                onChange={this.onChange}
                                fieldName="staffId"
                                state={this.state}
                                errors={errors}
                                disabled={disabled}
                                autoFocus={true}
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
    errors: state.errors
});

    const mapDispatchToProps = {
    createNewStaffAccount, //api/staffEntity/createNewStaffAccount
    clearErrors,
    updateErrors,

};

    export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withPage(StaffAccountCreateForm, "Staff Account Creation"));

