import React from "react";
import { Grid } from "@material-ui/core";
import withPage from "../../Layout/page/withPage";
import * as PropTypes from "prop-types";
import {connect} from "react-redux";
import {
    retrieveAllPayrolls, updatePayrollStatus
} from "../../../redux/actions/payrollAction";
import MaterialTable from "material-table";
import {
    AddBox, CancelOutlined,
    Check, CheckCircleOutline, ChevronLeft,
    ChevronRight,
    Clear, Delete,
    DeleteOutline,
    Edit,
    FirstPage, LastPage, Remove,
    SaveAlt, Search,
    SearchOutlined, ViewColumn, Visibility
} from "@material-ui/icons";
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

    componentDidMount() {
        console.log(this.props.loggedInStaff.staffId);
        this.props.retrieveAllPayrolls(this.props.loggedInStaff.staffId);
    }

    handleVerify = payrollId => {
        console.log(payrollId);
        console.log(this.props.loggedInStaff.staffId);
        this.props.updatePayrollStatus(payrollId, this.props.loggedInStaff.staffId);
    };

    render() {
        return(
                <form className="material-form">
                    <Grid container spacing={3}>
                            <div
                                className="table"
                                style={{
                                    width: "auto",
                                    verticalAlign: "middle",
                                    textAlign: "right"
                                }}
                            >  {this.props.allPayrollsStaff ? (
                                    <MaterialTable
                                        title="Payrolls"
                                        icons={tableIcons}
                                        data={this.props.allPayrollsStaff}
                                        columns={[
                                            { title: "Payment Date", field: "paymentDateTime"},
                                            { title: "Leaves taken this month", field: "numLeavesTakenThisMonth"},
                                            { title: "Wage($)/day", field: "staff.salary"},
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

                                        actions={[
                                            {
                                                icon: CheckCircleOutline,
                                                tooltip: "Verify",
                                                onClick: (event, rowData) =>
                                                    this.handleVerify(rowData.payrollId)
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



                    </Grid>
                </form>


        )
    }

}

//mapping global state to this component
const mapStateToProps = state => ({
    loggedInStaff: state.staffEntity.loggedInStaff,
    allPayrollsStaff: state.payroll.allPayrollsStaff
});

const mapDispatchToProps = {
    retrieveAllPayrolls,
    updatePayrollStatus
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withPage(ViewAllPayrollsStaff, "View All"));