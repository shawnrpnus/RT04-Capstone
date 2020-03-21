import React, { Component } from "react";
import * as PropTypes from "prop-types";
import SidebarLink from "./SidebarLink";
import SidebarCategory from "./SidebarCategory";
import { FaAdversal, FaBox } from "react-icons/fa";
import { MdFeedback, MdRateReview, MdLocalShipping } from "react-icons/md";

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
          {hr && (
            <SidebarCategory title="Staff" icon="users">
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

                  <SidebarLink
                    title="Reset Staff Password"
                    route="/staff/resetPassword"
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
              <SidebarCategory title="Promo Code" icon="code">
                {salesmarketing && (
                    <React.Fragment>
                    <SidebarLink
                        title="Create"
                        route="/promoCode/create"
                        onClick={this.hideSidebar}
                    />
                    <SidebarLink
                  title="View All"
                  route="/promoCode/viewAll"
                  onClick={this.hideSidebar}
                  />
                    </React.Fragment>
                )}
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
            <SidebarCategory title="Product Stocks" customIcon={<FaBox />}>
              <SidebarLink
                title="View All"
                FaBox
                route="/productStock/viewAll"
                onClick={this.hideSidebar}
              />
            </SidebarCategory>
          )}

          <SidebarCategory title="Feedback" customIcon={<MdFeedback />}>

            <SidebarLink
              title="View Feedback"
              route="/feedback/viewAll"
              onClick={this.hideSidebar}
            />
          </SidebarCategory>
          <SidebarCategory title="Restock Order" icon="file-add">
            <SidebarLink
              title="View Restock Order"
              route="/restockOrder/viewAll"
              onClick={this.hideSidebar}
            />
          </SidebarCategory>
          {salesmarketing && (

            <SidebarCategory title="Reviews" customIcon={<MdRateReview />}>

              <SidebarLink
                title="View All"
                route="/review/viewAll"
                onClick={this.hideSidebar}
              />
            </SidebarCategory>
          )}

          <SidebarCategory title="Delivery" customIcon={<MdLocalShipping />}>

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
              <SidebarLink
                title="View Instagram"
                route="/advertisement/viewInstagramByHashtag"
                onClick={this.hideSidebar}
              />
              <SidebarLink
                title="Instagram Post Management"
                route="/advertisement/viewAllInstagramPost"
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
