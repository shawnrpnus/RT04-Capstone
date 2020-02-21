import React, { Component } from "react";
import * as PropTypes from "prop-types";
import SidebarLink from "./SidebarLink";
import SidebarCategory from "./SidebarCategory";

class SidebarContent extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired
  };

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          <SidebarLink
            title="Log Out"
            icon="exit"
            route="/log_in"
            onClick={this.hideSidebar}
          />
          <SidebarCategory title="Stores" icon="store">
            <SidebarLink
              title="Create"
              route="/store/create"
              onClick={this.hideSidebar}
            />
            <SidebarLink
              title="View All"
              route="/store/viewAll"
              onClick={this.hideSidebar}
            />
          </SidebarCategory>
          <SidebarCategory title="Products" icon="diamond">
            <SidebarLink title="Create" route="/" onClick={this.hideSidebar} />
            <SidebarLink
              title="View All"
              route="/viewAllProduct"
              onClick={this.hideSidebar}
            />
          </SidebarCategory>
          <SidebarCategory title="Tag" icon="diamond">
            <SidebarLink
              title="Create"
              route="/tag"
              onClick={this.hideSidebar}
            />
          </SidebarCategory>
        </ul>
      </div>
    );
  }
}

export default SidebarContent;
