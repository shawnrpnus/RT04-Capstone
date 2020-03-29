import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useConfirm } from "material-ui-confirm";
import MaterialTable from "material-table";
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
  Delete
} from "@material-ui/icons";
import {
  retrieveAllDiscount,
  deleteDiscount
} from "../../../redux/actions/discountActions";
import withPage from "../../Layout/page/withPage";
import dateformat from "dateformat";

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

const DiscountManagementTable = props => {
  const dispatch = useDispatch();
  const confirmDialog = useConfirm();
  const history = useHistory();
  const discounts = useSelector(state => state.discount.discounts);

  useEffect(() => {
    dispatch(retrieveAllDiscount());
  }, []);

  const handleDeleteDiscount = discountId => {
    confirmDialog({ description: "The selected discount will be deleted." })
      .then(() => dispatch(deleteDiscount(discountId)))
      .catch(() => null);
  };

  const handleUpdateDiscount = discountId => {
    history.push(`/discount/discountForm/${discountId}`);
  };

  const { renderLoader } = props;

  let data = [];
  if (discounts) {
    data = discounts.map(
      ({
        discountId,
        discountName,
        fromDateTime,
        toDateTime,
        flatDiscount,
        percentageDiscount
      }) => {
        return {
          discountId,
          discountName,
          fromDateTime: dateformat(new Date(fromDateTime), "dd'-'mmm'-'yyyy"),
          toDateTime: dateformat(new Date(toDateTime), "dd'-'mmm'-'yyyy"),
          flatDiscount,
          percentageDiscount: `${Number(percentageDiscount) * 100}%`
        };
      }
    );
  }

  return (
    <div className="table" style={{ verticalAlign: "middle" }}>
      {discounts ? (
        <MaterialTable
          title="Discount Management"
          style={{ boxShadow: "none" }}
          icons={tableIcons}
          columns={[
            { title: "Discount ID", field: "discountId" },
            { title: "Discount Name", field: "discountName" },
            {
              title: "Start",
              field: "fromDateTime"
            },
            {
              title: "End",
              field: "toDateTime"
            },
            {
              title: "Flat rate",
              field: "flatDiscount",
              type: "currency",
              emptyValue: "NA"
            },
            {
              title: "Percentage",
              field: "percentageDiscount",
              render: ({ percentageDiscount }) =>
                percentageDiscount === "0%" ? "NA" : percentageDiscount
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
              icon: Edit,
              tooltip: "Update discount",
              onClick: (event, { discountId }) =>
                handleUpdateDiscount(discountId)
            },
            {
              icon: Delete,
              tooltip: "Delete discount",
              onClick: (event, { discountId }) =>
                handleDeleteDiscount(discountId)
            }
          ]}
        />
      ) : (
        renderLoader()
      )}
    </div>
  );
};

export default withPage(DiscountManagementTable, "Discount Management");
