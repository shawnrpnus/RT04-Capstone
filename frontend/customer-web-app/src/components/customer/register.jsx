import React, {Component} from 'react';
import { connect } from "react-redux";

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

    onChange = (e) => {
        console.log("change");
        console.log(e.target.name)
        console.log(e.target.value)
        this.setState({[e.target.name]: e.target.value}); //computed property name syntax
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

    componentWillUpdate() {
        if (Object.keys(this.props.errors).length !== 0) this.props.clearErrors();
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
                                                <input type="text" className="form-control" id="firstName"
                                                       placeholder="First Name"
                                                       name="firstName"
                                                       value={this.state.firstName}
                                                       onChange={this.onChange}/>
                                                {errors.firstName && (
                                                    <p style={{color:"red"}}>
                                                        {errors.firstName}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="lastName">Last Name</label>
                                                <input type="text" className="form-control" id="lastName"
                                                       placeholder="Last Name"
                                                       name="lastName"
                                                       value={this.state.lastName}
                                                       onChange={this.onChange}/>
                                                {errors.lastName && (
                                                    <p style={{color:"red"}}>
                                                        {errors.lastName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-6">
                                                <label htmlFor="email">Email</label>
                                                <input className="form-control" id="email"
                                                       placeholder="Email"
                                                       name="email"
                                                       value={this.state.email}
                                                       onChange={this.onChange}/>
                                                {errors.email && (
                                                    <p style={{color:"red"}}>
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="password">Password</label>
                                                <input type="password" className="form-control" id="password"
                                                       placeholder="Enter your password"
                                                       name="password"
                                                       value={this.state.password}
                                                       onChange={this.onChange}/>
                                                {errors.password && (
                                                    <p style={{color:"red"}}>
                                                        {errors.password}
                                                    </p>
                                                )}
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
