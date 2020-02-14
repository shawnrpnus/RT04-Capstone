import React, { Component,Fragment } from 'react';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export class Tabset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeShow: true,
            startDate: new Date()
        }
        this.handleChange = this.handleChange.bind(this)
    }

    clickActive = (event) => {
        document.querySelector(".nav-link").classList.remove('show');
        event.target.classList.add('show');
    }
    handleChange(date) {
        this.setState({
            startDate: date
        });
    }

    render() {
        return (
            <Fragment>
                <Tabs>
                    <TabList className="nav nav-tabs tab-coupon" >
                        <Tab className="nav-link" onClick={(e) => this.clickActive(e)}>General</Tab>
                        <Tab className="nav-link" onClick={(e) => this.clickActive(e)}>Restriction</Tab>
                        <Tab className="nav-link" onClick={(e) => this.clickActive(e)}>Usage</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="tab-pane fade active show">
                            <form className="needs-validation" noValidate="">
                                <h4>General</h4>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-md-4"><span>*</span> Name</label>
                                            <input className="form-control col-md-7" id="validationCustom0" type="text" required="" />
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-md-4"><span>*</span> Code</label>
                                            <input className="form-control col-md-7" id="validationCustom1" type="text" required="" />
                                            <div className="valid-feedback">Please Provide a Valid Coupon Code.</div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-md-4">Start Date</label>
                                            <DatePicker
                                            selected={this.state.startDate}
                                            onChange={this.handleChange}
                                        />
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-md-4">End Date</label>
                                            <DatePicker
                                                selected={this.state.startDate}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-md-4">Free Shipping</label>
                                            <div className="col-md-7 checkbox-space">
                                                <label className="d-block">
                                                    <input className="checkbox_animated" id="chk-ani2" type="checkbox" />
                                                    Allow Free Shipping
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-md-4">Quantity</label>
                                            <input className="form-control col-md-7" type="number" required="" />
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-md-4">Discount Type</label>
                                            <select className="custom-select col-md-7" required="">
                                                <option value="">--Select--</option>
                                                <option value="1">Percent</option>
                                                <option value="2">Fixed</option>
                                            </select>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-md-4">Status</label>
                                            <div className="col-md-7 checkbox-space">
                                                <label className="d-block">
                                                    <input className="checkbox_animated" id="chk-ani2" type="checkbox" />
                                                    Enable the Coupon
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <form className="needs-validation" noValidate="">
                            <h4>Restriction</h4>
                            <div className="form-group row">
                                <label className="col-xl-3 col-md-4">Products</label>
                                <input className="form-control col-md-7" id="validationCustom3" type="text" required="" />
                                <div className="valid-feedback">Please Provide a Product Name.</div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xl-3 col-md-4">Category</label>
                                <select className="custom-select col-md-7" required="">
                                    <option value="">--Select--</option>
                                    <option value="1">Electronics</option>
                                    <option value="2">Clothes</option>
                                    <option value="2">Shoes</option>
                                    <option value="2">Digital</option>
                                </select>
                            </div>
                            <div className="form-group row">
                                <label className="col-xl-3 col-md-4">Minimum Spend</label>
                                <input className="form-control col-md-7" id="validationCustom4" type="number" />
                            </div>
                            <div className="form-group row">
                                <label className="col-xl-3 col-md-4">Maximum Spend</label>
                                <input className="form-control col-md-7" id="validationCustom5" type="number" />
                            </div>
                        </form>
                    </TabPanel>
                    <TabPanel>
                        <form className="needs-validation" noValidate="">
                            <h4>Usage Limits</h4>
                            <div className="form-group row">
                                <label className="col-xl-3 col-md-4">Per Limit</label>
                                <input className="form-control col-md-7" id="validationCustom6" type="number" />
                            </div>
                            <div className="form-group row">
                                <label className="col-xl-3 col-md-4">Per Customer</label>
                                <input className="form-control col-md-7" id="validationCustom7" type="number" />
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

export default Tabset
