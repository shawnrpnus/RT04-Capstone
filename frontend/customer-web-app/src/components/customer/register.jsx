import React, {Component} from 'react';
import {connect} from "react-redux";
import classnames from "classnames";

import Breadcrumb from "../common/breadcrumb";
import CreateCustomerRequest from "../../models/create-customer-request";
import {clearErrors, createNewCustomer} from "../../actions";
import FormField from "../ui/form-field";

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
                                                <FormField errors={this.props.errors}
                                                           onChange={this.onChange} state={this.state}
                                                           fieldLabel="First Name" fieldName="firstName"/>

                                            </div>
                                            <div className="col-md-6">
                                                <FormField errors={this.props.errors}
                                                           onChange={this.onChange} state={this.state}
                                                           fieldLabel="Last Name" fieldName="lastName"/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-6">
                                                <FormField errors={this.props.errors}
                                                           onChange={this.onChange} state={this.state}
                                                           fieldLabel="Email" fieldName="email"/>
                                            </div>

                                            <div className="col-md-6">
                                                <FormField type="password" errors={this.props.errors}
                                                           onChange={this.onChange} state={this.state}
                                                           fieldLabel="Password" fieldName="password"/>
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
    registeredCustomer: state.customer.registeredCustomer
});
const mapDispatchToProps = {
    createNewCustomer,
    clearErrors
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);
