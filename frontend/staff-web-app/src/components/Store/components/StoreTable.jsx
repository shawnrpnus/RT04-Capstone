import React, { Component } from "react";
import { retrieveAllStores } from "../../../redux/actions";
import IconButton from "@material-ui/core/IconButton";
import { connect } from "react-redux";
import MaterialTable from "material-table";
import { Link } from "react-router-dom";
import {
  AddBox,
  ArrowUpward,
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
  SearchOutlined,
  Visibility,
  ViewColumn
} from "@material-ui/icons";
import withPage from "../../Layout/page/withPage";

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
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
  SortArrow: ArrowUpward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};

class StoreTable extends Component {
  componentDidMount() {
    this.props.retrieveAllStores();
  }

  render() {
    return (
      <React.Fragment>
        <div className="card__title" style={{ marginBottom: "0" }}>
          <h5 className="bold-text">All Stores</h5>
        </div>
        <div
          className="table"
          style={{
            width: "auto",
            overflowX: "scroll",
            verticalAlign: "middle"
          }}
        >
          {this.props.allStores ? (
            <MaterialTable
              icons={tableIcons}
              columns={[
                { title: "Store Name", field: "storeName" },
                { title: "Opening Time", field: "openingTime" },
                { title: "Closing Time", field: "closingTime" },
                { title: "No. Changing Rooms", field: "numChangingRooms" },
                {
                  title: "No. Reserved Changing Rooms",
                  field: "numReservedChangingRooms"
                },
                // { title: "No. Managers", field: "numManagers" },
                // { title: "No. Assistants", field: "numAssistants" },
                {
                  title: "Actions",
                  field: "storeId",
                  render: rowData => {
                    return (
                      <div>
                        <Link to={`/store/view/${rowData.storeId}`}>
                          <IconButton>
                            <Visibility />
                          </IconButton>
                        </Link>
                        <Link to={`/store/update/${rowData.storeId}`}>
                          <IconButton>
                            <Edit />
                          </IconButton>
                        </Link>
                      </div>
                    );
                  },
                  filtering: false,
                  sorting: false
                }
              ]}
              data={this.props.allStores}
              options={{
                filtering: true,
                sorting: true,
                pageSize: 10,
                search: false,
                padding: "dense",
                toolbar: false,
                showTitle: false,
                pageSizeOptions: [10, 20, 40],
                actionsColumnIndex: -1
              }}
            />
          ) : (
            ""
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
  retrieveAllStores
};

// eslint-disable-next-line no-undef
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(StoreTable, "Store Management"));
