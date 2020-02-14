import React, { Component, Fragment } from 'react';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import CKEditors from "react-ckeditor-component";
export class Tabset_page extends Component {
    render() {
        return (
            <Fragment>
                   <div>
                <Tabs>
                    <TabList className="nav nav-tabs tab-coupon" >
                        <Tab className="nav-link">General</Tab>
                        <Tab className="nav-link">SEO</Tab>
                    </TabList>

                        <TabPanel>
                            <form className="needs-validation">
                                <h4>General</h4>
                                <div className="form-group row">
                                    <label className="col-xl-3 col-md-4"><span>*</span> Name</label>
                                    <input className="form-control col-xl-8 col-md-7" id="validationCustom0" type="text" />
                                </div>
                                <div className="form-group row editor-label">
                                    <label className="col-xl-3 col-md-4"><span>*</span> Description</label>
                                    <div className="col-xl-8 col-md-7 editor-space">
                                        <CKEditors
                                            activeclassName="p10"
                                            events={{
                                                "blur": this.onBlur,
                                                "afterPaste": this.afterPaste,
                                                "change": this.onChange
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-xl-3 col-md-4">Status</label>
                                    <div className="col-xl-8 col-md-7 checkbox-space">
                                        <label className="d-block">
                                            <input className="checkbox_animated" id="chk-ani1" type="checkbox" />
                                            Enable the Coupon
                                            </label>
                                    </div>
                                </div>
                            </form>
                        </TabPanel>
                        <TabPanel>
                            <form className="needs-validation">
                                <h4>SEO</h4>
                                <div className="form-group row">
                                    <label className="col-xl-3 col-md-4">Meta Title</label>
                                    <input className="form-control col-xl-8 col-md-7" id="validationCustom2" type="text" />
                                </div>
                                <div className="form-group row editor-label">
                                    <label className="col-xl-3 col-md-4">Meta Description</label>
                                    <textarea rows="4" className="col-xl-8 col-md-7"></textarea>
                                </div>
                            </form>
                        </TabPanel>
                    </Tabs>
                    <div className="pull-right">
                        <button type="button" className="btn btn-primary">Save</button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Tabset_page
