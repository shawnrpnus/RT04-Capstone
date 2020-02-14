import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb'
import data from '../../assets/data/listPages';
import Datatable from '../common/datatable';

class ListPages extends Component {
    render() {
        return (
            <Fragment>
                <Breadcrumb title="List Pages" parent="Pages" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Products Category</h5>
                                </div>
                                <div className="card-body">
                                    <div id="batchDelete" className="category-table order-table coupon-list-delete">
                                        <Datatable
                                            multiSelectOption={true}
                                            myData={data}
                                            pageSize={7}
                                            pagination={false}
                                            class="-striped -highlight"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default ListPages
