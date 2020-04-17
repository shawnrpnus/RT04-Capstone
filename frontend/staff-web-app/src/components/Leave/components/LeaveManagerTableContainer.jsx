import React from "react";
import "date-fns";
import { clearErrors, updateErrors } from "../../../redux/actions";
import { connect } from "react-redux";
import withPage from "../../Layout/page/withPage";
import {
  endorseRejectLeave,
  retrieveAllLeavesManager,
  retrieveAllPendingLeaves
} from "../../../redux/actions/leaveActions";
import withMaterialConfirmDialog from "../../Layout/page/withMaterialConfirmDialog";
import { Grid } from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import PendingLeavesTable from "./PendingLeavesTable";
import AllLeavesManagerTable from "./AllLeavesManagerTable";

class LeaveManagerTableContainer extends React.Component {
  componentDidMount() {
    this.handleChangePending();
    console.log(this.state.mode);
  }

  constructor(props) {
    super(props);
    this.handleChangePending = this.handleChangePending.bind(this);
    this.handleChangeAll = this.handleChangeAll.bind(this);
    this.state = {};
  }

  handleChangePending() {
    this.setState({ mode: true });
  }
  handleChangeAll() {
    this.setState({ mode: false });
  }

  render() {
    return (
      <React.Fragment>
        <div className="card__title">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {this.state.mode ? (
                <h5 className="bold-text">Pending Endorsement</h5>
              ) : (
                <h5 className="bold-text">All Endorsed/Rejected Leaves</h5>
              )}
            </Grid>
            <Grid item xs={12} md={3}></Grid>
            <Grid item xs={12} md={2}>
              <ButtonGroup color="primary">
                <Button
                  onClick={this.handleChangePending}
                  size="small"
                  variant={this.state.mode ? "contained" : "outlined"}
                >
                  Pending
                </Button>
                <Button
                  onClick={this.handleChangeAll}
                  size="small"
                  variant={this.state.mode ? "outlined" : "contained"}
                >
                 Endorsed/Rejected
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </div>

        {this.state.mode ? (
          <PendingLeavesTable history={this.props.history} />
        ) : (
          <AllLeavesManagerTable history={this.props.history} />
        )}
      </React.Fragment>
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
  loggedInStaff: state.staffEntity.loggedInStaff,
  allLeavesManager: state.leave.allLeavesManager,
  allPending: state.leave.allPending,
  errors: state.errors
});

const mapDispatchToProps = {
  retrieveAllLeavesManager,
  endorseRejectLeave,
  retrieveAllPendingLeaves,
  clearErrors,
  updateErrors
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withMaterialConfirmDialog(
    withPage(LeaveManagerTableContainer, "Leave Management")
  )
);
