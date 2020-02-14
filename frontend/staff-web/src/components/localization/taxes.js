import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import data from '../../assets/data/taxes';
import Datatable from '../common/datatable'

export class Taxes extends Component {
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Taxes" parent="Localization" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Tax Details</h5>
                                </div>
                                <div className="card-body">
                                    <div id="basicScenario" className="product-list translation-list">
                                        <Datatable
                                            multiSelectOption={false}
                                            myData={data}
                                            pageSize={6}
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

export default Taxes
