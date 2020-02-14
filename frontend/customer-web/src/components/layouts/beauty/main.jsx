import React, { Component } from 'react';
import {Helmet} from 'react-helmet'
import '../../common/index.scss';
import Slider from 'react-slick';
import {Link} from 'react-router-dom';
import Modal from 'react-responsive-modal';
import ThemeSettings from "../../common/theme-settings"

// Import custom components
import {
    svgFreeShipping,
    svgservice,
    svgoffer,
    svgpayment
} from "../../../services/script"
import TopCollection from "../common/collection"
import NewProduct from "../../common/new-product"
import Instagram from "../common/instagram"
import HeaderOne from "../../common/headers/header-one"
import FooterOne from "../../common/footers/footer-one"
import BlogSection from "../common/blogsection";

class Beauty extends Component {
    constructor(props){
        super(props)

        this.state = {
            open: false
        }
    }
    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    componentDidMount() {
        document.getElementById("color").setAttribute("href", `${process.env.PUBLIC_URL}/assets/css/color3.css` );
    }

    render(){

        return (
            <div>
                <Helmet>
                    <title>MultiKart | Beauty Store</title>
                </Helmet>
                <HeaderOne logoName={'layout3/logo.png'}/>
                <section className="p-0">
                    <Slider className="slide-1 home-slider">
                        <div>
                            <div className="home home34">
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <div className="slider-contain">
                                                <div>
                                                    <h4>welcome to beauty</h4>
                                                    <h1>beauty products</h1><a href="#" className="btn btn-solid">shop
                                                    now</a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="home home35">
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <div className="slider-contain">
                                                <div>
                                                    <h4>save 30% off</h4>
                                                    <h1>beauty products</h1><a href="#" className="btn btn-solid">shop
                                                    now</a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </section>


                {/*About Section*/}
                <section className="beauty-about">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-5 col-lg-6 col-md-12 offset-xl-1 text-center">
                                <img src={`${process.env.PUBLIC_URL}/assets/images/beauty/about-us.jpg`} alt="" className="img-fluid blur-up lazyload" />
                            </div>
                            <div className="col-xl-5 col-lg-6 col-md-12">
                                <div className="about-section">
                                    <div>
                                        <h2>about us</h2>
                                        <div className="about-text">
                                            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                                                accusantium doloremque laudantium, totam rem aperiam.sit voluptatem
                                                accusantium doloremque laudantium,totam rem aperiam.</p>
                                        </div>
                                        <div className="service small-section pb-0">
                                            <div className="row">
                                                <div className="col-sm-4 service-block1">
                                                    <div dangerouslySetInnerHTML={{ __html: svgFreeShipping }} />
                                                    <h5>free shipping</h5>
                                                </div>
                                                <div className="col-sm-4 service-block1">
                                                    <div dangerouslySetInnerHTML={{ __html: svgservice }} />
                                                    <h5>24 X 7 service</h5>
                                                </div>
                                                <div className="col-sm-4 service-block1">
                                                    <div dangerouslySetInnerHTML={{ __html: svgoffer }} />
                                                    <h5>festival offer</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/*About Section End*/}

                {/*Product slider*/}
                <TopCollection type={'beauty'} />
                {/*Product slider End*/}

                {/*Video Section*/}
                <section className="video-section pt-0">
                    <div className="title1">
                        <h4>special offer</h4>
                        <h2 className="title-inner1">product tutorial</h2>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 offset-md-2">
                                <a href="javascript:void(0)" onClick={this.onOpenModal}>
                                    <div className="video-img">
                                        <img src={`${process.env.PUBLIC_URL}/assets/images/beauty/video_1.jpg`} alt="" className="img-fluid blur-up lazyload" />
                                        <div className="play-btn">
                                            <span><i className="fa fa-play" aria-hidden="true"></i></span>
                                        </div>
                                    </div>
                                </a>
                                <Modal
                                    open={this.state.open}
                                    onClose={this.onCloseModal}
                                    id="video"
                                    className="modal fade video-modal" center>
                                    <iframe src="https://www.youtube.com/embed/FRIDLxM8Roc"
                                            allowFullScreen></iframe>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </section>
                {/*Video Section End*/}

                {/*Product slider*/}
                <TopCollection type={'beauty'} />
                {/*Product slider End*/}

                {/*Blog Section*/}
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="title1">
                                <h4>Recent Story</h4>
                                <h2 className="title-inner1">from the blog</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="blog p-t-0 ratio3_2">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <BlogSection />
                            </div>
                        </div>
                    </div>
                </section>
                {/*Blog Section end*/}


                {/*Instagram Section*/}
                <div className="section-b-space">
                    <Instagram type="watch" />
                </div>
                {/*Instagram Section End*/}

                <FooterOne logoName={'layout3/logo.png'}/>

                <ThemeSettings />
            </div>
        )
    }
}


export default Beauty;