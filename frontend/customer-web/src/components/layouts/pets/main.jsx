import React, { Component } from 'react';
import {Helmet} from 'react-helmet'
import '../../common/index.scss';
import Slider from 'react-slick';

// Import custom components
import Collection from "./collection"
import LogoBlock from "../common/logo-block"
import BlogSection from "../common/blogsection";
import HeaderThree from "../../common/headers/header-three"
import FooterTwo from "../../common/footers/footer-two"
import ThemeSettings from "../../common/theme-settings"


class Pets extends Component {

    componentDidMount() {
        document.getElementById("color").setAttribute("href", `${process.env.PUBLIC_URL}/assets/css/color15.css` );
    }

    render(){
        return (
            <div>
                <Helmet>
                    <title>MultiKart | Pets Store</title>
                </Helmet>
                <HeaderThree logoName={'logo/14.png'} />
                <section className="p-0 small-slider">
                    <Slider className="slide-1 home-slider">
                        <div>
                            <div className="home home46">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col">
                                                <div className="slider-contain">
                                                    <div>
                                                        <h4>every pet is different</h4>
                                                        <h1>let's shop</h1>
                                                        <a href="#" className="btn btn-solid">shop now</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                        <div>
                            <div className="home home45">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col">
                                                <div className="slider-contain">
                                                    <div>
                                                        <h4>Any thing that pets want</h4>
                                                        <h1>save 20%</h1>
                                                        <a href="#" className="btn btn-solid">shop now</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </Slider>
                </section>

                {/*Logo Block section*/}
                <LogoBlock />
                {/*Logo Block section end*/}

                {/*Banner Section*/}
                <section className="pt-0 banner-6 ratio2_1">
                    <div className="container">
                        <div className="row partition3">
                            <div className="col-md-4">
                                <a href="#">
                                    <div className="collection-banner p-left">
                                        <div className="img-part">
                                            <img src={`${process.env.PUBLIC_URL}/assets/images/pets/banner/1.jpg`}
                                                 className="img-fluid blur-up lazyload bg-img" alt="" />
                                        </div>
                                        <div className="contain-banner banner-3">
                                            <div>
                                                <h2>Clothes</h2>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="col-md-4">
                                <a href="#">
                                    <div className="collection-banner p-right text-right">
                                        <div className="img-part">
                                            <img src={`${process.env.PUBLIC_URL}/assets/images/pets/banner/2.jpg`}
                                                 className="img-fluid blur-up lazyload bg-img" alt="" />
                                        </div>
                                        <div className="contain-banner banner-3">
                                            <div>
                                                <h2>Groom</h2>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="col-md-4">
                                <a href="#">
                                    <div className="collection-banner p-left">
                                        <div className="img-part">
                                            <img src={`${process.env.PUBLIC_URL}/assets/images/pets/banner/3.jpg`}
                                                 className="img-fluid blur-up lazyload bg-img" alt="" />
                                        </div>
                                        <div className="contain-banner banner-3">
                                            <div>
                                                <h2>food</h2>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="row partition3 banner-top-cls">
                            <div className="col-md-4">
                                <a href="#">
                                    <div className="collection-banner p-right">
                                        <div className="img-part">
                                            <img src={`${process.env.PUBLIC_URL}/assets/images/pets/banner/4.jpg`}
                                                 className="img-fluid blur-up lazyload bg-img" alt="" />
                                        </div>
                                        <div className="contain-banner banner-3">
                                            <div>
                                                <h2>Home</h2>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="col-md-4">
                                <a href="#">
                                    <div className="collection-banner p-right text-right">
                                        <div className="img-part">
                                            <img src={`${process.env.PUBLIC_URL}/assets/images/pets/banner/5.jpg`}
                                                 className="img-fluid blur-up lazyload bg-img" alt="" />
                                        </div>
                                        <div className="contain-banner banner-3">
                                            <div>
                                                <h2>cats</h2>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="col-md-4">
                                <a href="#">
                                    <div className="collection-banner p-right">
                                        <div className="img-part">
                                            <img src={`${process.env.PUBLIC_URL}/assets/images/pets/banner/6.jpg`}
                                                 className="img-fluid blur-up lazyload bg-img" alt="" />
                                        </div>
                                        <div className="contain-banner banner-3">
                                            <div>
                                                <h2>bowls</h2>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                {/*Banner Section End*/}

                {/*Product Section*/}
                <Collection type={'pets'} title="TOP COLLECTION" subtitle="Special Offer"/>
                {/*Product Section End*/}

                {/*Parallax banner*/}
                <section className="p-0 pet-parallax">
                    <div className="full-banner parallax parallax-banner19  text-center p-center">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <div className="banner-contain">
                                        <h4>choose what you love</h4>
                                        <h3>get upto 70% off</h3>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting
                                            industry. Lorem Ipsum has been the industry's standard dummy text ever
                                            since the 1500s, when an unknown printer took a galley of type and
                                            scrambled it to make
                                            a type specimen book. </p>
                                        <a href="#" className="btn btn-solid black-btn" tabIndex="0">shop now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pet-decor">
                            <img src={`${process.env.PUBLIC_URL}/assets/images/dog.png`} alt="" className="img-fluid blur-up lazyload" />
                        </div>
                    </div>
                </section>
                {/*Parallax banner end*/}

                {/*Product Slider*/}
                <Collection type={'pets'} title="SAVE AND EXTRA" />
                {/*Product Slider End*/}

                {/* Blog Section Section*/}
                <div className="container ">
                    <div className="row">
                        <div className="col">
                            <div className="title1 title5">
                                <h4>Recent Story</h4>
                                <h2 className="title-inner1">from the blog</h2>
                                <hr role="tournament6" />
                            </div>
                        </div>
                    </div>
                </div>
                <section className="section-b-space p-t-0 ratio2_3">
                    <BlogSection />
                </section>
                {/* Blog Section End*/}
                <ThemeSettings/>
                <FooterTwo logoName={'logo/14.png'}/>
            </div>
        )
    }
}


export default Pets;