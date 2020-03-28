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
  Delete
} from "@material-ui/icons";
import MaterialTable from "material-table";
import Chip from "@material-ui/core/Chip";
// Redux
import {
  retrieveAllRestockOrder,
  deleteRestockOrder,
  getDeliveryStatusColour
} from "../../../redux/actions/restockOrderAction";
import withPage from "../../Layout/page/withPage";
import { useConfirm } from "material-ui-confirm";
import UpdateRestockOrderDialog from "./UpdateRestockOrderDialog";

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

const RestockOrderTable = props => {
  const dispatch = useDispatch();
  const restockOrders = useSelector(state => state.restockOrder.restockOrders);
  const confirmDialog = useConfirm();

  const [restockOrder, setRestockOrder] = useState({});
  const [open, setOpen] = useState(false);
  const { renderLoader, store, staff } = props;
  const storeId = _.get(store, "storeId", null);
  const warehouse =
    _.get(staff, "department.departmentName", "") === "Warehouse";

  useEffect(() => {
    dispatch(retrieveAllRestockOrder(storeId));
  }, [_.isEqual(restockOrders)]);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  let data = [];
  if (restockOrders) {
    data = restockOrders.map(restockOrder => {
      let {
        inStoreRestockOrderId,
        orderDateTime,
        deliveryDateTime,
        deliveryStatus,
        store,
        inStoreRestockOrderItems
      } = restockOrder;
      inStoreRestockOrderItems = [...inStoreRestockOrderItems];
      orderDateTime = dateformat(new Date(orderDateTime), "dd'-'mmm'-'yyyy");
      deliveryDateTime = deliveryDateTime
        ? dateformat(new Date(deliveryDateTime), "dd'-'mmm'-'yyyy")
        : "";
      const currentDate = new Date(orderDateTime);
      const disableEdit =
        currentDate.setDate(currentDate.getDate() + 1) < new Date();
      const disableDelete = deliveryStatus !== "PROCESSING";
      return {
        inStoreRestockOrderId: inStoreRestockOrderId,
        orderDateTime: orderDateTime,
        deliveryDateTime: deliveryDateTime,
        deliveryStatus: deliveryStatus.split("_").join(" "),
        storeName: store.storeName,
        inStoreRestockOrderItems: inStoreRestockOrderItems,
        numberOfItems: inStoreRestockOrderItems.length,
        disableEdit: disableEdit,
        disableDelete: disableDelete,
        store: store
      };
    });
  }

  return (
    <div className="table" style={{ verticalAlign: "middle" }}>
      {restockOrders ? (
        <MaterialTable
          title="Restock order"
          style={{ boxShadow: "none" }}
          icons={tableIcons}
          columns={[
            { title: "Restock Order ID", field: "inStoreRestockOrderId" },
            { title: "Store name", field: "storeName" },

            {
              title: "Date Created",
              field: "orderDateTime"
            },
            {
              title: "Number of items",
              field: "numberOfItems"
            },
            {
              title: "Completed",
              field: "deliveryDateTime"
            },
            {
              title: "Delivery status",
              field: "deliveryStatus",
              render: ({ deliveryStatus }) => {
                const style = getDeliveryStatusColour(deliveryStatus);
                return (
                  <Chip
                    style={{ ...style, color: "white" }}
                    label={deliveryStatus}
                  />
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
            rowData => ({
              icon: Visibility,
              tooltip: "View details",
              onClick: (e, rowData) => {
                setRestockOrder(rowData);
                openDialog();
              }
            }),
            rowData =>
              warehouse
                ? null
                : {
                    icon: Delete,
                    tooltip: "Delete",
                    onClick: (e, { inStoreRestockOrderId }) => {
                      confirmDialog({
                        description: "Selected restock order will be deleted"
                      })
                        .then(() => {
                          dispatch(
                            deleteRestockOrder(
                              inStoreRestockOrderId,
                              closeDialog,
                              storeId
                            )
                          );
                        })
                        .catch(() => {});
                    },
                    disabled: rowData.disableDelete || rowData.disableEdit
                  }
          ]}
        />
      ) : (
        renderLoader()
      )}
      {open && (
        <UpdateRestockOrderDialog
          {...props}
          open={open}
          onClose={closeDialog}
          element={restockOrder}
          isWarehouse={warehouse}
        />
      )}
    </div>
  );
};

export default withPage(RestockOrderTable);
