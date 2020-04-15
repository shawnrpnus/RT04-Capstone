import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { retrieveAllRefundsByParameter} from "../../redux/actions/refundAction";
import withPage from "../Layout/page/withPage";
import MaterialTable from "material-table";
import {
  Add,
  AddBox,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  Visibility
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import Chip from "@material-ui/core/Chip";

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: Search,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: () => <div />,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};
const _ = require("lodash");

const ViewAllRefundRecords = props => {
  // const classes = useStyles();
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  const history = useHistory();

  const { renderLoader, store, staff } = props;

  const warehouse =
    _.get(staff, "department.departmentName", "") === "Warehouse";

  useEffect(() => {
    if (warehouse) {
      dispatch(retrieveAllRefundsByParameter());
    } else if (_.get(store, "storeId", false)) {
      dispatch(retrieveAllRefundsByParameter(store.storeId));
    }
  }, []);

  // useEffect(() => {
  //   if (warehouse) {
  //     dispatch(retrieveProductStocksByParameter());
  //   } else if (_.get(store, "storeId", false)) {
  //     dispatch(retrieveProductStocksByParameter(store.storeId));
  //   }
  // }, [_.isEqual(productStocks)]);


  const allRefunds = useSelector(state => state.refund.allRefunds);

  const handleViewDetails = (event, rowData) => {
    const refundId = rowData.refundId;
    history.push(`/refund/viewRefundRecord/${refundId}`);
  };

  const checkDisabled = rowData => {
    let lineItems = rowData.refundLineItems;
    for (let i = 0; i < lineItems.length; i++) {
      let length = lineItems[i].refundLineItemHandlerList.length - 1;
      if (
        lineItems[i].refundLineItemHandlerList[length].refundProgressEnum ===
          "PENDING_DELIVERY" ||
        lineItems[i].refundLineItemHandlerList[length].refundProgressEnum ===
          "RECEIVED_BY_STORE" ||
        lineItems[i].refundLineItemHandlerList[length].refundProgressEnum ===
          "HANDLED_BY_STAFF"
      ) {
        return false;
      }
    }
    return true;
  };

  const updateDetails = (event, rowData) => {
    const refundId = rowData.refundId;
    history.push(`/refund/updateRefundRecord/${refundId}`);
  };

  return (
    <div>
      {allRefunds ? (
        <MaterialTable
          title="All Refunds"
          style={{ boxShadow: "none" }}
          icons={tableIcons}
          columns={[
            {
              title: "Refund No.",
              field: "refundNumber"
            },
            {
              title: "Customer",
              field: "customer.firstName"
            },
            {
              title: "Email",
              field: "customer.email"
            },
            {
              title: "Quantity",
              field: "quantity"
            },
            {
              title: "Refund Amount",
              field: "refundAmount"
            },
            {
              title: "Refund Progress",
              field: "refundProgress",
              render: rowData => {
                const progress = rowData.refundStatus;
                let valWords = "";
                let style = { backgroundColor: "#f65a5a" };
                switch (progress) {
                  case "PENDING":
                    style = { backgroundColor: "#19d2d2" };
                    valWords = "Pending";
                    break;
                  case "PROCESSING":
                    style = { backgroundColor: "#66a8a6" };
                    valWords = "Processing";
                    break;
                  case "PARTIALLY_COMPLETE":
                    style = { backgroundColor: "#008b8b" };
                    valWords = "Partially Complete";
                    break;
                  case "COMPLETED":
                    style = { backgroundColor: "#33ba0a" };
                    valWords = "Completed";
                    break;
                  case "COMPLETED_WITH_REJECTED_PRODUCTS":
                    style = { backgroundColor: "#33ba0a" };
                    valWords = "Completed with rejected products";
                    break;
                  case "REJECTED":
                    style = { backgroundColor: "#e1282d" };
                    valWords = "Rejected";
                    break;
                  default:
                    style = { backgroundColor: "#33ba0a" };
                }
                return (
                  <Chip style={{ ...style, color: "white" }} label={valWords} />
                );
              }
            }
          ]}
          data={allRefunds}
          options={{
            filtering: true,
            sorting: true,
            pageSize: 5,
            pageSizeOptions: [5, 10, 20],
            actionsColumnIndex: -1,
            headerStyle: { textAlign: "center" }, //change header padding
            cellStyle: { textAlign: "center" }
          }}
          actions={[
            {
              icon: Visibility,
              tooltip: "View Refund Details",
              onClick: (event, rowData) => handleViewDetails(event, rowData)
            },
            rowData => ({
              icon: Edit,
              tooltip: "Update Refund Details",
              onClick: (event, rowData) => updateDetails(event, rowData),
              disabled: checkDisabled(rowData)
            })
          ]}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default withPage(ViewAllRefundRecords);
