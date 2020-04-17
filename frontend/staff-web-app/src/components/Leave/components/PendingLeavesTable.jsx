import React from "react";
import "date-fns";
import { clearErrors, updateErrors } from "../../../redux/actions";
import { connect } from "react-redux";
import withPage from "../../Layout/page/withPage";
import {
  endorseRejectLeave,
  retrieveAllPendingLeaves
} from "../../../redux/actions/leaveActions";
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
  ViewColumn,
  CheckCircleOutline,
  CancelOutlined
} from "@material-ui/icons";
import Chip from "@material-ui/core/Chip";
import withMaterialConfirmDialog from "../../Layout/page/withMaterialConfirmDialog";
import EndorseRejectLeaveRequest from "../../../models/leave/EndorseRejectLeaveRequest";

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

class PendingLeavesTable extends React.Component {
  componentDidMount() {
    this.props.retrieveAllPendingLeaves(this.props.loggedInStaff.staffId);
  }

  handleEndorse = staffLeaveId => {
    console.log(this.props.loggedInStaff.staffId);
    const req = new EndorseRejectLeaveRequest(
      staffLeaveId,
      this.props.loggedInStaff.staffId,
      true
    );
    this.props.endorseRejectLeave(req, this.props.history);
  };

  handleReject = staffLeaveId => {
    const req = new EndorseRejectLeaveRequest(
      staffLeaveId,
      this.props.loggedInStaff.staffId,
      false
    );
    this.props.endorseRejectLeave(req, this.props.history);
  };

  render() {
    const data = this.props.allPending;
    console.log(data);

    return (
      <div
        className="table"
        style={{
          width: "auto",
          verticalAlign: "middle",
          textAlign: "right"
        }}
      >
        {this.props.allPending ? (
          <MaterialTable
            title="Leaves"
            icons={tableIcons}
            data={data}
            columns={[
              { title: "Applicant's First Name", field: "applicant.firstName" },
              { title: "Applicant's Last Name", field: "applicant.lastName" },
              { title: "Start Date", field: "fromDateTime" },
              { title: "End Date", field: "toDateTime" },
              { title: "Number of days taken", field: "numDays" },

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
                    <Chip style={{ ...style, color: "white" }} label={status} />
                  );
                }
              }
            ]}
            actions={[
              {
                icon: CheckCircleOutline,
                tooltip: "Endorse",
                onClick: (event, rowData) =>
                  this.handleEndorse(rowData.staffLeaveId)
              },
              {
                icon: CancelOutlined,
                tooltip: "Reject",
                onClick: (event, rowData) =>
                  this.handleReject(rowData.staffLeaveId)
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
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
  loggedInStaff: state.staffEntity.loggedInStaff,
  allPending: state.leave.allPending,
  errors: state.errors
});

const mapDispatchToProps = {
  endorseRejectLeave,
  retrieveAllPendingLeaves,
  clearErrors,
  updateErrors
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withMaterialConfirmDialog(withPage(PendingLeavesTable, "Leave Management")));
