import React, { Component, PureComponent } from "react";
import {
  deleteTag,
  retrieveAllTags,
  updateTag
} from "../../../redux/actions/tagAction";
import MaterialTable from "material-table";
import {
  AddBox,
  ArrowUpward,
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
  SearchOutlined,
  ViewColumn,
  Visibility
} from "@material-ui/icons";
import connect from "react-redux/es/connect/connect";
import withMaterialConfirmDialog from "../../Layout/page/withMaterialConfirmDialog";
import CreateUpdateTagRequest from "../../../models/CreateUpdateTagRequest";
import { css } from "@emotion/core";

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

const override = css`
  display: block;
  margin: 0 auto;
`;

class TagTable extends Component {
  componentDidMount() {
    this.props.retrieveAllTags();
  }

  handleDelete = tagId => {
    this.props
      .confirmDialog({ description: "Tag will be deleted permanently" })
      .then(() => this.props.deleteTag(tagId, this.props.history));
  };

  handleUpdate = (newData, oldData) => {
    if (newData.name !== oldData.name) {
      const req = new CreateUpdateTagRequest(newData.name);
      req.tagId = oldData.tagId;
      this.props.updateTag(req, this.props.history);
    }
  };

  render() {
    const { history, renderLoader } = this.props;
    const data = this.props.allTags;
    // console.log(this.props);
    // console.log(setState);
    return (
      <React.Fragment>
        {/*<div className="card__title">*/}
        {/*  <h5 className="bold-text">All Tags</h5>*/}
        {/*</div>*/}
        <div
          className="table"
          style={{
            width: "auto",
            verticalAlign: "middle"
          }}
        >
          {this.props.allTags ? (
            <MaterialTable
              title="All Tags"
              icons={tableIcons}
              columns={[
                { title: "Tag Id", field: "tagId", editable: "never" },
                { title: "Name", field: "name" },
                {
                  title: "Products Linked",
                  field: "products.length",
                  editable: "never"
                }
              ]}
              actions={[
                {
                  icon: Delete,
                  tooltip: "Delete Tag",
                  onClick: (event, rowData) => this.handleDelete(rowData.tagId)
                }
              ]}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise(resolve => {
                    if (oldData) {
                      this.handleUpdate(newData, oldData);
                      resolve();
                    }
                  })
              }}
              data={data}
              options={{
                filtering: true,
                sorting: true,
                pageSize: 10,
                search: true,
                padding: "dense",
                pageSizeOptions: [10, 20, 40],
                actionsColumnIndex: -1
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
  allTags: state.tag.allTags,
  errors: state.errors
});

const mapDispatchToProps = {
  retrieveAllTags,
  deleteTag,
  updateTag
};

// eslint-disable-next-line no-undef
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withMaterialConfirmDialog(TagTable));
