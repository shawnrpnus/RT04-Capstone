import React, { Component, Fragment } from 'react';
import Breadcrumb from '../components/common/breadcrumb';
import data from '../assets/data/invoice';
import Datatable from '../components/common/datatable';

export class Invoice extends Component {
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Invoice" parent="Invoice"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Invoice List</h5>
                                </div>
                                <div className="card-body">
                                    <div id="basicScenario" className="product-list">
                                        <Datatable
                                            multiSelectOption={false}
                                            myData={data}
                                            pageSize={10}
                                            pagination={true}
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

export default Invoice
