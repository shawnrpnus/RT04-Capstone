import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';

export class Create_menu extends Component {
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Create Menu" parent="Menus" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Add Menu</h5>
                                </div>
                                <div className="card-body">
                                    <form className="needs-validation">
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-md-4"><span>*</span> Menu Name</label>
                                            <input className="form-control col-md-8" id="validationCustom0" type="text" required="" />
                                        </div>
                                        <div className="form-group row">
                                             <label className="col-xl-3 col-md-4">Status</label>
                                            <div className=" col-xl-9 col-md-8 checkbox-space">
                                                <label className="d-block">
                                                    <input className="checkbox_animated" id="chk-ani2" type="checkbox" />
                                                    Enable the Coupon
                                            </label>
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-primary">Save</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Create_menu
