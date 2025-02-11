import React, { Component } from "react";
import {
  deleteStore,
  retrieveAllStores
} from "../../../redux/actions/storeActions";
import { connect } from "react-redux";
import MaterialTable from "material-table";
import {
  AddBox,
  ArrowUpward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  Delete,
  Edit,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  SearchOutlined,
  ViewColumn,
  Visibility
} from "@material-ui/icons";
import withPage from "../../Layout/page/withPage";
import { css } from "@emotion/core";
import withMaterialConfirmDialog from "../../Layout/page/withMaterialConfirmDialog";

const override = css`
  display: block;
  margin: 0 auto;
`;

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: Delete,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: SearchOutlined,
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

class StoreTable extends Component {
  componentDidMount() {
    this.props.retrieveAllStores();
  }

  handleDelete = storeId => {
    this.props
      .confirmDialog({ description: "Store will be deleted permanently" })
      .then(() => this.props.deleteStore(storeId, this.props.history));
  };

  render() {
    const data = this.props.allStores;
    const { history, renderLoader } = this.props;
    return (
      <React.Fragment>
        {/*<div className="card__title">*/}
        {/*  <h5 className="bold-text">All Stores</h5>*/}
        {/*</div>*/}
        <div
          className="table"
          style={{
            width: "auto",
            verticalAlign: "middle"
          }}
        >
          {this.props.allStores ? (
            <MaterialTable
              title="Stores"
              style={{ boxShadow: "none" }}
              icons={tableIcons}
              columns={[
                { title: "Store Name", field: "storeName" },
                { title: "Opening Time", field: "openingTime" },
                { title: "Closing Time", field: "closingTime" },
                { title: "No. Changing Rooms", field: "numChangingRooms" },
                {
                  title: "No. Reserved Changing Rooms",
                  field: "numReservedChangingRooms"
                }
              ]}
              actions={[
                {
                  icon: Visibility,
                  tooltip: "View More Details",
                  onClick: (event, rowData) =>
                    history.push(`/store/view/${rowData.storeId}`)
                },
                {
                  icon: Edit,
                  tooltip: "Update Store",
                  onClick: (event, rowData) =>
                    history.push(`/store/update/${rowData.storeId}`)
                },
                {
                  icon: Delete,
                  tooltip: "Delete Store",
                  onClick: (event, rowData) =>
                    this.handleDelete(rowData.storeId)
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
  allStores: state.storeEntity.allStores,
  errors: state.errors
});

const mapDispatchToProps = {
  retrieveAllStores,
  deleteStore
};

// eslint-disable-next-line no-undef
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withMaterialConfirmDialog(withPage(StoreTable, "Store Management")));
