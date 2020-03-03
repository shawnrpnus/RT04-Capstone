import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import * as PropTypes from "prop-types";
import TopbarSidebarButton from "./TopbarSidebarButton";
import TopbarProfile from "./TopbarProfile";
import TopbarMail from "./TopbarMail";
import TopbarNotification from "./TopbarNotification";
import TopbarSearch from "./TopbarSearch";
import { UserProps } from "../../../shared/prop-types/ReducerProps";
import { useSelector } from "react-redux";

class Topbar extends PureComponent {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
    loggedInStaff: PropTypes.object
  };

  render() {
    const {
      changeMobileSidebarVisibility,
      changeSidebarVisibility,
    } = this.props;

    return (
      <div className="topbar">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            <TopbarSidebarButton
              changeMobileSidebarVisibility={changeMobileSidebarVisibility}
              changeSidebarVisibility={changeSidebarVisibility}
            />
            <Link className="topbar__logo" to="/dashboard_default" />
          </div>
          <div className="topbar__right">
            <TopbarSearch />
            <TopbarNotification />
            <TopbarMail new />
            <TopbarProfile loggedInStaff={this.props.loggedInStaff} />
          </div>
        </div>
      </div>
    );
  }
}

export default Topbar;
