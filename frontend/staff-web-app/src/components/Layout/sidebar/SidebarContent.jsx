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

          <SidebarCategory title="Staff" icon="users">
            <SidebarLink
              title="Create"
              route="/staff/create"
              onClick={this.hideSidebar}
            />
            <SidebarLink
              title="View All"
              route="/staff/viewAll"
              onClick={this.hideSidebar}
            />

            <SidebarLink
                title="Configure Staff Account"
                route="/staff/createAccount"
                onClick={this.hideSidebar}
            />
          </SidebarCategory>

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
          <SidebarLink 
              title="Create" 
              route="/product/createProduct" 
              onClick={this.hideSidebar} />
            <SidebarLink
              title="View All"
              route="/product/viewAllProduct"
              onClick={this.hideSidebar}
            />
          </SidebarCategory>
          <SidebarCategory title="Tag" icon="tag">
            <SidebarLink
              title="Create"
              route="/tag/manage"
              onClick={this.hideSidebar}
            />
            <SidebarLink
              title="Manage"
              route="/tag/addTagToProducts"
              onClick={this.hideSidebar}
            />
          </SidebarCategory>
          <SidebarCategory title="Category" icon="list">
            <SidebarLink
              title="View All"
              route="/category/viewAll"
              onClick={this.hideSidebar}
            />
          </SidebarCategory>
        </ul>
      </div>
    );
  }
}

export default SidebarContent;
