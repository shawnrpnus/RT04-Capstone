import React, { Component } from "react";
import MaterialTable from "material-table";
import {
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
  SearchOutlined,
  ViewColumn
} from "@material-ui/icons";
import connect from "react-redux/es/connect/connect";
import withMaterialConfirmDialog from "../../Layout/page/withMaterialConfirmDialog";
import {
  deletePromoCode,
  retrieveAllPromoCodes
} from "../../../redux/actions/promoCodeActions";
import withPage from "../../Layout/page/withPage";
import Button from "@material-ui/core/Button";
import EmailForm from "./../../Email/EmailForm";

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

class PromoCodeTable extends Component {
  state = {
    open: false
  };

  componentDidMount() {
    this.props.retrieveAllPromoCodes();
  }

  handleDelete = promoCode => {
    console.log(promoCode);
    console.log(promoCode.transactions.length);
    if(promoCode.transactions.length === 0){
    this.props
      .confirmDialog({ description: "Promo Code will be deleted permanently" })
      .then(() => this.props.deletePromoCode(promoCode.promoCodeId, this.props.history));}
    else{
      this.props
          .confirmDialog({ description: "Promo Code quantity will be set to 0 because there are still transactions linked to this promo code" })
          .then(() => this.props.deletePromoCode(promoCode.promoCodeId, this.props.history));
    }
  };

  toggleOpenEmailForm = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { history, renderLoader, allPromoCodes } = this.props;
    const { open } = this.state;
    const data = this.props.allPromoCodes;
    console.log(data);

    return (
      <React.Fragment>
        <div
          className="table"
          style={{
            width: "auto",
            verticalAlign: "middle",
            textAlign: "right"
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={this.toggleOpenEmailForm}
            style={{ margin: "2% 0" }}
          >
            Email customer
          </Button>
          {open && (
            <EmailForm
              open={open}
              onClose={() => this.setState({ open: false })}
            />
          )}
          {allPromoCodes ? (
            <MaterialTable
              title="All Promo Codes"
              icons={tableIcons}
              columns={[
                { title: "Promo Code Name", field: "promoCodeName" },
                { title: "Number Remaining", field: "numRemaining" },
                { title: "Minimum Purchase($)", field: "minimumPurchase" },
                {
                  title: "Flat Discount($)",
                  field: "flatDiscount",
                  emptyValue: "NA"
                },
                {
                  title: "Percentage Discount(%)",
                  field: "percentageDiscount",
                  emptyValue: "NA"
                }
              ]}
              actions={[
                {
                  icon: Edit,
                  tooltip: "Update Promo Code",
                  onClick: (event, rowData) =>
                    history.push(`/promoCode/update/${rowData.promoCodeId}`)
                },

                {
                  icon: Delete,
                  tooltip: "Delete Promo Code",
                  onClick: (event, rowData) =>
                    this.handleDelete(rowData)
                }
              ]}
              data={data}
              options={{
                filtering: true,
                sorting: true,
                pageSize: 10,
                search: true,
                padding: "dense",
                pageSizeOptions: [10, 20, 40],
                actionsColumnIndex: -1,
                headerStyle: { textAlign: "center" },
                cellStyle: { textAlign: "center" },
                searchFieldStyle: { textAlign: "center", width: "100%" },
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
  allPromoCodes: state.promoCode.allPromoCodes,
  errors: state.errors
});

const mapDispatchToProps = {
  retrieveAllPromoCodes,
  deletePromoCode
};

// eslint-disable-next-line no-undef
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withMaterialConfirmDialog(withPage(PromoCodeTable, "View All Promo Codes")));
