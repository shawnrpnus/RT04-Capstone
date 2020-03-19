import React, { PureComponent, useEffect, useState } from "react";
import {
  deleteReview,
  retrieveAllReviews,
  retrieveReviewsByProductId
} from "../../../redux/actions/reviewActions";
import { connect } from "react-redux";
import MaterialTable from "material-table";
import {
  Add,
  AddBox,
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
  Visibility
} from "@material-ui/icons";
import withPage from "../../Layout/page/withPage";
import { withRouter } from "react-router-dom";

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

class ReviewTable extends PureComponent {
  componentDidMount() {
    //console.log(this.props.retrieveAllReviews);
    this.props.retrieveAllReviews();
  }

  handleDelete = reviewId => {
    this.props
      .confirmDialog({ description: "Review will be deleted permanently" })
      .then(() => this.props.deleteReview(reviewId, this.props.history));
  };

  render() {
    const { history, allReviews, renderLoader } = this.props;

    console.log(allReviews);

    let data = [];
    if (allReviews) {
      data = allReviews.map(review => {
        return {
          reviewId: review.reviewId,
          product: review.product.productName,
          rating: review.rating,
          response: review.response,
          customer: review.customer.customerName,
          createdDateTime: review.createdDateTime
        };
      });
    }

    return (
      <React.Fragment>
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
                { title: "Product", field: "product" },
                { title: "Rating", field: "rating" },
                { title: "Response", field: "response" },
                { title: "Customer", field: "customer" },
                { title: "Created date time", field: "createdDateTime" }
              ]}
              actions={[
                {
                  icon: Delete,
                  tooltip: "Delete Review",
                  onClick: (event, rowData) =>
                    this.handleDelete(rowData.reviewId)
                }
              ]}
              data={data}
              options={{
                filtering: true,
                sorting: true,
                pageSize: 5,
                search: true,
                padding: "dense",
                showTitle: true,
                pageSizeOptions: [5, 10, 15],
                actionsColumnIndex: -1,
                headerStyle: { textAlign: "center" },
                cellStyle: { textAlign: "center" }
              }}
            />
          ) : (
            renderLoader()
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  allReviews: state.reviewEntity.allReviews,
  errors: state.errors
});

const mapDispatchToProps = {
  deleteReview,
  retrieveAllReviews
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withPage(ReviewTable, "Reviews Management"))
);
