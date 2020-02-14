import React, { Component,Fragment } from 'react'
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';

export class Tabset_user extends Component {
    render() {
        return (
            <Fragment>
                <Tabs>
                    <TabList className="nav nav-tabs tab-coupon" >
                        <Tab className="nav-link">Account</Tab>
                        <Tab className="nav-link">Permission</Tab>
                    </TabList>
                    <TabPanel>
                        <form className="needs-validation user-add" noValidate="">
                            <h4>Account Details</h4>
                            <div className="form-group row">
                                <label className="col-xl-3 col-md-4"><span>*</span> First Name</label>
                                <input className="form-control col-xl-8 col-md-7" id="validationCustom0" type="text" required="" />
                            </div>
                            <div className="form-group row">
                                <label className="col-xl-3 col-md-4"><span>*</span> Last Name</label>
                                <input className="form-control col-xl-8 col-md-7" id="validationCustom1" type="text" required="" />
                            </div>
                            <div className="form-group row">
                                <label className="col-xl-3 col-md-4"><span>*</span> Email</label>
                                <input className="form-control col-xl-8 col-md-7" id="validationCustom2" type="text" required="" />
                            </div>
                            <div className="form-group row">
                                <label className="col-xl-3 col-md-4"><span>*</span> Password</label>
                                <input className="form-control col-xl-8 col-md-7" id="validationCustom3" type="password" required="" />
                            </div>
                            <div className="form-group row">
                                <label className="col-xl-3 col-md-4"><span>*</span> Confirm Password</label>
                                <input className="form-control col-xl-8 col-md-7" id="validationCustom4" type="password" required="" />
                            </div>
                        </form>
                    </TabPanel>
                    <TabPanel>
                        <form className="needs-validation user-add" noValidate="">
                            <div className="permission-block">
                                <div className="attribute-blocks">
                                    <h5 className="f-w-600 mb-3">Product Related Permission </h5>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label>Add Product</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block">
                                                    <input className="radio_animated" id="edo-ani1" type="radio" name="rdo-ani" />
                                                    Allow
                                                    </label>
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani2" type="radio" name="rdo-ani" defaultChecked />
                                                    Deny
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label>Update Product</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani3" type="radio" name="rdo-ani1" defaultChecked />
                                                    Allow
                                                                </label>
                                                <label className="d-block">
                                                    <input className="radio_animated" id="edo-ani4" type="radio" name="rdo-ani1" />
                                                    Deny
                                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label>Delete Product</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani5" type="radio" name="rdo-ani2" />
                                                    Allow
                                                                </label>
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani6" type="radio" name="rdo-ani2" defaultChecked />
                                                    Deny
                                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label className="mb-0 sm-label-radio">Apply Discount</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated pb-0">
                                                <label className="d-block mb-0" >
                                                    <input className="radio_animated" id="edo-ani7" type="radio" name="rdo-ani3" />
                                                    Allow
                                                                </label>
                                                <label className="d-block mb-0" >
                                                    <input className="radio_animated" id="edo-ani8" type="radio" name="rdo-ani3" defaultChecked />
                                                    Deny
                                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="attribute-blocks">
                                    <h5 className="f-w-600 mb-3">Category Related Permission </h5>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label>Add Category</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani9" type="radio" name="rdo-ani4" />
                                                    Allow
                                                                </label>
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani10" type="radio" name="rdo-ani4" defaultChecked />
                                                    Deny
                                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label>Update Category</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani11" type="radio" name="rdo-ani5" />
                                                    Allow
                                                                </label>
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani12" type="radio" name="rdo-ani5" defaultChecked />
                                                    Deny
                                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label>Delete Category</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani13" type="radio" name="rdo-ani6" />
                                                    Allow
                                                                </label>
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani14" type="radio" name="rdo-ani6" defaultChecked />
                                                    Deny
                                                    </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label className="mb-0 sm-label-radio">Apply Discount</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline custom-radio-ml d-flex radio-animated pb-0">
                                                <label className="d-block mb-0" >
                                                    <input className="radio_animated" id="edo-ani15" type="radio" name="rdo-ani7" />
                                                    Allow
                                                                </label>
                                                <label className="d-block mb-0" >
                                                    <input className="radio_animated" id="edo-ani16" type="radio" name="rdo-ani7" defaultChecked />
                                                    Deny
                                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </TabPanel>
                </Tabs>
                <div className="pull-right">
                    <button type="button" className="btn btn-primary">Save</button>
                </div>
            </Fragment>
        )
    }
}

export default Tabset_user
