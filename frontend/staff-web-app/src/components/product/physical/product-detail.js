import React, { Component, Fragment } from 'react'
import Breadcrumb from '../../common/breadcrumb';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from 'react-responsive-modal';
import StarRatingComponent from 'react-star-rating-component';


// image import
import two from '../../../assets/images/pro3/2.jpg';
import twentySeven from '../../../assets/images/pro3/27.jpg';
import one from '../../../assets/images/pro3/1.jpg';
import size_chart from '../../../assets/images/size-chart.jpg'

export class ProductDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            quantity: 1,
            rating: 1,
            open: false,
            nav1: null,
            nav2: null,
        }
    }
    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };
    onStarClick(nextValue, prevValue, name) {
        this.setState({ rating: nextValue });
    }
    onStarHover(nextValue, prevValue, name) {
        this.setState({ rating: nextValue });
    } /* on icon hover handler */
    onStarHoverOut(nextValue, prevValue, name) {
        this.setState({ rating: nextValue });
    }
    IncrementItem = () => {
        this.setState(prevState => {
            if (prevState.quantity < 9) {
                return {
                    quantity: prevState.quantity + 1
                }
            } else {
                return null;
            }
        });
    }
    DecreaseItem = () => {
        this.setState(prevState => {
            if (prevState.quantity > 0) {
                return {
                    quantity: prevState.quantity - 1
                }
            } else {
                return null;
            }
        });
    }
    handleChange = (event) => {
        this.setState({ quantity: event.target.value });
    }
    componentDidMount() {
        this.setState({
            nav1: this.slider1,
            nav2: this.slider2
        });
    }
    render() {
        const { open } = this.state;
        const { rating } = this.state;
        return (

            <Fragment>
                <Breadcrumb title="Product Detail" parent="Physical" />

                <div className="container-fluid">
                    <div className="card">
                        <div className="row product-page-main card-body">
                            <div className="col-xl-4">
                                <Slider asNavFor={this.state.nav2} ref={slider => (this.slider1 = slider)}
                                    className="product-slider">
                                    <div className="item">
                                        <img className="img-fluid" src={one} alt="" />
                                    </div>
                                    <div className="item">
                                        <img className="img-fluid" src={twentySeven} alt="" />
                                    </div>
                                    <div className="item">
                                        <img className="img-fluid" src={two} alt="" />
                                    </div>
                                    <div className="item">
                                        <img className="img-fluid" src={one} alt="" />
                                    </div>
                                    <div className="item">
                                        <img className="img-fluid" src={twentySeven} alt="" />
                                    </div>
                                </Slider>

                                <Slider
                                    asNavFor={this.state.nav1}
                                    ref={slider => (this.slider2 = slider)}
                                    slidesToShow={4}
                                    swipeToSlide={true}
                                    focusOnSelect={true}
                                    className="small-slick"
                                >
                                    <div className="item">
                                        <img className="img-fluid" src={one} alt="" />
                                    </div>
                                    <div className="item">
                                        <img className="img-fluid" src={twentySeven} alt="" />
                                    </div>
                                    <div className="item">
                                        <img className="img-fluid" src={two} alt="" />
                                    </div>
                                    <div className="item">
                                        <img className="img-fluid" src={twentySeven} alt="" />
                                    </div>
                                    <div className="item">
                                        <img className="img-fluid" src={one} alt="" />
                                    </div>
                                </Slider>
                            </div>
                            <div className="col-xl-8">
                                <div className="product-page-details product-right mb-0">
                                    <h2>WOMEN PINK SHIRT</h2>
                                    <div style={{ fontSize: 27, height: 31 }}>
                                        <StarRatingComponent
                                            name="rate1"
                                            starCount={5}
                                            value={rating}
                                            onStarClick={this.onStarClick.bind(this)}
                                            onStarHover={this.onStarHover.bind(this)}
                                            onStarHoverOut={this.onStarHoverOut.bind(this)}
                                        />
                                    </div>
                                    <hr />
                                    <h6 className="product-title">product details</h6>
                                    <p>Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem,</p>
                                    <div className="product-price digits mt-2">
                                        <h3>$26.00 <del>$350.00</del></h3>
                                    </div>
                                    <ul className="color-variant">
                                        <li className="bg-light0"></li>
                                        <li className="bg-light1"></li>
                                        <li className="bg-light2"></li>
                                    </ul>
                                    <hr />
                                    <h6 className="product-title size-text">select size
                                        <span className="pull-right">
                                            <a data-toggle="modal" data-target="#sizemodal" onClick={this.onOpenModal}>size chart</a>
                                        </span>
                                    </h6>
                                    <Modal open={open} onClose={this.onCloseModal}>
                                        <div>
                                            <img src={size_chart} alt="" className="img-fluid blur-up lazyloaded" />
                                        </div>
                                    </Modal>
                                    <div className="size-box">
                                        <ul>
                                            <li className="active"><a href="#">s</a></li>
                                            <li><a href="#">m</a></li>
                                            <li><a href="#">l</a></li>
                                            <li><a href="#">xl</a></li>
                                        </ul>
                                    </div>
                                    <div className="add-product-form">
                                        <h6 className="product-title">quantity</h6>
                                        <fieldset className="qty-box mt-2 ml-0">
                                            <div className="input-group bootstrap-touchspin">
                                                <div className="input-group-prepend">
                                                    <button className="btn btn-primary btn-square bootstrap-touchspin-down" type="button" onClick={this.DecreaseItem} >
                                                        <i className="fa fa-minus"></i>
                                                    </button>
                                                </div>
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bootstrap-touchspin-prefix" ></span>
                                                </div>
                                                <input className="touchspin form-control" type="text" value={this.state.quantity} onChange={this.handleChange} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text bootstrap-touchspin-postfix"></span>
                                                </div>
                                                <div className="input-group-append ml-0">
                                                    <button className="btn btn-primary btn-square bootstrap-touchspin-up" type="button" onClick={this.IncrementItem}>
                                                        <i className="fa fa-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <hr />
                                    <h6 className="product-title">Time Reminder</h6>
                                    <div className="timer">
                                        <p id="demo"><span>25 <span className="padding-l">:</span> <span className="timer-cal">Days</span> </span><span>22 <span className="padding-l">:</span> <span className="timer-cal">Hrs</span> </span><span>13 <span className="padding-l">:</span> <span className="timer-cal">Min</span> </span><span>57 <span className="timer-cal">Sec</span></span>
                                        </p>
                                    </div>
                                    <div className="m-t-15">
                                        <button className="btn btn-primary m-r-10" type="button">Add To Cart</button>
                                        <button className="btn btn-secondary" type="button">Buy Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Fragment>
        )
    }
}

export default ProductDetail
