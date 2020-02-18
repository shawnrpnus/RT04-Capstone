import React, {Component} from 'react';
import * as PropTypes from 'prop-types'

import Breadcrumb from "../common/breadcrumb";
import {Link} from "react-router-dom";
import FormField from "../ui/form-field";
import CustomerLoginRequest from "../../models/customer-login-request";
import {clearErrors, customerLogin} from "../../actions";
import {connect} from "react-redux";

class Login extends Component {

    constructor(props) {
        super(props)

        this.state = {
            email: null,
            password: null
        }

    }

    componentWillMount() {
        this.props.clearErrors();
    }

    componentDidUpdate(){
        // if (this.props.loggedInCustomer?.firstName){
        //     alert("Welcome, " + this.props.loggedInCustomer.firstName)
        // }
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value}); //computed property name syntax
        if (Object.keys(this.props.errors).length !== 0) this.props.clearErrors();
    }

    onSubmit = (e) => {
        e.preventDefault();
        const req = new CustomerLoginRequest(
            this.state.email,
            this.state.password);
        this.props.customerLogin(req, this.props.history);
    }

    render() {
        return (
            <div>
                <Breadcrumb title={'Login'}/>


                {/*Login section*/}
                <section className="login-page section-b-space">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <h3>Login</h3>
                                <div className="theme-card">
                                    <form className="theme-form" onSubmit={this.onSubmit}>
                                        <div className="form-group">
                                            <FormField onChange={this.onChange}
                                                       fieldName={"email"}
                                                       state={this.state}
                                                       errors={this.props.errors}
                                                       fieldLabel={"Email"}/>
                                        </div>
                                        <div className="form-group">
                                            <FormField onChange={this.onChange}
                                                       fieldName={"password"}
                                                       state={this.state}
                                                       errors={this.props.errors}
                                                       fieldLabel={"Password"}/>
                                        </div>
                                        <input type="submit" className="btn btn-solid" value="Login"/>
                                    </form>
                                </div>
                            </div>
                            <div className="col-lg-6 right-login">
                                <h3>Register</h3>
                                <div className="theme-card authentication-right">
                                    <h6 className="title-font">Create A Account</h6>
                                    <p>Don't have an account? Click the button below to sign up and enjoy member
                                        benefits!</p>
                                    <Link to="/register">
                                        <button className="btn btn-solid">Create an Account</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        )
    }
}

Login.propTypes = {
    errors: PropTypes.object.isRequired,
    loggedInCustomer: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    errors: state.errors,
    loggedInCustomer: state.customer.loggedInCustomer
});
const mapDispatchToProps = {
    customerLogin,
    clearErrors
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
