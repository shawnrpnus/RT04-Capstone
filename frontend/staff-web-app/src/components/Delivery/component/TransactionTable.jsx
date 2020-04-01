import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "material-ui-confirm";
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
  LocalShipping
} from "@material-ui/icons";
import MaterialTable from "material-table";
import Chip from "@material-ui/core/Chip";
// Redux
import { getDeliveryStatusColour } from "../../../redux/actions/restockOrderAction";
import { retrieveTransactionToSendForDelivery } from "../../../redux/actions/transactionActions";
import { createDeliveryForTransaction } from "../../../redux/actions/deliveryActions";
import withPage from "../../Layout/page/withPage";

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

const TransactionTable = props => {
  const dispatch = useDispatch();
  const confirmDialog = useConfirm();
  const transactions = useSelector(state => state.transaction.transactions);
  const history = useHistory();
  const { renderLoader, staff } = props;

  useEffect(() => {
    dispatch(retrieveTransactionToSendForDelivery());
  }, [_.isEqual(transactions)]);

  console.log(transactions);

  const handleCreateDelivery = (evt, data) => {
    evt.preventDefault();
    const ids = data.map(e => e.transactionId);
    const request = {
      transactionIds: ids,
      staffId: _.get(staff, "staffId")
    };
    confirmDialog({
      description:
        "A new delivery will be created with the selected transaction"
    })
      .then(() => {
        dispatch(createDeliveryForTransaction(request, history));
      })
      .catch(() => null);
  };

  let data = [];
  if (transactions) {
    data = transactions.map(item => {
      let {
        transactionId,
        orderNumber,
        createdDateTime,
        collectionMode,
        deliveryStatus,
        deliveryAddress,
        transactionLineItems,
        storeToCollect
      } = item;

      let address = deliveryAddress ? deliveryAddress : storeToCollect.address;
      const { line1, line2, postalCode, buildingName } = address;
      address = `${line1},${line2 ? ` ${line2},` : ""} ${postalCode}`;
      const date = dateformat(new Date(createdDateTime), "dd'-'mmm'-'yyyy");

      return {
        transactionId,
        orderNumber,
        createdDateTime: date,
        collectionMode,
        deliveryStatus: deliveryStatus.split("_").join(" "),
        deliveryAddress: address,
        transactionLineItems
      };
    });
  }

  return (
    <div className="table" style={{ verticalAlign: "middle" }}>
      {transactions ? (
        <MaterialTable
          title="Transactions"
          style={{ boxShadow: "none" }}
          icons={tableIcons}
          columns={[
            { title: "Transaction ID", field: "transactionId" },
            {
              title: "Order no.",
              field: "orderNumber"
            },
            { title: "Created date", field: "createdDateTime" },
            {
              title: "Collection mode",
              field: "collectionMode"
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
            },
            {
              title: "Delivery address",
              field: "deliveryAddress"
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
            selection: true,
            draggable: false
          }}
          actions={[
            {
              icon: LocalShipping,
              tooltip: "Create new delivery",
              onClick: (event, rowData) => handleCreateDelivery(event, rowData)
            }
          ]}
        />
      ) : (
        renderLoader()
      )}
    </div>
  );
};

export default withPage(TransactionTable);
