import React, { Component } from 'react';
import {Helmet} from 'react-helmet'
import '../../common/index.scss';
import Slider from 'react-slick';
import {
    Slider4,
    svgFreeShipping,
    svgservice,
    svgoffer,
    svgpayment} from '../../../services/script'

// Import custom components
import LogoBlocks from "../common/logo-block"
import BlogSection from "../common/blogsection"
import Trending from "./trending";
import TrandingCollection from "../common/collection"
import Special from "../common/special";
import Instagram from "../common/instagram"
import HeaderFive from "../../common/headers/header-five"
import FooterFour from "../../common/footers/footer-four";
import ThemeSettings from "../../common/theme-settings"


class Watch extends Component {

    componentDidMount() {
        document.getElementById("color").setAttribute("href", `${process.env.PUBLIC_URL}/assets/css/color4.css` );
    }

    render(){
        return (
            <div>
                <Helmet>
                    <title>MultiKart | Watch Store</title>
                </Helmet>
                <HeaderFive logoName={'layout4/logo.png'} />
                <section className="p-0 small-slider">
                    <Slider className="slide-1 home-slider">
                        <div>
                            <div className="home home9 text-left p-left">
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <div className="slider-contain">
                                                <div>
                                                    <h4>every time</h4>
                                                    <h1>mittnalier</h1>
                                                    <a href="#" className="btn btn-outline btn-classic">shop now</a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="home home10 text-left p-left">
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <div className="slider-contain">
                                                <div>
                                                    <h4>welcome to fashion</h4>
                                                    <h1>men's shoes</h1>
                                                    <a href="#" className="btn btn-outline btn-classic">shop now</a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="home home11 text-left p-left">
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <div className="slider-contain">
                                                <div>
                                                    <h4>welcome to fashion</h4>
                                                    <h1>men's shoes</h1>
                                                    <a href="#" className="btn btn-outline btn-classic">shop now</a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </section>

                {/*Logo Blocks section*/}
                <LogoBlocks />
                {/*Logo Blocks section end*/}

                {/*Timer Banner*/}
                <section className="pt-0">
                    <div className="container">
                        <div className="row banner-timer">
                            <div className="col-md-6">
                                <div className="banner-text">
                                    <h2>Save <span>30% off</span> Digital Watch</h2>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="timer-box">
                                    <div className="timer">
                                        <p id="demo"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/*Timer Banner End*/}

                {/*category wrapper*/}
                <section className="section-b-space ratio_portrait">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <Slider {...Slider4} className="slide-4 category-m no-arrow">
                                    <div>
                                        <div className="category-wrapper">
                                            <div>
                                                <div>
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/watch/cat1.png`}
                                                         className="img-fluid blur-up lazyload bg-img" alt="" />
                                                </div>
                                                <h4>watch models</h4>
                                                <ul className="category-link">
                                                    <li><a href="#">d1 milano</a></li>
                                                    <li><a href="#">damaskeening</a></li>
                                                    <li><a href="#">diving watch</a></li>
                                                    <li><a href="#">dollar watch</a></li>
                                                </ul>
                                                <a href="#" className="btn btn-outline">view more</a></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="category-wrapper">
                                            <div>
                                                <div>
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/watch/cat2.png`}
                                                         className="img-fluid blur-up lazyload bg-img" alt="" />
                                                </div>
                                                <h4>calculator watch</h4>
                                                <ul className="category-link">
                                                    <li><a href="#">Shock-resistant watch</a></li>
                                                    <li><a href="#">Skeleton watch</a></li>
                                                    <li><a href="#">Slow watch</a></li>
                                                    <li><a href="#">Solar-powered watch</a></li>
                                                </ul>
                                                <a href="#" className="btn btn-outline">view more</a></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="category-wrapper">
                                            <div>
                                                <div>
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/watch/cat3.png`}
                                                         className="img-fluid blur-up lazyload bg-img" alt="" />
                                                </div>
                                                <h4>Antimagnetic watch</h4>
                                                <ul className="category-link">
                                                    <li><a href="#">Watchmaking conglomerates</a></li>
                                                    <li><a href="#">Breitling SA</a></li>
                                                    <li><a href="#">Casio watches</a></li>
                                                    <li><a href="#">Citizen Watch</a></li>
                                                </ul>
                                                <a href="#" className="btn btn-outline">view more</a></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="category-wrapper">
                                            <div>
                                                <div>
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/watch/cat2.png`}
                                                         className="img-fluid blur-up lazyload bg-img" alt="" />
                                                </div>
                                                <h4>History of watches</h4>
                                                <ul className="category-link">
                                                    <li><a href="#">Manufacture d'horlogerie</a></li>
                                                    <li><a href="#">Mechanical watch</a></li>
                                                    <li><a href="#">Microbrand watches</a></li>
                                                    <li><a href="#">MIL-W-46374</a></li>
                                                </ul>
                                                <a href="#" className="btn btn-outline">view more</a></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="category-wrapper">
                                            <div>
                                                <div>
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/watch/cat1.png`}
                                                         className="img-fluid blur-up lazyload bg-img" alt="" />
                                                </div>
                                                <h4>watch models</h4>
                                                <ul className="category-link">
                                                    <li><a href="#">d1 milano</a></li>
                                                    <li><a href="#">damaskeening</a></li>
                                                    <li><a href="#">diving watch</a></li>
                                                    <li><a href="#">dollar watch</a></li>
                                                </ul>
                                                <a href="#" className="btn btn-outline">view more</a></div>
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                        </div>
                    </div>
                </section>
                {/*category wrapper end*/}

                {/*Special Products Start*/}
                <Trending type={'watch'} />
                {/*Special Products End*/}

                {/* Parallax banner*/}
                <TrandingCollection type={'watch'} />
                {/* Parallax banner end*/}

                {/*Content Banner*/}
                <section className="ratio_45">
                    <div className="container">
                        <div className="row partition3">
                            <div className="col-md-4">
                                <a href="#">
                                    <div className="collection-banner p-left">
                                        <div className="img-part">
                                            <img src={`${process.env.PUBLIC_URL}/assets/images/banner1.jpg`}
                                                 className="img-fluid blur-up lazyload bg-img" alt="" />
                                        </div>
                                        <div className="contain-banner banner-3">
                                            <div>
                                                <h4>minimum 10% off</h4>
                                                <h2>new watch</h2>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="col-md-4">
                                <a href="#">
                                    <div className="collection-banner p-left text-left">
                                        <div className="img-part">
                                            <img src={`${process.env.PUBLIC_URL}/assets/images/banner2.jpg`}
                                                 className="img-fluid blur-up lazyload bg-img" alt="" />
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="col-md-4">
                                <a href="#">
                                    <div className="collection-banner p-left">
                                        <div className="img-part">
                                            <img src={`${process.env.PUBLIC_URL}/assets/images/banner.jpg`}
                                                 className="img-fluid blur-up lazyload bg-img" alt="" />
                                        </div>
                                        <div className="contain-banner banner-3">
                                            <div>
                                                <h4>minimum 50% off</h4>
                                                <h2>gold watch</h2>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                {/*Content Banner End*/}

                <Special type={'watch'} />

                {/* Blog Section Section*/}
                <section className="blog blog-bg section-b-space ratio2_3">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="title4">
                                    <h4>our collection</h4>
                                    <h2 className="title-inner4">special products</h2>
                                    <div className="line"><span></span></div>
                                </div>
                                <BlogSection />
                            </div>
                        </div>
                    </div>
                </section>
                {/* Blog Section End*/}

                {/*Service Layout*/}
                <div className="container">
                    <section className="service section-b-space border-section border-top-0">
                        <div className="row partition4">
                            <div className="col-lg-3 col-md-6 service-block1">
                                <div dangerouslySetInnerHTML={{ __html: svgFreeShipping }} />
                                <h4>free shipping</h4>
                                <p>Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
                            </div>
                            <div className="col-lg-3 col-md-6 service-block1">
                                <div dangerouslySetInnerHTML={{ __html: svgservice }} />
                                <h4>24 X 7 service</h4>
                                <p>Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
                            </div>
                            <div className="col-lg-3 col-md-6 service-block1">
                                <div dangerouslySetInnerHTML={{ __html: svgoffer }} />
                                <h4>festival offer</h4>
                                <p>Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
                            </div>
                            <div className="col-lg-3 col-md-6 service-block1">
                                <div dangerouslySetInnerHTML={{ __html: svgpayment }} />
                                <h4>online payment</h4>
                                <p>Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
                            </div>
                        </div>
                    </section>
                </div>
                {/*Service Layout End*/}

                <Instagram type="watch"/>
                <ThemeSettings/>

                <FooterFour logoName={'layout4/footerlogo.png'} />

            </div>
        )
    }
}


export default Watch;