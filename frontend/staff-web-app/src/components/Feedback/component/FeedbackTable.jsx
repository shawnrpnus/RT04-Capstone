import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import MaterialTable from "material-table";
import Chip from "@material-ui/core/Chip";
import ReplyIcon from "@material-ui/icons/Reply";
import CheckSharpIcon from "@material-ui/icons/CheckSharp";
// Redux
import {
  retrieveAllFeedback,
  markAsResolved
} from "../../../redux/actions/feedbackAction";
import withPage from "../../Layout/page/withPage";
import FeedbackReplyDialog from "./FeedbackReplyDialog";

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

const FeedbackTable = () => {
  const dispatch = useDispatch();
  const feedbacks = useSelector(state => state.feedback.feedbacks);

  const [feedback, setFeedback] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(retrieveAllFeedback());
  }, [_.isEqual(feedbacks)]);
  // const customer = useSelector(state => state.customer.loggedInCustomer);

  const toggleOpenDialog = () => {
    setOpen(!open);
  };

  return (
    <div className="table" style={{ verticalAlign: "middle" }}>
      <MaterialTable
        title="Feedback"
        style={{ boxShadow: "none" }}
        icons={tableIcons}
        columns={[
          { title: "Category", field: "contactUsCategory" },
          { title: "First name", field: "firstName" },
          {
            title: "Last Name",
            field: "lastName"
          },
          { title: "Content", field: "content" },
          {
            title: "Status",
            field: "acknowledged",
            render: rowData => {
              let style;
              const { status, contactUsId } = rowData;

              switch (status) {
                case "REPLIED":
                  style = { backgroundColor: "#1975d2" };
                  break;
                case "PENDING_ACTION":
                  style = { backgroundColor: "#feaa4b" };
                  break;
                default:
                  // resolved
                  style = { backgroundColor: "#33ba0a" };
              }
              return (
                <Chip
                  key={contactUsId}
                  style={{ ...style, color: "white" }}
                  label={status}
                />
              );
            }
          }
        ]}
        data={feedbacks}
        options={{
          filtering: true,
          sorting: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 40],
          actionsColumnIndex: -1,
          headerStyle: { textAlign: "center" }, //change header padding
          cellStyle: { textAlign: "center" }
        }}
        actions={[
          rowData => ({
            icon: ReplyIcon,
            tooltip: "Reply",
            onClick: (e, rowData) => {
              setFeedback(rowData);
              toggleOpenDialog();
            },
            disabled: rowData.status === "RESOLVED"
          }),
          rowData => ({
            icon: CheckSharpIcon,
            tooltip: "Mark as resolved",
            onClick: (e, rowData) => {
              const { contactUsId, customerEmail } = rowData;
              dispatch(
                markAsResolved({ contactUsId, customerEmail, reply: null })
              );
            },
            disabled: rowData.status === "RESOLVED"
          })
        ]}
      />
      {open && (
        <FeedbackReplyDialog
          key={feedback.contactUsId}
          open={open}
          onClose={toggleOpenDialog}
          feedback={feedback}
        />
      )}
    </div>
  );
};

export default withPage(FeedbackTable);
