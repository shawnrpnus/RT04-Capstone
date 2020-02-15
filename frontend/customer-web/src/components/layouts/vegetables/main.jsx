import React, { Component } from 'react';
import {Helmet} from 'react-helmet'
import '../../common/index.scss';
import Slider from 'react-slick';
import {Link} from 'react-router-dom';

// Import custom components
import {Slider3} from "../../../services/script"
import Trading from "./tranding"
import Special from "../common/special"
import {
    svgFreeShipping,
    svgservice,
    svgoffer
} from "../../../services/script"
import HeaderTwo from "../../common/headers/header-two"
import FooterOne from "../../common/footers/footer-one"
import ThemeSettings from "../../common/theme-settings"

class Vegetables extends Component {

    componentDidMount() {
        document.getElementById("color").setAttribute("href", `#` );
    }
    render(){
        return (
            <div>
                <Helmet>
                    <title>MultiKart | Vegetable Store</title>
                </Helmet>
                <HeaderTwo logoName={'logo.png'} />
                <section className="p-0">
                    <Slider className="slide-1 home-slider">
                        <div>
                            <div className="home home39 text-center">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col">
                                                <div className="slider-contain">
                                                    <div>
                                                        <h4>save 10%</h4>
                                                        <h1>fresh vegetables</h1><a href="#" className="btn btn-solid">shop
                                                        now</a></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                        <div>
                            <div className="home home38 text-center">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col">
                                                <div className="slider-contain">
                                                    <div>
                                                        <h4>save upto 10%</h4>
                                                        <h1>fresh vegetables</h1><a href="#" className="btn btn-solid">shop
                                                        now</a></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </Slider>
                </section>

                {/*collection banner layout*/}
                <section className="banner-padding absolute-banner pb-0">
                    <div className="container absolute-bg">
                        <div className="service p-0">
                            <div className="row">
                                <div className="col-md-4 service-block">
                                    <div className="media">
                                        <div dangerouslySetInnerHTML={{ __html: svgFreeShipping }} />
                                        <div className="media-body">
                                            <h4>free shipping</h4>
                                            <p>free shipping world wide</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 service-block">
                                    <div className="media">
                                        <div dangerouslySetInnerHTML={{ __html: svgservice }} />
                                        <div className="media-body">
                                            <h4>24 X 7 service</h4>
                                            <p>online service for new customer</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 service-block">
                                    <div className="media">
                                        <div dangerouslySetInnerHTML={{ __html: svgoffer }} />
                                        <div className="media-body">
                                            <h4>festival offer</h4>
                                            <p>new online special festival offer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/*collection banner layout end*/}

                {/*product section Start*/}
                <Trading type={'vegetable'} />
                {/*product section End*/}

                {/*Parallax banner*/}
                <section className="p-0">
                    <div className="full-banner parallax-banner15 parallax text-left p-left">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <div className="banner-contain">
                                        <h2>2018</h2>
                                        <h3>food market</h3>
                                        <h4>special offer</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/*Parallax banner end*/}

                {/*product-box slider*/}
                <Special type={'vegetable'} />
                {/*product-box slider end*/}

                {/*Blog Section*/}
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="title4">
                                <h4>recent story</h4>
                                <h2 className="title-inner4">from the blog</h2>
                                <div className="line"><span></span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="blog section-b-space pt-0 ratio2_3">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <Slider {...Slider3} className="slide-3 no-arrow">
                                    <div className="col-md-12">
                                        <a href="#">
                                            <div className="classic-effect">
                                                <div>
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/vegetables/blog/1.jpg`}
                                                         className="img-fluid blur-up lazyload bg-img" alt="" />
                                                </div>
                                                <span></span>
                                            </div>
                                        </a>
                                        <div className="blog-details">
                                            <h4>25 January 2018</h4>
                                            <a href="#">
                                                <p>Lorem ipsum dolor sit consectetur adipiscing elit,</p>
                                            </a>
                                            <hr className="style1" />
                                                <h6>by: John Dio , 2 Comment</h6>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <a href="#">
                                            <div className="classic-effect">
                                                <div>
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/vegetables/blog/2.jpg`}
                                                         className="img-fluid blur-up lazyload bg-img" alt="" />
                                                </div>
                                                <span></span>
                                            </div>
                                        </a>
                                        <div className="blog-details">
                                            <h4>25 January 2018</h4>
                                            <a href="#">
                                                <p>Lorem ipsum dolor sit consectetur adipiscing elit,</p>
                                            </a>
                                            <hr className="style1" />
                                                <h6>by: John Dio , 2 Comment</h6>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <a href="#">
                                            <div className="classic-effect">
                                                <div>
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/vegetables/blog/3.jpg`}
                                                         className="img-fluid blur-up lazyload bg-img" alt="" />
                                                </div>
                                                <span></span>
                                            </div>
                                        </a>
                                        <div className="blog-details">
                                            <h4>25 January 2018</h4>
                                            <a href="#">
                                                <p>Lorem ipsum dolor sit consectetur adipiscing elit,</p>
                                            </a>
                                            <hr className="style1" />
                                                <h6>by: John Dio , 2 Comment</h6>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <a href="#">
                                            <div className="classic-effect">
                                                <div>
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/vegetables/blog/4.jpg`}
                                                         className="img-fluid blur-up lazyload bg-img" alt="" />
                                                </div>
                                                <span></span>
                                            </div>
                                        </a>
                                        <div className="blog-details">
                                            <h4>25 January 2018</h4>
                                            <a href="#">
                                                <p>Lorem ipsum dolor sit consectetur adipiscing elit,</p>
                                            </a>
                                            <hr className="style1" />
                                                <h6>by: John Dio , 2 Comment</h6>
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                        </div>
                    </div>
                </section>
                {/*Blog Section End*/}
                <ThemeSettings/>
                <FooterOne logoName={'logo.png'} />
            </div>
        )
    }
}


export default Vegetables