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
  LocalShipping,
} from "@material-ui/icons";
import MaterialTable from "material-table";
import Chip from "@material-ui/core/Chip";
// Redux
import { getDeliveryStatusColour } from "../../../redux/actions/restockOrderAction";
import { retrieveAllRestockOrderItemToDeliver } from "../../../redux/actions/deliveryActions";
import withPage from "../../Layout/page/withPage";
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
  ViewColumn: ViewColumn,
};

const RestockOrderItemTable = (props) => {
  const dispatch = useDispatch();
  const restockOrderItems = useSelector(
    (state) => state.delivery.restockOrderItems
  );
  const { renderLoader } = props;
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState("");

  useEffect(() => {
    dispatch(retrieveAllRestockOrderItemToDeliver());
  }, [_.isEqual(restockOrderItems)]);

  const handleCreateDelivery = (evt, data) => {
    evt.preventDefault();
    const ids = data.map((e) => e.inStoreRestockOrderItemId);
    setRequest({ inStoreRestockOrderItemIds: ids });
    setOpen(true);
  };

  let data = [];
  if (restockOrderItems) {
    data = restockOrderItems.map((item) => {
      let {
        inStoreRestockOrderItemId,
        itemDeliveryStatus,
        quantity,
        productStock,
        inStoreRestockOrder,
      } = item;

      const orderDateTime = _.get(inStoreRestockOrder, "orderDateTime", "");
      const date = dateformat(new Date(orderDateTime), "dd'-'mmm'-'yyyy");

      return {
        inStoreRestockOrderItemId: inStoreRestockOrderItemId,
        orderDateTime: date,
        itemDeliveryStatus: itemDeliveryStatus.split("_").join(" "),
        quantity: quantity,
        inStoreRestockOrderId: _.get(
          inStoreRestockOrder,
          "inStoreRestockOrderId",
          ""
        ),
        image: _.get(
          productStock,
          "productVariant.productImages[0].productImageUrl",
          ""
        ),
        storeName: _.get(productStock, "store.storeName", ""),
      };
    });
  }

  return (
    <div className="table" style={{ verticalAlign: "middle" }}>
      {restockOrderItems ? (
        <MaterialTable
          title="Restock Order Items"
          style={{ boxShadow: "none" }}
          icons={tableIcons}
          columns={[
            { title: "Item ID", field: "inStoreRestockOrderItemId" },
            {
              title: "Image",
              field: "image",
              render: (rowData) => (
                <img
                  style={{
                    width: "50%",
                    borderRadius: "10%",
                  }}
                  src={rowData.image}
                />
              ),
            },
            { title: "Order date", field: "orderDateTime" },
            {
              title: "Quantity",
              field: "quantity",
            },
            {
              title: "Store",
              field: "storeName",
            },
            {
              title: "Item delivery status",
              field: "itemDeliveryStatus",
              render: ({ itemDeliveryStatus }) => {
                const style = getDeliveryStatusColour(itemDeliveryStatus);
                return (
                  <Chip
                    style={{ ...style, color: "white" }}
                    label={itemDeliveryStatus}
                  />
                );
              },
            },
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
            selection: true,
            draggable: false,
          }}
          actions={[
            {
              icon: LocalShipping,
              tooltip: "Create new delivery",
              onClick: (event, rowData) => handleCreateDelivery(event, rowData),
            },
          ]}
        />
      ) : (
        renderLoader()
      )}
      <StaffSelectionDialog
        open={open}
        onClose={() => setOpen(false)}
        instoreRestockOrderItem={true}
        request={request}
      />
    </div>
  );
};

export default withPage(RestockOrderItemTable);
