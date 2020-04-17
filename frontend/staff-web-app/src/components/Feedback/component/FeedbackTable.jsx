import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  Delete,
  Visibility,
} from "@material-ui/icons";
import MaterialTable from "material-table";
import Chip from "@material-ui/core/Chip";
import CheckSharpIcon from "@material-ui/icons/CheckSharp";
// Redux
import {
  retrieveAllFeedback,
  markAsResolved,
  deleteFeedback,
} from "../../../redux/actions/feedbackActions";
import withPage from "../../Layout/page/withPage";
import FeedbackReplyDialog from "./FeedbackReplyDialog";
import { useConfirm } from "material-ui-confirm";

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

const FeedbackTable = () => {
  const dispatch = useDispatch();
  const feedbacks = useSelector((state) => state.feedback.feedbacks);
  const confirmDialog = useConfirm();

  const [feedbackIndex, setFeedbackIndex] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(retrieveAllFeedback());
  }, [_.isEqual(feedbacks)]);

  const toggleOpenDialog = () => {
    setOpen(!open);
  };

  let data = [];
  if (feedbacks) {
    data = feedbacks.map(
      ({ firstName, lastName, contactUsCategory, status, contactUsId }) => {
        return {
          contactUsId,
          firstName,
          lastName,
          contactUsCategory,
          status: status.split("_").join(" "),
        };
      }
    );
  }

  return (
    <div className="table" style={{ verticalAlign: "middle" }}>
      <MaterialTable
        title="Feedback"
        style={{ boxShadow: "none" }}
        icons={tableIcons}
        columns={[
          { title: "Category", field: "contactUsCategory", filtering: false },
          { title: "First name", field: "firstName", filtering: false },
          { title: "Last Name", field: "lastName", filtering: false },
          {
            title: "Status",
            field: "status",
            render: (rowData) => {
              let style;
              const { status, contactUsId } = rowData;

              switch (status) {
                case "REPLIED":
                  style = { backgroundColor: "#1975d2" };
                  break;
                case "PENDING ACTION":
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
        }}
        actions={[
          (rowData) => ({
            icon: Visibility,
            tooltip: "View and reply",
            onClick: (e, rowData) => {
              setFeedbackIndex(rowData.tableData.id);
              toggleOpenDialog();
            },
          }),
          (rowData) => ({
            icon: CheckSharpIcon,
            tooltip: "Mark as resolved",
            onClick: (e, rowData) => {
              const { contactUsId } = rowData;
              dispatch(markAsResolved({ contactUsId, reply: null }));
            },
            disabled: rowData.status === "RESOLVED",
          }),
          (rowData) => ({
            icon: Delete,
            tooltip: "Delete",
            onClick: (e, rowData) => {
              const { contactUsId } = rowData;
              confirmDialog({
                description: "Selected feedback will be deleted",
              }).then(() => {
                dispatch(deleteFeedback(contactUsId));
              });
            },
          }),
        ]}
      />
      {open && (
        <FeedbackReplyDialog
          // key={feedback.contactUsId}
          open={open}
          onClose={toggleOpenDialog}
          feedback={feedbacks[feedbackIndex]}
        />
      )}
    </div>
  );
};

export default withPage(FeedbackTable);
