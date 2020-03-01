import React, { PureComponent } from "react";
import DownIcon from "mdi-react/ChevronDownIcon";
import { Collapse } from "reactstrap";
import TopbarMenuLink from "./TopbarMenuLink";
import {
  createNewStaff,
  retrieveAllDepartments,
  retrieveAllRoles,
  staffLogout
} from "../../../redux/actions/staffActions";
import { UserProps, AuthOProps } from "../../../shared/prop-types/ReducerProps";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import {clearErrors, updateErrors} from "../../../redux/actions";
import {useDispatch} from "react-redux";

class TopbarProfile extends PureComponent {
  static propTypes = {
    loggedInStaff: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      collapse: false
    };
  }

  toggle = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
    console.log(this.props.loggedInStaff);
  };

  logout = () => {
    this.props.staffLogout();
  };

  render() {
    const { loggedInStaff } = this.props;
    const { collapse } = this.state;

    return (

      <div className="topbar__profile">
        <button className="topbar__avatar" type="button" onClick={this.toggle}>
          {loggedInStaff && (
            <p className="topbar__avatar-name">
              {loggedInStaff.firstName} {loggedInStaff.lastName}
            </p>
          )}
          <DownIcon className="topbar__icon" />
        </button>
        {collapse && (
          <button
            className="topbar__back"
            type="button"
            onClick={this.toggle}
          />
        )}
        <Collapse isOpen={collapse} className="topbar__menu-wrap">
          <div className="topbar__menu">
            <TopbarMenuLink
              title="My Profile"
              icon="user"
              path="/staff/viewProfile"
              onClick={this.toggle}
            />
            <TopbarMenuLink
                title="Logout"
                icon="exit"
                path="/login"
                onClick={this.logout}
            />
          </div>
        </Collapse>
      </div>
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
 loggedInStaff : state.staffEntity.loggedInStaff
});

const mapDispatchToProps = {
  staffLogout //api/staffEntity/createNewStaff
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopbarProfile);
