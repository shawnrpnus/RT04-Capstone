import React, { PureComponent, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  ButtonToolbar,
  Button,
  ButtonGroup
} from "reactstrap";
import HeartIcon from "mdi-react/HeartIcon";
import StarIcon from "mdi-react/StarIcon";
import StarOutlineIcon from "mdi-react/StarOutlineIcon";
import { Link, withRouter } from "react-router-dom";
import ProductGallery from "./ProductGallery";
import images from "./imgs";
import ProductTabs from "./ProductTabs";
import ColorSelect from "./ColorSelect";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Switch from "@material-ui/core/Switch";
import Row from "reactstrap/es/Row";
import * as PropTypes from "prop-types";
import { clearErrors, createNewStore } from "../../../../redux/actions";
import { connect } from "react-redux";
import { retrieveProductById } from "../../../../redux/actions/productActions";

class ProductCard extends PureComponent {
  static propTypes = {
    product: PropTypes.object,
    errors: PropTypes.object,
    retrieveProductById: PropTypes.func.isRequired
  };

  state = {
    product: {},
    selectedColor: "",
    selectedSize: "",
    uploadImage: false
  };

  componentDidMount() {
    const product = this.props.retrieveProductById(this.props.match.params.id);
    this.setState({ product })
  }

  render() {
    console.log(this.props.currentProduct)
    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <div className="product-card">
              <ProductGallery images={images} />
              <div className="product-card__info">
                <Row>
                  <Col xs={5} md={8}>
                    <h3 className="product-card__title">
                      French bulldog pillow
                    </h3>
                  </Col>
                  <Col xs={2} md={1}>
                    <Switch
                      checked={null}
                      onChange={null}
                      value="checkedB"
                      color="primary"
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  </Col>
                  <Col xs={2} md={1}>
                    <Switch
                      checked={null}
                      onChange={null}
                      value="checkedB"
                      color="primary"
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  </Col>
                  <Col xs={3} md={2}>
                    <Switch
                      checked={null}
                      onChange={null}
                      value="checkedB"
                      color="primary"
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  </Col>
                </Row>
                <div className="product-card__rate">
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarOutlineIcon />
                  <a
                    className="product-card__link"
                    href="/easydev/e-commerce/product_page"
                  >
                    See all reviews
                  </a>
                </div>
                <h1 className="product-card__price">
                  $17.19 <span className="product-card__old-price">$23</span>
                </h1>
                <p className="typography-message">
                  Knowledge nay estimable questions repulsive daughters boy.
                  Solicitude gay way unaffected expression for. His mistress
                  ladyship required off horrible disposed rejoiced. Unpleasing
                  pianoforte unreserved as oh he unpleasant no inquietude
                  insipidity. Advantages can discretion possession add
                  favourable cultivated admiration far.
                </p>
                <form className="form product-card__form">
                  <div className="form__form-group">
                    <span className="form__form-group-label product-card__form-label">
                      Select Color
                    </span>
                    <div className="form__form-group-field">
                      {/* Product Variant .map() */}
                      {["blue", "brown", "black"].map(color => {
                        return (
                          <FiberManualRecordIcon
                            style={{ color, cursor: "pointer", fontSize: 40 }}
                            onClick={() => console.log(color)}
                          />
                        );
                      })}
                    </div>
                    <span className="form__form-group-label product-card__form-label">
                      Select Size
                    </span>
                    <div className="form__form-group-field">
                      {/* Product Variant .map() */}
                      <ButtonToolbar>
                        <ButtonGroup dir="ltr">
                          {["S", "M", "L"].map(size => {
                            return (
                              <Button
                                outline
                                onClick={e => {
                                  e.preventDefault();
                                }}
                              >
                                {size}
                              </Button>
                            );
                            // <Button outline><span className="lnr lnr-heart-pulse" /></Button>
                            // <Button outline><span className="lnr lnr-cog" /></Button>
                            // <Button outline><span className="lnr lnr-magic-wand" /></Button>)}
                          })}
                        </ButtonGroup>
                      </ButtonToolbar>
                    </div>
                  </div>
                  {/* <ButtonToolbar className="product-card__btn-toolbar">
                  <Link className="btn btn-primary" to="#">
                    Add to cart
                  </Link>
                  <button
                    className="product-card__wish-btn"
                    type="button"
                    onClick={onLike}
                  >
                    <HeartIcon color={color} />
                    Add to wishlist
                  </button>
                </ButtonToolbar> */}
                </form>
                {/* <ProductTabs /> */}
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  currentProduct: state.product.currentProduct,
  errors: state.errors
});

const mapDispatchToProps = {
  retrieveProductById
};

const connectedForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductCard);

export default withRouter(connectedForm);
