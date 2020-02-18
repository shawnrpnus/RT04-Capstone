import React, {Component} from 'react';
import { connect } from "react-redux";
import classnames from "classnames";

import Breadcrumb from "../common/breadcrumb";
import CreateCustomerRequest from "../../models/create-customer-request";
import {clearErrors, createNewCustomer} from "../../actions";

class Register extends Component {

    constructor(props) {
        super(props)

        this.state = {
            firstName: null,
            lastName: null,
            email: null,
            password: null
        }

    }

    componentWillMount() {
        this.props.clearErrors();
    }

    onChange = (e) => {
        console.log("change");
        console.log(e.target.name)
        console.log(e.target.value)
        this.setState({[e.target.name]: e.target.value}); //computed property name syntax
        if (Object.keys(this.props.errors).length !== 0) this.props.clearErrors();
    }

    onSubmit = (e) => {
        e.preventDefault();
        const req = new CreateCustomerRequest(
            this.state.firstName,
            this.state.lastName,
            this.state.email,
            this.state.password);
        this.props.createNewCustomer(req, this.props.history);
    }


    render() {
        const {errors} = this.props;
        return (
            <div>
                <Breadcrumb title={'Register'}/>

                <section className="register-page section-b-space">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h3>Create an account</h3>
                                <div className="theme-card">
                                    <form className="theme-form" onSubmit={this.onSubmit}>
                                        <div className="form-row">
                                            <div className="col-md-6">
                                                <label htmlFor="firstName">First Name</label>
                                                {errors.firstName && (
                                                    <label htmlFor="firstName" style={{color:"red", float: "right"}}>
                                                        {errors.firstName}
                                                    </label>
                                                )}
                                                <input type="text"
                                                       className={classnames("form-control", {"is-invalid": errors.firstName})}
                                                       id="firstName"
                                                       placeholder="First Name"
                                                       name="firstName"
                                                       value={this.state.firstName}
                                                       onChange={this.onChange}/>

                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="lastName">Last Name</label>
                                                {errors.lastName && (
                                                    <label htmlFor="lastName" style={{color:"red", float: "right"}}>
                                                        {errors.lastName}
                                                    </label>
                                                )}
                                                <input type="text"
                                                       className={classnames("form-control", {"is-invalid": errors.lastName})}                                                       id="lastName"
                                                       placeholder="Last Name"
                                                       name="lastName"
                                                       value={this.state.lastName}
                                                       onChange={this.onChange}/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-6">
                                                <label htmlFor="email">Email</label>
                                                {errors.email && (
                                                    <label htmlFor="email" style={{color:"red", float: "right"}}>
                                                        {errors.email}
                                                    </label>
                                                )}
                                                <input type="text"
                                                       className={classnames("form-control", {"is-invalid": errors.email})}
                                                       id="email"
                                                       placeholder="Email"
                                                       name="email"
                                                       value={this.state.email}
                                                       onChange={this.onChange}/>
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="password">Password</label>
                                                {errors.password && (
                                                    <label htmlFor="password" style={{color:"red", float: "right"}}>
                                                        {errors.password}
                                                    </label>
                                                )}
                                                <input type="password"
                                                       className={classnames("form-control", {"is-invalid": errors.password})}                                                       id="password"
                                                       placeholder="Enter your password"
                                                       name="password"
                                                       value={this.state.password}
                                                       onChange={this.onChange}/>
                                            </div>

                                            <input type="submit" className="btn btn-solid" value="Create Account"/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    errors: state.errors,
    currentCustomer: state.customer.currentCustomer
});
const mapDispatchToProps = {
    createNewCustomer,
    clearErrors
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);
