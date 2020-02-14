import React, {Component} from 'react';
import { Link} from 'react-router-dom';

import {SlideUpDown} from "../../../services/script"
import LogoImage from "../headers/common/logo"

class FooterThree extends Component {

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

        return <footer className="footer-light">
            <div className="dark-layout">
                <div className="container">
                    <section className="section-b-space border-b">
                        <div className="row footer-theme2">
                            <div className="col-lg-3">
                                <div className="footer-title footer-mobile-title">
                                    <h4>about</h4>
                                </div>
                                <div className="footer-contant">
                                    <div className="footer-logo">
                                        <LogoImage logo={this.props.logoName} />
                                    </div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor incididunt ut labore et.Lorem ipsum dolor sit amet, consectetur
                                        adipiscing</p>
                                </div>
                            </div>
                            <div className="col-lg-6 subscribe-wrapper">
                                <div className="subscribe-block">
                                    <h2>newsletter</h2>
                                    <form>
                                        <div className="form-group">
                                            <input type="text" className="form-control"
                                                   id="exampleFormControlInput3" placeholder="Enter your email"/>
                                            <button type="submit" className="btn btn-solid">subscribe</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="footer-title">
                                    <h4>store information</h4>
                                </div>
                                <div className="footer-contant">
                                    <ul className="contact-details">
                                        <li>Multikart Demo Store, Demo store India 345-659</li>
                                        <li>Call Us: 123-456-7898</li>
                                        <li>Email Us: <a href="#">Support@Fiot.com</a></li>
                                        <li>Fax: 123456</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <div className="dark-layout">
                <div className="container">
                    <section className="small-section">
                        <div className="row footer-theme2">
                            <div className="col p-set">
                                <div className="footer-link">
                                    <div className="footer-title">
                                        <h4>my account</h4>
                                    </div>
                                    <div className="footer-contant">
                                        <ul>
                                            <li><Link
                                                to={`${process.env.PUBLIC_URL}/left-sidebar/collection`}>womens</Link>
                                            </li>
                                            <li><Link
                                                to={`${process.env.PUBLIC_URL}/left-sidebar/collection`}>clothing</Link>
                                            </li>
                                            <li><Link
                                                to={`${process.env.PUBLIC_URL}/left-sidebar/collection`}>accessories</Link>
                                            </li>
                                            <li><Link
                                                to={`${process.env.PUBLIC_URL}/left-sidebar/collection`}>featured</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="footer-link-b">
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
                        </div>
                    </section>
                </div>
            </div>
            <div className="sub-footer darker-subfooter">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-md-6 col-sm-12">
                            <div className="footer-end">
                                <p><i className="fa fa-copyright" aria-hidden="true"></i> 2017-18 themeforest powered by
                                    pixelstrap</p>
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-6 col-sm-12">
                            <div className="payment-card-bottom">
                                <ul>
                                    <li>
                                        <Link to={'https://www.facebook.com/'}>
                                            <i className="fa fa-facebook" aria-hidden="true"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'https://plus.google.com/'}>
                                            <i className="fa fa-google-plus" aria-hidden="true"></i></Link>
                                    </li>
                                    <li>
                                        <Link to={'https://twitter.com'}>
                                            <i className="fa fa-twitter" aria-hidden="true"></i></Link>
                                    </li>
                                    <li>
                                        <Link to={'https://instagram.com'}>
                                            <i className="fa fa-instagram" aria-hidden="true"></i></Link>
                                    </li>
                                    <li>
                                        <Link to={'https://rss.com/'}>
                                            <i className="fa fa-rss" aria-hidden="true"></i></Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    }
}

export default FooterThree;