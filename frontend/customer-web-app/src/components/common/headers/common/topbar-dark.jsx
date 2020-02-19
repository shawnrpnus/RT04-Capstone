import React, {Component} from 'react';

class TopBarDark extends Component {


    render() {
        return (
            <div className="top-header top-header-dark3">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="header-contact">
                                <ul>
                                    <li>Welcome to Our store Multikart</li>
                                    <li><i className="fa fa-phone" aria-hidden="true" />Call Us: 123 - 456 - 7890</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6 text-right">
                            <ul className="header-dropdown">
                                <li className="mobile-wishlist"><a href="#"><i className="fa fa-heart"
                                    aria-hidden="true" /> wishlist</a></li>
                                <li className="onhover-dropdown mobile-account">
                                    <i className="fa fa-user" aria-hidden="true" /> My Account
                                    <ul className="onhover-show-div">
                                        <div>
                                            <li>
                                                <a href="#" data-lng="en">
                                                    Login
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" data-lng="es">
                                                    Register
                                                </a>
                                            </li>
                                        </div>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default TopBarDark;
