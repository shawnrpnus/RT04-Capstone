import React, { Component,Fragment } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import CKEditors from "react-ckeditor-component";
import MyDropzone from '../../common/dropzone'

export class Digital_add_pro extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: 'hello world',
        }
    }
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Add Products" parent="Digital" />
                <div className="container-fluid">
                    <div className="row product-adding">
                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5>General</h5>
                                </div>
                                <div className="card-body">
                                    <div className="digital-add needs-validation">
                                        <div className="form-group">
                                            <label className="col-form-label pt-0"><span>*</span> Title</label>
                                            <input className="form-control" id="validationCustom01" type="text" required="" />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-form-label pt-0"><span>*</span> SKU</label>
                                            <input className="form-control" id="validationCustom02" type="text" required="" />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-form-label"><span>*</span> Categories</label>
                                            <select className="custom-select" required="">
                                                <option value="">--Select--</option>
                                                <option value="1">eBooks</option>
                                                <option value="2">Graphic Design</option>
                                                <option value="3">3D Impact</option>
                                                <option value="4">Application</option>
                                                <option value="5">Websites</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-form-label">Sort Summary</label>
                                            <textarea rows="4" cols="12"></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-form-label"><span>*</span> Product Price</label>
                                            <input className="form-control" id="validationCustom02" type="text" required="" />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-form-label"><span>*</span> Status</label>
                                            <div className="m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block">
                                                    <input className="radio_animated" id="edo-ani" type="radio" name="rdo-ani" />
                                                    Enable
                                            </label>
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani1" type="radio" name="rdo-ani" />
                                                    Disable
                                            </label>
                                            </div>
                                        </div>
                                        <label className="col-form-label pt-0"> Product Upload</label>
                                        <MyDropzone />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Add Description</h5>
                                </div>
                                <div className="card-body">
                                    <div className="digital-add needs-validation">
                                        <div className="form-group mb-0">
                                            <div className="description-sm">
                                                <CKEditors
                                                    activeclassName="p10"
                                                    content={this.state.content}
                                                    events={{
                                                        "blur": this.onBlur,
                                                        "afterPaste": this.afterPaste,
                                                        "change": this.onChange
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <h5>Meta Data</h5>
                                </div>
                                <div className="card-body">
                                    <div className="digital-add needs-validation">
                                        <div className="form-group">
                                            <label className="col-form-label pt-0"> Meta Title</label>
                                            <input className="form-control" id="validationCustom05" type="text" required="" />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-form-label">Meta Description</label>
                                            <textarea rows="4" cols="12"></textarea>
                                        </div>
                                        <div className="form-group mb-0">
                                            <div className="product-buttons text-center">
                                                <button type="button" className="btn btn-primary">Add</button>
                                                <button type="button" className="btn btn-light">Discard</button>
                                            </div>
                                        </div>
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

export default Digital_add_pro
