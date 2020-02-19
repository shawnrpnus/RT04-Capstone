import React, { PureComponent } from 'react';
import { Link, Redirect } from "react-router-dom";
import MaterialTable from "material-table";
import { Col, Container, Row } from "reactstrap";
import {
    AddBox, ArrowUpward, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline,
    Edit, FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn
} from "@material-ui/icons";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PageviewOutlinedIcon from '@material-ui/icons/PageviewOutlined';


const tableIcons = {
    Add: AddBox,
    Check: Check,
    Clear: Clear,
    Delete: DeleteOutline,
    DetailPanel: ChevronRight,
    Edit: Edit,
    Export: SaveAlt,
    Filter: FilterList,
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


export default class ProductTable extends PureComponent {
    state = {
        id: "",
        redirect: false
    }

    handleViewProductDetails = (id) => {
        this.setState({ redirect: true, id })
    }

    render() {
        const { redirect, id } = this.state;
        if (redirect) return <Redirect to={`/viewProductDetails/${id}`} />

        return <Container>
            <Row>
                <Col md={12}>
                    <h3 className="page-title">Products List</h3>
                    <h3 className="page-subhead subhead">Use this elements, if you want to show some hints or additional
                        information
                </h3>
                </Col>
            </Row>
            <Row>
                <MaterialTable
                    fullWidth
                    title="Basic Filtering Preview"
                    icons={tableIcons}
                    columns={[
                        {
                            title: 'Avatar', field: 'avatar',
                            render: rowData => (
                                <Link>
                                    <img
                                        style={{ width: 36, borderRadius: '50%' }}
                                        src={rowData.avatar}
                                        onClick={() => console.log("You saved me" + rowData.avatar)}
                                    />
                                </Link>
                            ),
                        },
                        { title: 'Name', field: 'name' },
                        { title: 'Cost', field: 'cost', type: "currency" },
                        { title: 'Price', field: 'price', type: "currency" },
                        {
                            title: 'Color', field: 'color',
                            render: rowData => (
                                rowData.color.map((color) => {
                                    return <FiberManualRecordIcon style={{ color }} />
                                })

                            ),
                        },
                        {
                            title: 'Category',
                            field: 'category',
                            lookup: { 1: 'Shoes', 2: 'Shirt' },
                        },
                    ]}
                    data={[
                        { id: 1, name: 'Fila Disruptor II', surname: 'Baran', image: 1987, category: 1, color: ["orange", "yellow"], cost: 49.00, price: 89.90, avatar: "./img/shoes/01.png" },
                        { id: 2, name: 'Turtleneck ', surname: 'Baran', image: 2017, category: 2, color: ["blue", "brown", "black"], cost: 89.00, price: 199.90, avatar: "./img/shoes/02.png" },
                    ]}
                    options={{
                        filtering: true,
                        sorting: true,
                        pageSize: 10,
                        pageSizeOptions: [10, 20, 40],
                        actionsColumnIndex: -1
                    }}
                    actions={[
                        {
                            icon: PageviewOutlinedIcon,
                            tooltip: 'View Product Variants',
                            onClick: (event, rowData) => this.handleViewProductDetails(rowData.id)
                        },
                        // rowData => ({
                        //   icon: 'delete',
                        //   tooltip: 'Delete User',
                        //   onClick: (event, rowData) => confirm("You want to delete " + rowData.name),
                        //   disabled: rowData.birthYear < 2000
                        // })
                    ]}
                />
            </Row>
        </Container>
    }
}

