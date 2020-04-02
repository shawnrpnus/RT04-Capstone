import React, { Component, PureComponent } from "react";
import {
  deleteStyle,
  retrieveAllStyles,
  updateStyle
} from "../../../redux/actions/styleAction";
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
import CreateUpdateStyleRequest from "../../../models/CreateUpdateStyleRequest";
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
  SortArrow: () => <div />,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};

const override = css`
  display: block;
  margin: 0 auto;
`;

class StyleTable extends Component {
  componentDidMount() {
    this.props.retrieveAllStyles();
  }

  handleDelete = styleId => {
    this.props
      .confirmDialog({ description: "Style will be deleted permanently" })
      .then(() => this.props.deleteStyle(styleId, this.props.history));
  };

  handleUpdate = (styleName, styleId, oldName) => {
    if (styleName !== oldName) {
      const req = new CreateUpdateStyleRequest(styleName);
      req.styleId = styleId;
      this.props.updateStyle(req, this.props.history);
    }
  };

  render() {
    const { history, renderLoader } = this.props;
    const data = this.props.allStyles;

    if (this.props.allStyles) {
      this.props.allStyles.forEach(style => {
        style.products = Array.isArray(style.products)
          ? style.products.length
          : style.products;
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
          {this.props.allStyles ? (
            <MaterialTable
              title="All Styles"
              icons={tableIcons}
              columns={[
                { title: "Name", field: "styleName" },
                {
                  title: "Products Linked",
                  field: "products",
                  editable: "never"
                }
              ]}
              actions={[
                {
                  icon: Delete,
                  tooltip: "Delete Style",
                  onClick: (event, rowData) => this.handleDelete(rowData.styleId)
                }
              ]}
              editable={{
                onRowUpdate: ({ styleName }, { styleId, styleName: oldName }) =>
                  new Promise(resolve => {
                    if (styleId) {
                      this.handleUpdate(styleName, styleId, oldName);
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
                actionsColumnIndex: -1,
                // headerStyle: { textAlign: "center" },
                // cellStyle: { textAlign: "center" },
                // searchFieldStyle: {textAlign: "center", width: "100%"},
                rowStyle: { textAlign: "center" }
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
  allStyles: state.style.allStyles,
  errors: state.errors
});

const mapDispatchToProps = {
  retrieveAllStyles,
  deleteStyle,
  updateStyle
};

// eslint-disable-next-line no-undef
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withMaterialConfirmDialog(StyleTable));
