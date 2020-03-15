import React, { Component } from "react";
import * as PropTypes from "prop-types";
import SidebarLink from "./SidebarLink";
import SidebarCategory from "./SidebarCategory";
import { FaAdversal } from "react-icons/fa";

const _ = require("lodash");

class SidebarContent extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired
  };

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    const department = _.get(this.props.staff, "department.departmentName");
    const hr = department === "HR";
    const salesmarketing = department === "Sales and Marketing";
    const it = department === "IT";
    const store = department === "Store";
    const warehouse = department === "Warehouse";

    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          {(it || hr) && (
            <SidebarCategory title="Staff" icon="users">
              {it && (
                <React.Fragment>
                  <SidebarLink
                    title="Configure Staff Account"
                    route="/staff/createAccount"
                    onClick={this.hideSidebar}
                  />

                  <SidebarLink
                    title="Reset Staff Password"
                    route="/staff/resetPassword"
                    onClick={this.hideSidebar}
                  />
                </React.Fragment>
              )}
              {hr && (
                <React.Fragment>
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
                </React.Fragment>
              )}
            </SidebarCategory>
          )}
          {warehouse && (
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
          )}
          {(salesmarketing || store || warehouse) && (
            <SidebarCategory title="Products" icon="diamond">
              {salesmarketing && (
                <SidebarLink
                  title="Create"
                  route="/product/createProduct"
                  onClick={this.hideSidebar}
                />
              )}
              <SidebarLink
                title="View All"
                route="/product/viewAllProduct"
                onClick={this.hideSidebar}
              />
            </SidebarCategory>
          )}
          {(salesmarketing || store || warehouse) && (
            <SidebarCategory title="Tag" icon="tag">
              {salesmarketing && (
                <SidebarLink
                  title="Create"
                  route="/tag/manage"
                  onClick={this.hideSidebar}
                />
              )}
              <SidebarLink
                title={salesmarketing ? "Manage" : "View"}
                route="/tag/addTagToProducts"
                onClick={this.hideSidebar}
              />
            </SidebarCategory>
          )}
          {(salesmarketing || store || warehouse) && (
            <SidebarCategory title="Category" icon="list">
              <SidebarLink
                title="View All"
                route="/category/viewAll"
                onClick={this.hideSidebar}
              />
            </SidebarCategory>
          )}
          {(store || warehouse) && (
            <SidebarCategory title="Product Stocks" icon="list">
              <SidebarLink
                title="View All"
                route="/productStock/viewAll"
                onClick={this.hideSidebar}
              />
            </SidebarCategory>
          )}
          <SidebarCategory title="Feedback" icon="list">
            <SidebarLink
              title="View Feedback"
              route="/feedback/viewAll"
              onClick={this.hideSidebar}
            />
          </SidebarCategory>
          <SidebarCategory title="Restock Order" icon="list">
            <SidebarLink
              title="View Restock Order"
              route="/restockOrder/viewAll"
              onClick={this.hideSidebar}
            />
          </SidebarCategory>
          {salesmarketing && (
            <SidebarCategory title="Reviews" icon="list">
              <SidebarLink
                title="View All"
                route="/review/viewAll"
                onClick={this.hideSidebar}
              />
            </SidebarCategory>
          )}
          <SidebarCategory title="Delivery" icon="list">
            <SidebarLink
              title="View Store Orders"
              route="/delivery/viewAllRestockOrderItem"
              onClick={this.hideSidebar}
            />
            <SidebarLink
              title="View Customer Orders"
              // route="/delivery/viewAllrestockOrderItem"
              // onClick={this.hideSidebar}
            />
            <SidebarLink
              title="View Delivery"
              route="/delivery/viewAllDelivery"
              onClick={this.hideSidebar}
            />
          </SidebarCategory>
          {salesmarketing && (
            <SidebarCategory title="Advertisement" customIcon={<FaAdversal />}>
              <SidebarLink
                title="View Advertisement"
                route="/advertisement/viewAllAdvertisement"
                onClick={this.hideSidebar}
              />
            </SidebarCategory>
          )}
        </ul>
      </div>
    );
  }
}
export default SidebarContent;
