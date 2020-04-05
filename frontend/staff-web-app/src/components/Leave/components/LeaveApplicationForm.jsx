import React from "react";
import { Grid } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { Button, ButtonToolbar } from "reactstrap";
import * as PropTypes from "prop-types";
import { clearErrors, updateErrors } from "../../../redux/actions";
import { connect } from "react-redux";
import withPage from "../../Layout/page/withPage";
import {applyForLeave, deleteLeave, retrieveAllLeaves} from "../../../redux/actions/leaveActions";
import StaffLeave from "../../../models/leave/staffLeave";
import LeaveCreateRequest from "../../../models/leave/LeaveCreateRequest";
import MaterialTable from "material-table";
import {
  AddBox,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  Delete,
  DeleteOutline,
  Edit,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  SearchOutlined,
  ViewColumn
} from "@material-ui/icons";
import Chip from "@material-ui/core/Chip";
import withMaterialConfirmDialog from "../../Layout/page/withMaterialConfirmDialog";

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: SearchOutlined,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: () => <div />,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};

class LeaveApplicationForm extends React.Component {
  static propTypes = {
    errors: PropTypes.object,
    clearErrors: PropTypes.func
  };

  componentDidMount() {
    console.log(this.props.loggedInStaff.staffId);
    this.props.retrieveAllLeaves(this.props.loggedInStaff.staffId);
  }

  constructor(props) {
      super(props);
      this.state = {
          fromDateTime: "2020-04-05",
          toDateTime: "2020-04-05"
      };
  }



    onCancel = () => {
        this.props.history.goBack();
    };

    handleDelete = staffLeaveId => {
        this.props
            .confirmDialog({ description: "Leave will be deleted permanently" })
            .then(() => this.props.deleteLeave(staffLeaveId, this.props.loggedInStaff.staffId, this.props.history));
    };

    handleSubmit = e => {
        e.preventDefault();

        const leave = new StaffLeave(
            this.state.fromDateTime,
            this.state.toDateTime,
            this.props.loggedInStaff
        );
        const req = new LeaveCreateRequest(leave);
        console.log(req);

        this.props.applyForLeave(req, this.props.history);
    };

    render() {
        const data = this.props.allLeaves;
        const hasErrors = Object.keys(this.props.errors).length !== 0;
        return(
            <Grid container spacing={3}>

                <Grid item xs={12} md={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <form className="material-form">
                    <Grid item xs={12}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Enter Start Date"
                            value={this.state.fromDateTime}
                            onChange={date => {
                                this.onChange(date, "fromDateTime");
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Enter End Date"
                            value={this.state.toDateTime}
                            onChange={date => {
                                this.onChange(date, "toDateTime");
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <Grid item xs={12}>
                            <ButtonToolbar className="form__button-toolbar">
                                <Button
                                    color="primary"
                                    onClick={e => this.handleSubmit(e, this.state)}
                                >
                                    Submit
                                </Button>
                                <Button type="button" onClick={this.clear}>
                                    Clear
                                </Button>
                            </ButtonToolbar>
                        </Grid>
                    </Grid>
                </form>
            </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} md={9}>
                    <React.Fragment>
                    <div className="table" style={{ verticalAlign: "middle" }}>
                            {this.props.allLeaves ? (
                                <MaterialTable
                                    title="All applied leaves"
                                    icons={tableIcons}
                                    data={data}
                                    columns={[
                                        { title: "Start Date", field: "fromDateTime" },
                                        { title: "End Date", field: "toDateTime" },

                                        {
                                            title: "Status",
                                            field: "status",
                                            filtering: false,
                                            render: rowData => {
                                                let style;
                                                const { status } = rowData;

                                                switch (status) {
                                                    case "ENDORSED":
                                                        style = { backgroundColor: "orange" };
                                                        break;
                                                    case "APPROVED":
                                                        style = { backgroundColor: "green" };
                                                        break;
                                                    case "REJECTED":
                                                        style = { backgroundColor: "red" };
                                                        break;
                                                    default:
                                                        style = { backgroundColor: "#1975d2" };
                                                }

                                                return (
                                                    <Chip
                                                        style={{ ...style, color: "white" }}
                                                        label={status}
                                                    />
                                                );
                                            }
                                        }
                                    ]}

                                    actions={[
                                        {
                                            icon: Delete,
                                            tooltip: "Delete Tag",
                                            onClick: (event, rowData) => this.handleDelete(rowData.staffLeaveId)
                                        }
                                    ]}

                                    options={{
                                        filtering: true,
                                        sorting: true,
                                        pageSize: 10,
                                        search: true,
                                        padding: "dense",
                                        pageSizeOptions: [10, 20, 40],
                                        actionsColumnIndex: -1,
                                        headerStyle: { textAlign: "center" },
                                        cellStyle: { textAlign: "center" },
                                        searchFieldStyle: { textAlign: "center", width: "100%" },
                                        rowStyle: { textAlign: "center" }
                                    }}
                                />
                            ) : (
                                this.props.renderLoader()
                            )}
                        </div>
                    </React.Fragment>


                </Grid>
            </Grid>

        )
    }
}

//mapping global state to this component
const mapStateToProps = state => ({
  loggedInStaff: state.staffEntity.loggedInStaff,
  allLeaves: state.leave.allLeaves,
  errors: state.errors
});

const mapDispatchToProps = {
    applyForLeave,
    retrieveAllLeaves,
    deleteLeave,
    clearErrors,
    updateErrors
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withMaterialConfirmDialog(withPage(LeaveApplicationForm, "Leave Management")));
