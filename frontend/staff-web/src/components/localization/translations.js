import React, { Component,Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import data from '../../assets/data/translations';
import Datatable from '../common/datatable'

export class Translations extends Component {
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Translations" parent="Localization" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Translations</h5>
                                </div>
                                <div className="card-body">
                                    <div id="basicScenario" className="product-list translation-list">
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

export default Translations
