import React, { Component, Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import data from '../../assets/data/listVendor';
import Datatable from '../common/datatable'

export class List_vendors extends Component {
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Vendor List" parent="Vendors" />
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>Vendor Details</h5>
                        </div>
                        <div className="card-body vendor-table coupon-list-delete">
                            <Datatable
                                multiSelectOption={true}
                                myData={data}
                                pageSize={10}
                                pagination={true}
                                class="-striped -highlight"
                            />
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default List_vendors
