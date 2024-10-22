import React, { Component } from "react";
import * as PropTypes from "prop-types";
import SidebarLink from "./SidebarLink";
import SidebarCategory from "./SidebarCategory";
import {
  FaAdversal,
  FaBox,
  FaTshirt,
  FaTags,
  FaBarcode,
  FaList,
  FaFileInvoice,
  FaMoneyBillAlt,
  FaStaylinked,
  FaLeaf,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import {
  MdFeedback,
  MdRateReview,
  MdLocalShipping,
  MdPayment,
  MdPeople,
  MdStore,
} from "react-icons/md";
import { DiGoogleAnalytics } from "react-icons/all";

import { TiSocialInstagram } from "react-icons/ti";
import { IoMdPricetags } from "react-icons/io";

const _ = require("lodash");

class SidebarContent extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    const department = _.get(this.props.staff, "department.departmentName");
    const role = _.get(this.props.staff, "role.roleName");
    const hr = department === "HR";
    const salesmarketing = department === "Sales and Marketing";
    const store = department === "Store";
    const warehouse = department === "Warehouse";
    const delivery = department === "Delivery";
    const customerService = department === "Customer Service";
    const manager = role === "MANAGER";
    const assistant = role === "ASSISTANT";

    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          {hr && (
            <SidebarCategory title="Staff" customIcon={<MdPeople />}>
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

                  <SidebarLink
                    title="Manage Roster"
                    route="/staff/reassignStaffToStore"
                    onClick={this.hideSidebar}
                  />
                </React.Fragment>
              )}
            </SidebarCategory>
          )}

          {(hr || manager) && (
            <SidebarCategory title="Leave" customIcon={<FaLeaf />}>
              {hr && (
                <React.Fragment>
                  <SidebarLink
                    title="Leave Management"
                    route="/leave/hr"
                    onClick={this.hideSidebar}
                  />
                </React.Fragment>
              )}

              {manager && (
                <SidebarLink
                  title="Leave Management"
                  route="/leave/manager"
                  onClick={this.hideSidebar}
                />
              )}
            </SidebarCategory>
          )}
          {hr && (
            <SidebarCategory title="Payroll" customIcon={<FaMoneyCheckAlt />}>
              {hr && (
                <React.Fragment>
                  <SidebarLink
                    title="Create"
                    route="/payrolls/createPayrolls"
                    onClick={this.hideSidebar}
                  />

                  <SidebarLink
                    title="View All"
                    route="/payrolls/viewAllHR"
                    onClick={this.hideSidebar}
                  />
                </React.Fragment>
              )}
            </SidebarCategory>
          )}
          {warehouse && (
            <SidebarCategory title="Stores" customIcon={<MdStore />}>
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
            <SidebarCategory title="Products" customIcon={<FaTshirt />}>
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
            <SidebarCategory title="Tag" customIcon={<FaTags />}>
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
            <SidebarCategory title="Style" customIcon={<FaStaylinked />}>
              {salesmarketing && (
                <SidebarLink
                  title="Create Style"
                  route="/style/manage"
                  onClick={this.hideSidebar}
                />
              )}
              <SidebarLink
                title={salesmarketing ? "Manage" : "View"}
                route="/style/addStyleToProducts"
                onClick={this.hideSidebar}
              />
              {salesmarketing && (
              <SidebarLink
                  title="Style Quiz"
                  route="/style/manageStyleQuiz"
                  onClick={this.hideSidebar}
              />
              )}
            </SidebarCategory>
          )}
          {salesmarketing && (
            <SidebarCategory title="Promo Code" customIcon={<FaBarcode />}>
              <SidebarLink
                title="Create Promo Code"
                route="/promoCode/create"
                onClick={this.hideSidebar}
              />
              <SidebarLink
                title="View All"
                route="/promoCode/viewAll"
                onClick={this.hideSidebar}
              />
            </SidebarCategory>
          )}
          {(salesmarketing || store || warehouse) && (
            <SidebarCategory title="Discount" customIcon={<IoMdPricetags />}>
              {salesmarketing && (
                <>
                  <SidebarLink
                    title="Create Discount"
                    route="/discount/discountForm"
                    onClick={this.hideSidebar}
                  />
                  <SidebarLink
                    title="View All Discounts"
                    route="/discount/viewAllDiscounts"
                    onClick={this.hideSidebar}
                  />
                </>
              )}
              <SidebarLink
                title={salesmarketing ? "Manage Products" : "View Products"}
                route="/discount/associateProducts"
                onClick={this.hideSidebar}
              />
            </SidebarCategory>
          )}
          {(salesmarketing || store || warehouse) && (
            <SidebarCategory title="Category" customIcon={<FaList />}>
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
          {(store || warehouse) && (
            <SidebarCategory title="Refund" customIcon={<MdPayment />}>
              {store && <SidebarLink
                title="Create Refund"
                route="/refund/createRefundRecord"
                onClick={this.hideSidebar}
              />}
              <SidebarLink
                title="View All Refunds"
                route="/refund/viewAllRefunds"
                onClick={this.hideSidebar}
              />
              <SidebarLink
                title="Scan Refund QR Code"
                route="/refund/scanQrCode"
                onClick={this.hideSidebar}
              />
            </SidebarCategory>
          )}
          {customerService && (
            <>
              <SidebarCategory title="Feedback" customIcon={<MdFeedback />}>
                <SidebarLink
                  title="View Feedback"
                  route="/feedback/viewAll"
                  onClick={this.hideSidebar}
                />
              </SidebarCategory>
              <SidebarCategory title="Reviews" customIcon={<MdRateReview />}>
                <SidebarLink
                  title="View All"
                  route="/review/viewAll"
                  onClick={this.hideSidebar}
                />
              </SidebarCategory>
            </>
          )}
          {(store || warehouse) && (
            <SidebarCategory
              title="Restock Order"
              customIcon={<FaFileInvoice />}
            >
              <SidebarLink
                title="View Restock Order"
                route="/restockOrder/viewAll"
                onClick={this.hideSidebar}
              />
            </SidebarCategory>
          )}
          {delivery && manager && (
            <SidebarCategory title="Delivery" customIcon={<MdLocalShipping />}>
              <>
                <SidebarLink
                  title="View Store Orders"
                  route="/delivery/viewAllRestockOrderItem"
                  onClick={this.hideSidebar}
                />
                <SidebarLink
                  title="View Customer Orders"
                  route="/delivery/viewAllTransaction"
                  onClick={this.hideSidebar}
                />
                <SidebarLink
                  title="View Delivery"
                  route="/delivery/viewAllDelivery"
                  onClick={this.hideSidebar}
                />
              </>
            </SidebarCategory>
          )}
          {salesmarketing && (
            <>
              <SidebarCategory
                title="Advertisement"
                customIcon={<FaAdversal />}
              >
                <SidebarLink
                  title="View Advertisement"
                  route="/advertisement/viewAllAdvertisement"
                  onClick={this.hideSidebar}
                />
              </SidebarCategory>
              <SidebarCategory
                title="Instagram"
                customIcon={<TiSocialInstagram />}
              >
                <SidebarLink
                  title="View Instagram"
                  route="/instagram/viewInstagramByHashtag"
                  onClick={this.hideSidebar}
                />
                <SidebarLink
                  title="Instagram Post Management"
                  route="/instagram/viewAllInstagramPost"
                  onClick={this.hideSidebar}
                />
              </SidebarCategory>
            </>
          )}
          {(salesmarketing || store || warehouse) && (
            <SidebarCategory
              title="Transaction"
              customIcon={<FaMoneyBillAlt />}
            >
              <SidebarLink
                title="View transaction"
                route="/transaction/viewAll"
                onClick={this.hideSidebar}
              />
              {store && (
                <SidebarLink
                  title="View details"
                  route="/transaction/viewOne"
                  onClick={this.hideSidebar}
                />
              )}
            </SidebarCategory>
          )}
          {salesmarketing && (
            <SidebarCategory
              title="Analytics"
              customIcon={<DiGoogleAnalytics />}
            >
              <SidebarLink
                title="Sales"
                route="/analytics/sales"
                onClick={this.hideSidebar}
              />
              <SidebarLink
                title={"Reservations"}
                route="/analytics/reservations"
                onCLick={this.hideSidebar}
              />
              <SidebarLink
                title={"Category"}
                route="/analytics/category"
                onCLick={this.hideSidebar}
              />
            </SidebarCategory>
          )}
        </ul>
      </div>
    );
  }
}
export default SidebarContent;
