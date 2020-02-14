import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import MyDropzone from '../common/dropzone';
import Datatable from '../common/datatable'
import data from '../../assets/data/media';

export class Media extends Component {
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Media" parent="Media" />
                <div className="container-fluid bulk-cate">
                    <div className="card ">
                        <div className="card-header">
                            <h5>Dropzone Media</h5>
                        </div>
                        <div className="card-body">
                            <MyDropzone />
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h5>Media File List</h5>
                        </div>
                        <div className="card-body">
                            <div id="batchDelete" className="category-table media-table coupon-list-delete">
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
                </div>
            </Fragment>
        )
    }
}

export default Media
