import React, { Component, PureComponent } from "react";
import { retrieveAllTags } from "../../../redux/actions/tagAction";
import MaterialTable from "material-table";
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
  ViewColumn
} from "@material-ui/icons";
import connect from "react-redux/es/connect/connect";

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

class TagTable extends Component {
  componentDidMount() {
    this.props.retrieveAllTags();
  }

  render() {
    console.log(this.props);
    return (
      <React.Fragment>
        <div className="card__title" style={{ marginBottom: "20" }}>
          <h5 className="bold-text">All Tags</h5>
        </div>
        <div
          className="table"
          style={{
            width: "auto",
            overflowX: "scroll",
            verticalAlign: "middle"
          }}
        >
          {this.props.allTags ? (
            <MaterialTable
              icons={tableIcons}
              columns={[
                { title: "Tag Id", field: "tagId" },
                { title: "Name", field: "name" },
                { title: "Products Linked", field: "products.length" }
              ]}
              data={this.props.allTags}
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
            "not"
          )}
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  allTags: state.tag.allTags,
  errors: state.errors
});

const mapDispatchToProps = {
  retrieveAllTags
};

// eslint-disable-next-line no-undef
export default connect(mapStateToProps, mapDispatchToProps)(TagTable);
