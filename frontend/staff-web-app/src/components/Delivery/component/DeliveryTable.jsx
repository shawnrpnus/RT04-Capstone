import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dateformat from "dateformat";
import {
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
  Visibility,
  Room
} from "@material-ui/icons";
import { AiOutlineTransaction } from "react-icons/ai";
import MaterialTable from "material-table";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
// Redux
import { getDeliveryStatusColour } from "../../../redux/actions/restockOrderAction";
import {
  retrieveAllDelivery,
  generateDeliveryRoute
} from "../../../redux/actions/deliveryActions";
import withPage from "../../Layout/page/withPage";
import RestockOrderDetailsDialog from "./RestockOrderDetailsDialog";
import TransactionDetailsDialog from "./TransactionDetailsDialog";
import StaffSelectionDialog from "./StaffSelectionDialog";

const _ = require("lodash");
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

const DeliveryTable = props => {
  const dispatch = useDispatch();
  const deliveries = useSelector(state => state.delivery.deliveries);

  const [openCustomerOrderDialog, setOpenCustomerOrderDialog] = useState(false);
  const [openRestockOrderDialog, setOpenRestockOrderDialog] = useState(false);
  const [openStaffSelectionDialog, setOpenStaffSelectionDialog] = useState(
    false
  );
  const [orderDetails, setOrderDetails] = useState([]);
  const { renderLoader, staff } = props;

  useEffect(() => {
    dispatch(retrieveAllDelivery());
  }, [_.isEqual(deliveries)]);

  const openOrderDetailsDialog = (
    e,
    { customerOrdersToDeliver, inStoreRestockOrderItems },
    transaction
  ) => {
    if (transaction) {
      console.log("customer orders");
      setOrderDetails(customerOrdersToDeliver);
      setOpenCustomerOrderDialog(true);
    } else {
      // if (inStoreRestockOrderItems.length > 0)
      console.log("restock orders");
      setOrderDetails(inStoreRestockOrderItems);
      setOpenRestockOrderDialog(true);
    }
  };

  const closeOrderDetailsDialog = () => {
    setOpenCustomerOrderDialog(false);
    setOpenRestockOrderDialog(false);
  };

  const handleOpenStaffSelectionDialog = () => {
    setOpenStaffSelectionDialog(true);
  };

  let data = [];
  if (deliveries) {
    data = deliveries.map(item => {
      let {
        deliveryId,
        deliveryDateTime,
        deliveryStaff,
        customerOrdersToDeliver,
        inStoreRestockOrderItems
      } = item;
      let date = deliveryDateTime;
      if (deliveryDateTime)
        date = dateformat(new Date(deliveryDateTime), "dd'-'mmm'-'yyyy");
      const { firstName, lastName } = deliveryStaff;
      const status =
        inStoreRestockOrderItems.some(
          e => e.itemDeliveryStatus !== "DELIVERED"
        ) ||
        customerOrdersToDeliver.some(
          ({ deliveryStatus }) =>
            !(
              deliveryStatus === "READY_FOR_COLLECTION" ||
              deliveryStatus === "DELIVERED"
            )
        )
          ? "TO DELIVER"
          : "COMPLETED";
      const name = `${firstName} ${lastName}`;
      return {
        deliveryId: deliveryId,
        deliveryDateTime: date,
        deliveryStaff: deliveryStaff,
        deliveryStaffName: name,
        customerOrdersToDeliver: customerOrdersToDeliver,
        inStoreRestockOrderItems: inStoreRestockOrderItems,
        status: status.split("_").join(" ")
      };
    });
  }

  console.log(deliveries);

  return (
    <div
      className="table"
      style={{ verticalAlign: "middle", textAlign: "right" }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenStaffSelectionDialog}
        style={{ marginRight: "1%" }}
      >
        Create and allocate delivery
      </Button>
      {deliveries ? (
        <MaterialTable
          title="Delivery Management"
          style={{ boxShadow: "none" }}
          icons={tableIcons}
          columns={[
            { title: "Delivery ID", field: "deliveryId" },
            {
              title: "Date created",
              field: "deliveryDateTime"
            },
            {
              title: "Delivery staff",
              field: "deliveryStaffName"
            },
            {
              title: "Status",
              field: "status",
              render: ({ status }) => {
                const style = getDeliveryStatusColour(status);
                return (
                  <Chip style={{ ...style, color: "white" }} label={status} />
                );
              }
            }
          ]}
          data={data}
          options={{
            filtering: true,
            sorting: true,
            pageSize: 10,
            pageSizeOptions: [10, 20, 40],
            actionsColumnIndex: -1,
            headerStyle: { textAlign: "center" }, //change header padding
            cellStyle: { textAlign: "center" },
            draggable: false
          }}
          actions={[
            {
              icon: Visibility,
              tooltip: "View restock order details",
              onClick: (event, rowData) =>
                openOrderDetailsDialog(event, rowData)
            },
            {
              icon: AiOutlineTransaction,
              tooltip: "View transactions",
              onClick: (event, rowData) =>
                openOrderDetailsDialog(event, rowData, true)
            },
            {
              icon: Room,
              tooltip: "Generate delivery route",
              onClick: (event, rowData) =>
                dispatch(generateDeliveryRoute(rowData.deliveryId))
            }
          ]}
        />
      ) : (
        renderLoader()
      )}
      {openRestockOrderDialog && (
        <RestockOrderDetailsDialog
          {...props}
          open={openRestockOrderDialog}
          onClose={closeOrderDetailsDialog}
          elements={orderDetails}
        />
      )}
      {openCustomerOrderDialog && (
        <TransactionDetailsDialog
          {...props}
          open={openCustomerOrderDialog}
          onClose={closeOrderDetailsDialog}
          elements={orderDetails}
        />
      )}
      {openStaffSelectionDialog && (
        <StaffSelectionDialog
          open={openStaffSelectionDialog}
          onClose={() => setOpenStaffSelectionDialog(false)}
        />
      )}
    </div>
  );
};

export default withPage(DeliveryTable);
