import React from "react";
import { Grid } from "@material-ui/core";
import {DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import withPage from "../../Layout/page/withPage";
import * as PropTypes from "prop-types";
import {connect} from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import {Button, ButtonToolbar} from "reactstrap";
import CalculateMonthlyPayrollRequest from "../../../models/payroll/CalculateMonthlyPayrollRequest";
import {calculateMonthlySalary, createPayrolls} from "../../../redux/actions/payrollAction";
import MaterialTable from "material-table";
import {
    AddBox,
    Check, ChevronLeft,
    ChevronRight,
    Clear,
    DeleteOutline,
    Edit,
    FirstPage, LastPage, Remove,
    SaveAlt, Search,
    SearchOutlined, ViewColumn
} from "@material-ui/icons";
import CreatePayrollsRequest from "../../../models/payroll/CreatePayrollsRequest";
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

class CreatePayrollsForm extends React.Component {
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
            payrolls:[]
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

    handleConfirm = e => {
        e.preventDefault();
        console.log(this.props.allSalary);
        const req = new CreatePayrollsRequest(this.state.selectedDate);
        this.props.createPayrolls(req, this.props.history);
    };

    handleSubmit = e => {
        e.preventDefault();
        this.handleShowTable();
        const req = new CalculateMonthlyPayrollRequest(this.state.selectedDate);
        this.props.calculateMonthlySalary(req, this.props.history);
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
                            label="Generate payroll for:"
                            disabled={this.state.mode}
                            helperText="Select year and month"
                            value={this.state.selectedDate}
                            onChange={date => {
                                this.onChange(date, "selectedDate");
                            }}
                        />
                            </Grid>

                            {!this.state.mode ? (
                            <Grid item xs={12} md={3}>
                                <ButtonToolbar className="form__button-toolbar">
                                    <Button
                                        color="primary"
                                        onClick={e => this.handleSubmit(e, this.state)}
                                    >
                                        Generate
                                    </Button>
                                    <Button type="button" onClick={this.clear}>
                                        Clear
                                    </Button>
                                </ButtonToolbar>
                            </Grid>
                                ):(
                                <Grid item xs={12} md={6}>
                                    <ButtonToolbar className="form__button-toolbar">
                                        <Button
                                            color="danger"
                                            onClick={e => this.handleConfirm(e, this.state)}
                                        >
                                            Confirm payrolls
                                        </Button>
                                        <Button type="button" onClick={this.cancel}>
                                            Cancel
                                        </Button>
                                    </ButtonToolbar>
                                </Grid>
                            )}

                            <Grid item xs={12} md={6}></Grid>

                            {this.state.mode ? (
                            <div
                                className="table"
                                style={{
                                    width: "auto",
                                    verticalAlign: "middle",
                                    textAlign: "right"
                                }}
                            >


                                {this.props.allSalary ? (
                                    <MaterialTable
                                        title="Payrolls"
                                        icons={tableIcons}
                                        data={this.props.allSalary}
                                        columns={[
                                            { title: "ID", field: "staff.staffId" },
                                            {title: "Staff's First Name", field: "staff.firstName"},
                                            {title: "Staff's Last Name", field: "staff.lastName"},
                                            { title: "Date payment will be made", field: "paymentDateTime"},
                                            { title: "Amount ($)", field: "amount" }

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
                                ):(
                                    <div>
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
    allSalary: state.payroll.allSalary
});

const mapDispatchToProps = {
    calculateMonthlySalary,
    createPayrolls
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withPage(CreatePayrollsForm, "Payroll Management"));