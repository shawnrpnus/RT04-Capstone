import React, { Component } from "react";
import { deleteStaff, retrieveAllStaff} from "../../../redux/actions/staffActions";
import { connect } from "react-redux";
import MaterialTable from "material-table";
import {
    AddBox,
    ArrowUpward,
    Check,
    ChevronLeft,
    ChevronRight,
    Clear,
    Delete,
    Edit,
    FirstPage,
    LastPage,
    Remove,
    SaveAlt,
    Search,
    SearchOutlined,
    ViewColumn,
    Visibility
} from "@material-ui/icons";
import withPage from "../../Layout/page/withPage";
import { css } from "@emotion/core";
import withMaterialConfirmDialog from "../../Layout/page/withMaterialConfirmDialog";

const override = css`
  display: block;
  margin: 0 auto;
`;

const tableIcons = {
    Add: AddBox,
    Check: Check,
    Clear: Clear,
    Delete: Delete,
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

class StaffTable extends Component {
    componentDidMount() {
        this.props.retrieveAllStaff();
    }

    handleDelete = staffId => {
        this.props
            .confirmDialog({ description: "Staff will be deleted permanently" })
            .then(() => this.props.deleteStaff(staffId, this.props.history));
    };

    render() {
        const data = this.props.allStaff;
        console.log(data);
        const { history, renderLoader } = this.props;
        return (
            <React.Fragment>
                {/*<div className="card__title">*/}
                {/*  <h5 className="bold-text">All Stores</h5>*/}
                {/*</div>*/}
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
                                { title: "Email", field: "email" },
                                { title: "NRIC", field: "nric" }
                            ]}
                            actions={[
                                {
                                    icon: Visibility,
                                    tooltip: "View More Details",
                                    onClick: (event, rowData) =>
                                        history.push(`/staff/view/${rowData.staffId}`)
                                },
                                {
                                    icon: Edit,
                                    tooltip: "Update Staff",
                                    onClick: (event, rowData) =>
                                        history.push(`/staff/update/${rowData.staffId}`)
                                },
                                {
                                    icon: Delete,
                                    tooltip: "Delete Store",
                                    onClick: (event, rowData) =>
                                        this.handleDelete(rowData.staffId)
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


const mapStateToProps = state => ({
    allStaff: state.staffEntity.allStaff,
    errors: state.errors
});

const mapDispatchToProps = {
    retrieveAllStaff,
    deleteStaff
};

// eslint-disable-next-line no-undef
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withMaterialConfirmDialog(withPage(StaffTable, "Staff Management")));

