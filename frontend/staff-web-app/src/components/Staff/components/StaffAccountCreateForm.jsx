import React, { Component, PureComponent } from "react";
import withPage from "../../Layout/page/withPage";
import { connect } from "react-redux";
import { clearErrors, updateErrors } from "../../../redux/actions";
import { createNewStaffAccount, retrieveStaffWithNoAccount} from "../../../redux/actions/staffActions";
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
                staffIds : []
            };
        }

        componentDidMount() {
                this.props.retrieveStaffWithNoAccount;
            }

    handleCheckBox = (evt, data) => {
            evt.preventDefault();
            //data is the list of products selected
            console.log(data.staffId);

             this.state.staffIds.push(data);
        };

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

        const req = new StaffAccountCreateRequest(this.state.staffIds);

                this.props.createNewStaffAccount(req, this.props.history);


    };

    render() {
        const data = this.props.allStaff;
        console.log(data);
        const { history, renderLoader } = this.props;

        return (
            <React.Fragment>
                            <div
                            className="table"
                            style={{
                            width: "auto",
                            verticalAlign: "middle"
                            }}
                            >

                                {this.props.allStaff ? (
                                    <MaterialTable
                                        title="Staff"
                                        style={{ boxShadow: "none" }}
                                        icons={tableIcons}
                                        columns={[
                                            { title: "ID", field: "staffId" },
                                            { title: "First Name", field: "firstName" },
                                            { title: "Last Name", field: "lastName" },
                                            { title: "Email", field: "email" }
                                        ]}
                                        actions={[
                                            {
                                                 icon: Checkbox,
                                                 tooltip: "Select to configure",
                                                 onClick: (event, rowData) =>
                                                 this.handleCheckBox(event,rowData)
                                            }
                                        ]}
                                        data={data}
                                        options={{
                                            filtering: true,
                                            sorting: true,
                                            pageSize: 5,
                                            search: true,
                                            padding: "dense",
                                            showTitle: true,
                                            pageSizeOptions: [5, 10, 15],
                                            actionsColumnIndex: -1,
                                            headerStyle: { textAlign: "center" },
                                            cellStyle: { textAlign: "center" }
                                        }}
                                    />
                                ) : (
                                    renderLoader()
                                )}
                            </div>
                        </React.Fragment>

        );


    }

}
//mapping global state to this component
    const mapStateToProps = state => ({
    allStaff = state.staffEntity.staffWithNoAccount,
    errors: state.errors
});

    const mapDispatchToProps = {
    createNewStaffAccount, //api/staffEntity/createNewStaffAccount
    retrieveStaffWithNoAccount,
    clearErrors,
    updateErrors
};

    export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withPage(StaffAccountCreateForm, "Staff Account Creation"));

