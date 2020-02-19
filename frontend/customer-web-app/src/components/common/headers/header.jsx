import React, {Component} from 'react';
import Pace from 'react-pace-progress';
import {Link} from "react-router-dom";
// Import custom components
import NavBar from "./common/navbar";
import CartContainer from "../../../containers/cart-container";
import TopBarDark from "./common/topbar-dark";
import {connect} from "react-redux";
import LogoImage from "./common/logo";

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        }
    }

    /*=====================
         Pre loader
         ==========================*/
    componentDidMount() {
        setTimeout(function () {
            document.querySelector(".loader-wrapper").style = "display: none";
        }, 2000);
    }

    componentWillMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        let number = window.pageXOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

        if (number >= 300) {
            if (window.innerWidth < 576) {
                document.getElementById("sticky").classList.remove('fixed');
            } else
                document.getElementById("sticky").classList.add('fixed');
        } else {
            document.getElementById("sticky").classList.remove('fixed');
        }
    };


    openNav() {
        const openmyslide = document.getElementById("mySidenav");
        if (openmyslide) {
            openmyslide.classList.add('open-side')
        }
    }

    openSearch() {
        document.getElementById("search-overlay").style.display = "block";
    }

    closeSearch() {
        document.getElementById("search-overlay").style.display = "none";
    }

    load = () => {
        this.setState({isLoading: true});
        fetch().then(() => {
            // deal with data fetched
            this.setState({isLoading: false})
        })
    };

    render() {

        return (
            <div>
                <header id="sticky" className="header-2 header-6">
                    {this.state.isLoading ? <Pace color="#27ae60"/> : null}
                    <div className="mobile-fix-option"/>
                    {/*Top Header Component*/}
                    {/*<TopBarDark/>*/}

                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="main-menu border-section border-top-0">
                                    <div className="brand-logo layout2-logo">
                                        <LogoImage logo={this.props.logoName}/>
                                    </div>
                                    <div>
                                        <form className="form_search" role="form">
                                            <input id="query search-autocomplete" type="search"
                                                   placeholder="Search for products"
                                                   className="nav-search nav-search-field" aria-expanded="true"/>
                                            <button type="submit" name="nav-submit-button" className="btn-search">
                                                <i className="fa fa-search"/>
                                            </button>
                                        </form>
                                    </div>
                                    <div className="menu-right pull-right">
                                        <div>
                                            <div className="icon-nav">
                                                <ul>
                                                    <li className="onhover-div mobile-search">
                                                        <div><img
                                                            src={`${process.env.PUBLIC_URL}/assets/images/icon/search.png`}
                                                            onClick={this.openSearch} className="img-fluid" alt=""/>
                                                            <i className="fa fa-search" onClick={this.openSearch}/>
                                                        </div>
                                                    </li>
                                                    <li className="onhover-div mobile-account">
                                                        <i className="fa fa-user" aria-hidden="true"/> My Account
                                                        <ul className="show-div shopping-cart">
                                                            <div className="buttons">
                                                                <Link to="/login">Login</Link>

                                                                <Link to="/register">Register</Link>
                                                            </div>
                                                        </ul>
                                                    </li>
                                                    <CartContainer/>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="main-nav-center">
                                    <NavBar/>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div id="search-overlay" className="search-overlay">
                    <div>
                        <span className="closebtn" onClick={this.closeSearch} title="Close Overlay">×</span>
                        <div className="overlay-content">
                            <div className="container">
                                <div className="row">
                                    <div className="col-xl-12">
                                        <form>
                                            <div className="form-group">
                                                <input type="text" className="form-control" id="exampleInputPassword1"
                                                       placeholder="Search a Product"/>
                                            </div>
                                            <button type="submit" className="btn btn-primary"><i
                                                className="fa fa-search"></i></button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null,
    {}
)(Header);
