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
  Visibility
} from "@material-ui/icons";
import MaterialTable from "material-table";
import Chip from "@material-ui/core/Chip";
// Redux
import { getDeliveryStatusColour } from "../../../redux/actions/restockOrderAction";
import { retrieveAllDelivery } from "../../../redux/actions/deliveryActions";
import withPage from "../../Layout/page/withPage";
import OrderDetailsDialog from "./OrderDetailsDialog";

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
  const [orderDetails, setOrderDetails] = useState([]);
  const { renderLoader } = props;

  useEffect(() => {
    dispatch(retrieveAllDelivery());
  }, [_.isEqual(deliveries)]);

  const openOrderDetailsDialog = (
    e,
    { customerOrdersToDeliver, inStoreRestockOrderItems }
  ) => {
    if (customerOrdersToDeliver.length > 0) {
      setOrderDetails(customerOrdersToDeliver);
      setOpenCustomerOrderDialog(true);
    } else if (inStoreRestockOrderItems.length > 0) {
      setOrderDetails(inStoreRestockOrderItems);
      setOpenRestockOrderDialog(true);
    }
  };

  const closeOrderDetailsDialog = () => {
    setOpenCustomerOrderDialog(false);
    setOpenRestockOrderDialog(false);
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

      if (deliveryDateTime)
        deliveryDateTime = dateformat(
          new Date(deliveryDateTime),
          "dd'-'mmm'-'yyyy"
        );
      const { firstName, lastName } = deliveryStaff;
      const status = inStoreRestockOrderItems.some(
        e => e.itemDeliveryStatus !== "DELIVERED"
      )
        ? "TO DELIVER"
        : "COMPLETED";
      const name = `${firstName} ${lastName}`;
      return {
        deliveryId: deliveryId,
        deliveryDateTime: deliveryDateTime,
        deliveryStaff: deliveryStaff,
        deliveryStaffName: name,
        customerOrdersToDeliver: customerOrdersToDeliver,
        inStoreRestockOrderItems: inStoreRestockOrderItems,
        status: status.split("_").join(" ")
      };
    });
  }

  return (
    <div className="table" style={{ verticalAlign: "middle" }}>
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
              tooltip: "View order details",
              onClick: (event, rowData) =>
                openOrderDetailsDialog(event, rowData)
            }
          ]}
        />
      ) : (
        renderLoader()
      )}
      {openRestockOrderDialog && (
        <OrderDetailsDialog
          {...props}
          open={openRestockOrderDialog}
          onClose={closeOrderDetailsDialog}
          elements={orderDetails}
        />
      )}
    </div>
  );
};

export default withPage(DeliveryTable);
