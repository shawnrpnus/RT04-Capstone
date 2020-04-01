import React, { useEffect, useState } from "react";
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
  Visibility
} from "@material-ui/icons";
import MaterialTable from "material-table";
import Chip from "@material-ui/core/Chip";
// Redux
import { getDeliveryStatusColour } from "../../../redux/actions/restockOrderAction";
import { retrieveAllTransaction } from "../../../redux/actions/transactionActions";
import withPage from "../../Layout/page/withPage";
import TransactionDetailsDialog from "./../../Transaction/components/TransactionDetailsDialog";

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
  const [open, setOpen] = useState(false);
  const [transactionIndex, setTransactionIndex] = useState("");

  useEffect(() => {
    dispatch(retrieveAllTransaction());
  }, [_.isEqual(transactions)]);

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
            draggable: false
          }}
          actions={[
            {
              icon: Visibility,
              tooltip: "View transaction details",
              onClick: (event, rowData) => {
                setTransactionIndex(rowData.tableData.id);
                setOpen(true);
              }
            }
          ]}
        />
      ) : (
        renderLoader()
      )}
      {open && (
        <TransactionDetailsDialog
          open={open}
          onClose={() => setOpen(false)}
          transaction={transactions[transactionIndex]}
        />
      )}
    </div>
  );
};

export default withPage(TransactionTable);
