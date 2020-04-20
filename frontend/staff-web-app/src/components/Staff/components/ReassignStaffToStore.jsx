import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {clearErrors, updateErrors} from "../../../redux/actions";
import {retrieveAllStores} from "../../../redux/actions/storeActions";
import {connect} from "react-redux";
import withPage from "../../Layout/page/withPage";
import Grid from "@material-ui/core/Grid";
import MaterialObjectSelect from "../../../shared/components/Form/MaterialObjectSelect";
import {reassignStaffStore, retrieveAllStoreStaff} from "../../../redux/actions/staffActions";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import {
    AddBox,
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
    SwapHorizTwoTone
} from "@material-ui/icons";
import ReassignStaffStoreRequest from "../../../models/staff/ReassignStaffStoreRequest";
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

class ReassignStaffToStore extends Component {
    static propTypes = {
        errors: PropTypes.object,
        clearErrors: PropTypes.func
    };

    componentDidMount() {
        this.props.retrieveAllStores();
        this.props.retrieveAllStoreStaff();
        this.handleChangeAll();
    }

    constructor(props) {
        super(props);
        this.handleChangeAll = this.handleChangeAll.bind(this);
        this.handleChangeReassign = this.handleChangeReassign.bind(this);
        this.state = {
            storeId: "",
            newStoreId: "",
            staffIds:[],
            showTable:false,
            showReselectStore:false
        };
    }

    onChangeStore = e => {
        const name = e.target.name;
        this.setState({ [name]: e.target.value }); //computed property name syntax
        this.setState({ showTable: true });
    };

    onChangeNewStore = e => {
        const name = e.target.name;
        this.setState({ [name]: e.target.value });
    };

    handleSelected = (evt, data) => {
        this.setState({ showReselectStore: true });
        evt.preventDefault();
        data.forEach(element => {
            this.state.staffIds.push(element.staffId);
        });
    };
    handleConfirm = e => {
        e.preventDefault();
        const req = new ReassignStaffStoreRequest(this.state.newStoreId, this.state.staffIds);
        this.props.reassignStaffStore(req, this.props.history);
        this.setState({ staffIds: [] });
        this.setState({ showReselectStore: false });
        this.setState({ mode:true });
        this.setState({newStoreId:""})

    };


    handleChangeAll() {
        this.setState({ mode: true });
    }
    handleChangeReassign() {
        this.setState({ mode: false });
    }

    render() {
        return (
            <React.Fragment>
            <div className="card__title">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        {this.state.mode ? (
                            <h5 className="bold-text">All Store Staff</h5>
                        ) : (
                            <h5 className="bold-text">Reassign Staff</h5>
                        )}
                    </Grid>
                    <Grid item xs={12} md={3} />
                    <Grid item xs={12} md={3}>
                            <ButtonGroup color="primary">
                                <Button
                                    onClick={this.handleChangeAll}
                                    variant={this.state.mode ? "contained" : "outlined"}
                                >
                                    All
                                </Button>
                                <Button
                                    onClick={this.handleChangeReassign}
                                    variant={this.state.mode ? "outlined" : "contained"}
                                >
                                    Reassign
                                </Button>
                            </ButtonGroup>
                    </Grid>
                </Grid>
            </div>

                {this.state.mode ? (
                <div
                    className="table"
                    style={{
                        width: "auto",
                        verticalAlign: "middle"
                    }}
                >
                    {this.props.storeStaff ? (
                        <MaterialTable
                            title="Staff"
                            style={{ boxShadow: "none" }}
                            icons={tableIcons}
                            columns={[
                                { title: "First Name", field: "firstName" },
                                { title: "Last Name", field: "lastName" },
                                { title: "Department", field: "department.departmentName" },
                                { title: "Role", field: "role.roleName" },
                                { title: "Store", field: "store.storeName" }
                            ]}
                            data={this.props.storeStaff}
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
                        this.props.renderLoader()
                    )}
                </div>
                    ):(
            <form className="material-form">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        {this.props.allStores ? (
                            <MaterialObjectSelect
                                fieldName="storeId"
                                fieldLabel="Select Store"
                                onChange={this.onChangeStore}
                                state={this.state}
                                objects={this.props.allStores}
                                objectFieldForValue="storeId"
                                objectFieldForKey="storeId"
                                objectFieldToDisplay="storeName"
                            />
                        ) : null}
                    </Grid>
                    <Grid item xs={12} md={4}></Grid>
                    <Grid item xs={12} md={3}>
                        {this.props.allStores && this.state.showReselectStore ? (
                            <MaterialObjectSelect
                                fieldName="newStoreId"
                                fieldLabel= "Reassign To"
                                onChange={this.onChangeNewStore}
                                state={this.state}
                                objects={this.props.allStores.filter(
                                    s =>
                                        s.storeId !== this.state.storeId
                                )}
                                objectFieldForValue="storeId"
                                objectFieldForKey="storeId"
                                objectFieldToDisplay="storeName"
                            />

                        ) : null}
                    </Grid>
                    <Grid item xs={12} md={2}>
                        {this.state.showReselectStore ? (
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    onClick={e => this.handleConfirm(e, this.state)}
                                >
                                    Confirm
                                </Button>

                        ) : null}
                    </Grid>
                    <Grid item xs={12} md={9}></Grid>
                    {this.state.showTable && (
                    <div
                        className="table"
                        style={{
                            width: "auto",
                            verticalAlign: "middle"
                        }}
                    >
                        {this.props.storeStaff? (
                            <MaterialTable
                                title="Staff"
                                style={{ boxShadow: "none" }}
                                icons={tableIcons}
                                columns={[
                                    { title: "First Name", field: "firstName" },
                                    { title: "Last Name", field: "lastName" },
                                    { title: "Department", field: "department.departmentName" },
                                    { title: "Role", field: "role.roleName" },
                                    { title: "Store", field: "store.storeName" }
                                ]}
                                data={this.props.storeStaff.filter(
                                    s =>
                                        s.store.storeId === this.state.storeId
                                )}
                                actions={[
                                    {
                                        tooltip: "Reassign Store",
                                        icon: SwapHorizTwoTone,
                                        onClick: (evt, data) =>
                                            this.handleSelected(evt, data)
                                    }
                                ]}
                                options={{
                                    filtering: true,
                                    sorting: true,
                                    pageSize: 5,
                                    search: true,
                                    showTitle: true,
                                    pageSizeOptions: [5, 10, 15],
                                    actionsColumnIndex: -1,
                                    headerStyle: { textAlign: "center" },
                                    cellStyle: { textAlign: "center" },
                                    selection: true,
                                }}
                            />
                        ) : (
                            this.props.renderLoader()
                        )}
                    </div>
                    )}
                </Grid>


            </form>
                    )}
            </React.Fragment>
        )
    }
}

//mapping global state to this component
const mapStateToProps = state => ({
    allStores: state.storeEntity.allStores,
    storeStaff: state.staffEntity.storeStaff,
    errors: state.errors
});

const mapDispatchToProps = {
    clearErrors,
    updateErrors,
    retrieveAllStores,
    retrieveAllStoreStaff,
    reassignStaffStore
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withPage(ReassignStaffToStore, "Manage Roster"));
