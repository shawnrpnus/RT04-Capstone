import React, {Component} from 'react';
import { Link} from 'react-router-dom';

import {SlideUpDown} from "../../../services/script"
import LogoImage from "../headers/common/logo"

class FooterOne extends Component {

    componentDidMount(){
        var contentwidth = window.innerWidth;
        if ((contentwidth) < 750) {
            SlideUpDown('footer-title');
        } else {
            var elems = document.querySelectorAll(".footer-title");
            [].forEach.call(elems, function(elemt) {
                let el = elemt.nextElementSibling;
                el.style = "display: block";
            });
        }
    }


    render () {

        return (
            <footer className="footer-light">
                <div className="light-layout">
                    <div className="container">
                        <section className="small-section border-section border-top-0">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="subscribe">
                                        <div>
                                            <h4>KNOW IT ALL FIRST!</h4>
                                            <p>Never Miss Anything From Multikart By Signing Up To Our Newsletter. </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <form className="form-inline subscribe-form">
                                        <div className="form-group mx-sm-3">
                                            <input type="text" className="form-control" id="exampleFormControlInput1"
                                                   placeholder="Enter your email"/>
                                        </div>
                                        <button type="submit" className="btn btn-solid">subscribe</button>
                                    </form>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <section className="section-b-space light-layout">
                    <div className="container">
                        <div className="row footer-theme partition-f">
                            <div className="col-lg-4 col-md-6">
                                <div className="footer-title footer-mobile-title">
                                    <h4>about</h4>
                                </div>
                                <div className="footer-contant">
                                    <div className="footer-logo">
                                        <LogoImage logo={this.props.logoName} />
                                    </div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, </p>
                                    <div className="footer-social">
                                        <ul>
                                            <li>
                                                <Link to={'https://www.facebook.com/'} ><i className="fa fa-facebook" aria-hidden="true"></i></Link>
                                            </li>
                                            <li>
                                                <Link to={'https://plus.google.com/'} ><i className="fa fa-google-plus" aria-hidden="true"></i></Link>
                                            </li>
                                            <li>
                                                <Link to={'https://twitter.com'}><i className="fa fa-twitter" aria-hidden="true"></i></Link>
                                            </li>
                                            <li>
                                                <Link to={'https://instagram.com'}><i className="fa fa-instagram" aria-hidden="true"></i></Link>
                                            </li>
                                            <li>
                                                <Link to={'https://rss.com/'}><i className="fa fa-rss" aria-hidden="true"></i></Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col offset-xl-1">
                                <div className="sub-title">
                                    <div className="footer-title">
                                        <h4>my account</h4>
                                    </div>
                                    <div className="footer-contant">
                                        <ul>
                                            <li><Link to={`${process.env.PUBLIC_URL}/left-sidebar/collection`} >womens</Link></li>
                                            <li><Link to={`${process.env.PUBLIC_URL}/left-sidebar/collection`} >clothing</Link></li>
                                            <li><Link to={`${process.env.PUBLIC_URL}/left-sidebar/collection`} >accessories</Link></li>
                                            <li><Link to={`${process.env.PUBLIC_URL}/left-sidebar/collection`} >featured</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="sub-title">
                                    <div className="footer-title">
                                        <h4>why we choose</h4>
                                    </div>
                                    <div className="footer-contant">
                                        <ul>
                                            <li><a href="#">shipping & return</a></li>
                                            <li><a href="#">secure shopping</a></li>
                                            <li><a href="#">gallary</a></li>
                                            <li><a href="#">affiliates</a></li>
                                            <li><a href="#">contacts</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="sub-title">
                                    <div className="footer-title">
                                        <h4>store information</h4>
                                    </div>
                                    <div className="footer-contant">
                                        <ul className="contact-list">
                                            <li><i className="fa fa-map-marker"></i>Multikart Demo Store, Demo store
                                                India 345-659
                                            </li>
                                            <li><i className="fa fa-phone"></i>Call Us: 123-456-7898</li>
                                            <li><i className="fa fa-envelope-o"></i>Email Us: <a
                                                href="#">Support@Fiot.com</a></li>
                                            <li><i className="fa fa-fax"></i>Fax: 123456</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="sub-footer ">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-6 col-md-6 col-sm-12">
                                <div className="footer-end">
                                    <p><i className="fa fa-copyright" aria-hidden="true"></i> 2018-19 themeforest
                                        powered by pixelstrap</p>
                                </div>
                            </div>
                            <div className="col-xl-6 col-md-6 col-sm-12">
                                <div className="payment-card-bottom">
                                    <ul>
                                        <li>
                                            <a href="#"><img src={`${process.env.PUBLIC_URL}/assets/images/icon/visa.png`} alt="" /></a>
                                        </li>
                                        <li>
                                            <a href="#"><img src={`${process.env.PUBLIC_URL}/assets/images/icon/mastercard.png`} alt="" /></a>
                                        </li>
                                        <li>
                                            <a href="#"><img src={`${process.env.PUBLIC_URL}/assets/images/icon/paypal.png`} alt="" /></a>
                                        </li>
                                        <li>
                                            <a href="#"><img src={`${process.env.PUBLIC_URL}/assets/images/icon/american-express.png`} alt="" /></a>
                                        </li>
                                        <li>
                                            <a href="#"><img src={`${process.env.PUBLIC_URL}/assets/images/icon/discover.png`} alt="" /></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default FooterOne;