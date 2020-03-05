import React from "react";
import Scrollbar from "react-smooth-scrollbar";
import classNames from "classnames";
import * as PropTypes from "prop-types";
import SidebarContent from "./SidebarContent";
import { SidebarProps } from "../../../shared/prop-types/ReducerProps";
import { useSelector } from "react-redux";

const _ = require("lodash");
const Sidebar = ({ changeMobileSidebarVisibility, sidebar }) => {
  const sidebarClass = classNames({
    sidebar: true,
    "sidebar--show": sidebar.show,
    "sidebar--collapse": sidebar.collapse
  });

  const staff = useSelector(
    state => state.staffEntity.loggedInStaff,
    _.isEqual
  );

  return (
    <div className={sidebarClass}>
      <button
        className="sidebar__back"
        type="button"
        onClick={changeMobileSidebarVisibility}
      />
      <Scrollbar className="sidebar__scroll scroll">
        <div className="sidebar__wrapper sidebar__wrapper--desktop">
          <SidebarContent onClick={() => {}} staff={staff} />
        </div>
        <div className="sidebar__wrapper sidebar__wrapper--mobile">
          <SidebarContent
            onClick={changeMobileSidebarVisibility}
            staff={staff}
          />
        </div>
      </Scrollbar>
    </div>
  );
};

Sidebar.propTypes = {
  sidebar: SidebarProps.isRequired,
  changeMobileSidebarVisibility: PropTypes.func.isRequired
};

export default Sidebar;
