import React, { Component, PureComponent } from "react";
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
import { css } from "@emotion/core";
import {deletePromoCode, retrieveAllPromoCodes} from "../../../redux/actions/promoCodeActions";
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
    SortArrow: () => <div />,
    ThirdStateCheck: Remove,
    ViewColumn: ViewColumn
};

const override = css`
  display: block;
  margin: 0 auto;
`;

class PromoCodeTable extends Component {
    componentDidMount() {
        this.props.retrieveAllPromoCodes();
    }

    handleDelete = promoCodeId => {
        this.props
            .confirmDialog({ description: "Promo Code will be deleted permanently" })
            .then(() => this.props.deletePromoCode(promoCodeId, this.props.history));
    };

    render() {
        const {history, renderLoader} = this.props;
        const data = this.props.allPromoCodes;
        console.log(data);

        return (
            <React.Fragment>
                <div
                    className="table"
                    style={{
                        width: "auto",
                        verticalAlign: "middle"
                    }}
                >

                    {this.props.allPromoCodes ? (
                        <MaterialTable
                            title="All Promo Codes"
                            icons={tableIcons}
                            columns={[
                                { title: "Promo Code Name", field: "promoCodeName" },
                                { title: "Number Remaining", field: "numRemaining" },
                                { title: "Minimum Purchase", field: "minimumPurchase" },
                                { title: "Flat Discount", field: "flatDiscount" },
                                { title: "Percentage Discount", field: "percentageDiscount" }
                            ]}
                            actions={[
                                {
                                    icon: Delete,
                                    tooltip: "Delete Promo Code",
                                    onClick: (event, rowData) => this.handleDelete(rowData.promoCodeId)
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
                                searchFieldStyle: {textAlign: "center", width: "100%"},
                                rowStyle: { textAlign: "center" }
                            }}
                        />
                    ) : (
                        renderLoader()
                    )}

                </div>
            </React.Fragment>
                )

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