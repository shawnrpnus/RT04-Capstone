import React from "react";
import { Grid } from "@material-ui/core";
import {DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import withPage from "../../Layout/page/withPage";
import * as PropTypes from "prop-types";
import {connect} from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import {Button, ButtonToolbar} from "reactstrap";
import CalculateMonthlyPayrollRequest from "../../../models/payroll/CalculateMonthlyPayrollRequest";
import {calculateMonthlySalary, createPayrolls, retrievePayrollsForAMonth} from "../../../redux/actions/payrollAction";
import MaterialTable from "material-table";
import {
    AddBox,
    Check, ChevronLeft,
    ChevronRight,
    Clear, Delete,
    DeleteOutline,
    Edit,
    FirstPage, LastPage, Remove,
    SaveAlt, Search,
    SearchOutlined, ViewColumn, Visibility
} from "@material-ui/icons";
import RetrievePayrollsForAMonthRequest from "../../../models/payroll/RetrievePayrollsForAMonthRequest";
import Chip from "@material-ui/core/Chip";
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

class ViewAllPayrollsStaff extends React.Component {
    static propTypes = {
        errors: PropTypes.object,
        clearErrors: PropTypes.func
    };


    constructor(props) {
        super(props);
        this.handleShowTable = this.handleShowTable.bind(this);
        this.state = ({
            selectedDate: "2020-04-01",
            showTable:false,
        });
    }

    onChange = (date, attr) =>{
        console.log(date);
        console.log(attr);
        this.setState({
            [attr]: date
        });
    };

    handleShowTable() {
        this.setState({ mode: true });
    }

    clear = () => {
        this.setState({
            selectedDate: "2020-04-01"
        });
    };

    cancel = () => {
        this.setState({
            mode: false
        });
    };


    handleSubmit = e => {
        e.preventDefault();
        this.handleShowTable();
        const req = new RetrievePayrollsForAMonthRequest(this.state.selectedDate);
        this.props.retrievePayrollsForAMonth(req);
    };

    render() {
        return(

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <form className="material-form">
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <DatePicker
                                variant="inline"
                                openTo="year"
                                minDate={new Date("2020")}
                                views={["year", "month"]}
                                label="Retrieve payroll for:"
                                helperText="Select year and month"
                                value={this.state.selectedDate}
                                onChange={date => {
                                    this.onChange(date, "selectedDate");
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <ButtonToolbar className="form__button-toolbar">
                                <Button
                                    color="primary"
                                    onClick={e => this.handleSubmit(e, this.state)}
                                >
                                    Retrieve
                                </Button>
                                <Button type="button" onClick={this.clear}>
                                    Clear
                                </Button>
                            </ButtonToolbar>
                        </Grid>

                        <Grid item xs={12} md={6}></Grid>

                        {this.state.mode && (
                            <div
                                className="table"
                                style={{
                                    width: "auto",
                                    verticalAlign: "middle",
                                    textAlign: "right"
                                }}
                            >


                                {this.props.allPayrolls ? (
                                    <MaterialTable
                                        title="Payrolls"
                                        icons={tableIcons}
                                        data={this.props.allPayrolls}
                                        columns={[
                                            {title: "First Name", field: "staff.firstName"},
                                            {title: "Last Name", field: "staff.lastName"},
                                            {title: "Department", field: "staff.department.departmentName"},
                                            {title: "Role", field: "staff.role.roleName"},
                                            { title: "Payment Date", field: "paymentDateTime"},
                                            { title: "Leaves taken this month", field: "numLeavesTakenThisMonth"},
                                            { title: "Final Amount($)", field: "amount" },
                                            {
                                                title: "Verified",
                                                field: "status",
                                                filtering: false,
                                                render: rowData => {
                                                    let style;
                                                    let label;
                                                    const { status } = rowData;

                                                    if (status === true) {
                                                        style = { backgroundColor: "green" };
                                                        label = "VERIFIED";
                                                    } else {
                                                        style = { backgroundColor: "#1975d2" };
                                                        label = "PENDING";
                                                    }

                                                    return (
                                                        <Chip
                                                            style={{ ...style, color: "white" }}
                                                            label={label}
                                                        />
                                                    );
                                                }
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
                        )}


                    </Grid>
                </form>
            </MuiPickersUtilsProvider>


        )
    }

}

//mapping global state to this component
const mapStateToProps = state => ({
    allPayrolls: state.payroll.allPayrolls
});

const mapDispatchToProps = {
    retrievePayrollsForAMonth
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withPage(ViewAllPayrollsStaff, "View All"));