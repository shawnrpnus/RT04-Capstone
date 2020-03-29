import React, { useEffect, useState } from "react";
import {
  deleteReview,
  retrieveAllReviews,
  deleteReviewResponse
} from "../../../redux/actions/reviewActions";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "material-ui-confirm";
import dateformat from "dateformat";
import MaterialTable from "material-table";
import {
  AddBox,
  Backspace,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  Delete,
  DeleteOutline,
  Edit,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  Reply,
  Visibility
} from "@material-ui/icons";
import withPage from "../../Layout/page/withPage";
import ReviewResponseDialog from "./ReviewResponseDialog";

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

const ReviewTable = props => {
  const dispatch = useDispatch();
  const confirmDialog = useConfirm();
  const allReviews = useSelector(state => state.reviewEntity.allReviews);

  const [open, setOpen] = useState(false);
  const [review, setReview] = useState({});
  const [view, setView] = useState(false);

  useEffect(() => {
    dispatch(retrieveAllReviews());
  }, []);

  const handleDeleteReview = reviewId => {
    confirmDialog({
      description: "Review will be deleted permanently"
    }).then(() => dispatch(deleteReview(reviewId)));
  };

  const handleDeleteReviewResponse = reviewId => {
    confirmDialog({
      description: "Response to review will be removed"
    }).then(() => dispatch(deleteReviewResponse(reviewId)));
  };

  console.log(allReviews);

  const onClose = () => {
    setOpen(false);
  };

  let data = [];
  if (allReviews) {
    data = allReviews.map(
      ({
        reviewId,
        product,
        rating,
        response,
        customer,
        createdDateTime,
        content
      }) => {
        return {
          reviewId,
          productName: product.productName,
          rating,
          response,
          customer,
          createdDateTime: dateformat(
            new Date(createdDateTime),
            "dd'-'mmm'-'yyyy"
          ),
          content
        };
      }
    );
  }

  const { renderLoader } = props;

  return (
    <>
      <div
        className="table"
        style={{
          width: "auto",
          verticalAlign: "middle"
        }}
      >
        {allReviews ? (
          <MaterialTable
            title="Reviews"
            style={{ boxShadow: "none" }}
            icons={tableIcons}
            columns={[
              { title: "Review ID", field: "reviewId" },
              { title: "Product", field: "productName" },
              { title: "Rating", field: "rating" },
              { title: "Content", field: "content" },
              { title: "Response", field: "response" },
              { title: "Created date time", field: "createdDateTime" }
            ]}
            actions={[
              rowData =>
                rowData.response
                  ? {
                      icon: Visibility,
                      tooltip: "View response",
                      onClick: (e, rowData) => {
                        setReview(rowData);
                        setOpen(true);
                        setView(true);
                      }
                    }
                  : {
                      icon: Reply,
                      tooltip: "Reply",
                      onClick: (e, rowData) => {
                        setReview(rowData);
                        setOpen(true);
                        setView(false);
                      }
                    },
              rowData => ({
                icon: Backspace,
                tooltip: "Remove response",
                onClick: (event, { reviewId }) =>
                  handleDeleteReviewResponse(reviewId),
                disabled: !rowData.response
              }),
              {
                icon: Delete,
                tooltip: "Delete Review",
                onClick: (event, { reviewId }) => handleDeleteReview(reviewId)
              }
            ]}
            data={data}
            options={{
              filtering: true,
              sorting: true,
              pageSize: 10,
              search: true,
              padding: "dense",
              showTitle: true,
              pageSizeOptions: [5, 10, 15],
              actionsColumnIndex: -1,
              headerStyle: { textAlign: "center" },
              cellStyle: { textAlign: "center" },
              draggable: false
            }}
          />
        ) : (
          renderLoader()
        )}
      </div>
      {open && (
        <ReviewResponseDialog
          review={review}
          view={view}
          open={open}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default withPage(ReviewTable, "Reviews Management");
