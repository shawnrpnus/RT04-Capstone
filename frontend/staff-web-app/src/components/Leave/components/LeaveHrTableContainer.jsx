import React from "react";
import "date-fns";
import { clearErrors, updateErrors } from "../../../redux/actions";
import { connect } from "react-redux";
import withPage from "../../Layout/page/withPage";
import withMaterialConfirmDialog from "../../Layout/page/withMaterialConfirmDialog";
import { Grid } from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import AllLeavesManagerTable from "./AllLeavesManagerTable";
import EndorsedLeavesTable from "./EndorsedLeavesTable";
import AllLeavesHrTable from "./AllLeavesHrTable";

class LeaveHrTableContainer extends React.Component {
  componentDidMount() {
    this.handleChangeEndorsed();
    console.log(this.state.mode);
  }

  constructor(props) {
    super(props);
    this.handleChangeEndorsed = this.handleChangeEndorsed.bind(this);
    this.handleChangeAll = this.handleChangeAll.bind(this);
    this.state = {};
  }

  handleChangeEndorsed() {
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
                <h5 className="bold-text">Pending Endorsed Leaves</h5>
              ) : (
                <h5 className="bold-text">All Approved/Rejected Leaves</h5>
              )}
            </Grid>
            <Grid item xs={12} md={3}></Grid>
            <Grid item xs={12} md={2}>
              <ButtonGroup color="primary">
                <Button
                  onClick={this.handleChangeEndorsed}
                  size="small"
                  variant={this.state.mode ? "contained" : "outlined"}
                >
                  Endorsed
                </Button>
                <Button
                  onClick={this.handleChangeAll}
                  size="small"
                  variant={this.state.mode ? "outlined" : "contained"}
                >
                  All
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </div>

        {this.state.mode ? (
          <EndorsedLeavesTable history={this.props.history} />
        ) : (
          <AllLeavesHrTable history={this.props.history} />
        )}
      </React.Fragment>
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
  errors: state.errors
});

const mapDispatchToProps = {
  clearErrors,
  updateErrors
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withMaterialConfirmDialog(withPage(LeaveHrTableContainer, "Leave Management"))
);
