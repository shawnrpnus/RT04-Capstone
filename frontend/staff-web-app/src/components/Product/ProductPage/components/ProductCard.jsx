import React, { PureComponent } from "react";
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
import { connect } from "react-redux";
import { retrieveProductById } from "../../../../redux/actions/productActions";
import IconButton from "@material-ui/core/IconButton";
import CreateIcon from "@material-ui/icons/Create";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ProductUpdateForm from "./ProductUpdateForm";

class ProductCard extends PureComponent {
  static propTypes = {
    product: PropTypes.object,
    errors: PropTypes.object,
    retrieveProductById: PropTypes.func.isRequired
  };

  state = {
    product: {},
    selectedColour: "",
    selectedSize: "",
    uploadImage: false,
    colourSizeMap: [],
    openProductUpdateDialog: false
  };

  componentDidMount() {
    this.props.retrieveProductById(this.props.match.params.id);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.currentProduct !== prevState.product) {
      const displayedColours = [];
      const colourSizeMap = [];
      let colour, size, productVariantId;

      this.props.currentProduct.productVariants.map(e => {
        colour = e.colour;
        size = e.sizeDetails.productSize;
        productVariantId = e.productVariantId;

        if (!displayedColours.includes(colour)) {
          displayedColours.push(colour);
          colourSizeMap[colour] = Object();
          colourSizeMap[colour].sizes = Array({ size, productVariantId });
          colourSizeMap[colour].productImages = e.productImages;
        } else {
          colourSizeMap[colour].sizes.push({ size, productVariantId });
        }
      });
      // console.log(colourSizeMap);
      // console.log(displayedColours[0]);
      this.setState({
        product: this.props.currentProduct,
        colourSizeMap,
        selectedColour: displayedColours[0]
      });
    }
  }

  handleOpenProductUpdateDialog = e => {
    this.setState({ openProductUpdateDialog: true });
  };

  handleToggleUploadImage = e => {
    this.setState({ uploadImage: e.target.checked });
  };

  handleSelectColour = colour => {
    this.setState({ selectedColour: colour });
  };

  handleSelectSize = async ({ target }) => {
    const { value } = target;
    console.log(value);
    await this.setState({ selectedSize: value });
  };

  render() {
    const {
      productName,
      price,
      productVariants,
      category,
      tags,
      serialNumber,
      productId,
      description
    } = this.state.product;
    const {
      selectedColour,
      selectedSize,
      uploadImage,
      colourSizeMap,
      openProductUpdateDialog,
      product
    } = this.state;
    const { errors, location } = this.props;

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <div className="product-card">
              {productVariants && (
                <ProductGallery
                  colourSizeMap={colourSizeMap}
                  selectedColour={selectedColour}
                />
              )}
              <div className="product-card__info">
                <Row>
                  <Col xs={5} md={8}>
                    <h3 className="product-card__title">{productName}</h3>
                  </Col>
                  <Col xs={2} md={1}>
                    <Switch
                      checked={uploadImage}
                      onChange={this.handleToggleUploadImage}
                    />
                  </Col>
                  <Col xs={2} md={1}>
                    <IconButton>
                      <CreateIcon />
                    </IconButton>
                  </Col>
                  <Col xs={3} md={2}>
                    <IconButton onClick={this.handleOpenProductUpdateDialog}>
                      <AddCircleRoundedIcon />
                    </IconButton>
                  </Col>
                </Row>
                <div className="product-card__rate">
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarOutlineIcon />
                  <a className="product-card__link">See all reviews</a>
                </div>
                <h1 className="product-card__price">
                  ${price} <span className="product-card__old-price">$23</span>
                </h1>
                <p className="typography-message">
                  {category && category.name}
                </p>
                <div className="form__form-group">
                  <span className="form__form-group-label product-card__form-label">
                    Select Color
                  </span>
                  <div className="form__form-group-field">
                    {/* Product Variant .map() */}
                    {colourSizeMap &&
                      Object.keys(colourSizeMap).map(colour => {
                        return (
                          <FiberManualRecordIcon
                            style={{
                              color: colour,
                              cursor: "pointer",
                              fontSize: 40
                            }}
                            key={colour}
                            onClick={() => this.handleSelectColour(colour)}
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
                        {colourSizeMap[selectedColour] &&
                          colourSizeMap[selectedColour].sizes.map(
                            ({ size, productVariantId }) => {
                              return (
                                <Button
                                  key={size}
                                  outline
                                  value={productVariantId}
                                  onClick={this.handleSelectSize}
                                >
                                  {size}
                                </Button>
                              );
                            }
                          )}
                      </ButtonGroup>
                    </ButtonToolbar>
                  </div>
                </div>
                <Row>
                  <Col xs={0} lg={9} />
                  <Col xs={12} lg={3}>
                    <ButtonToolbar className="product-card__btn-toolbar">
                      <Button color="primary">Delete</Button>
                      {/*  <button className="product-card__wish-btn" type="button">
                        <HeartIcon />
                        Add to wishlist
                      </button>*/}
                    </ButtonToolbar>
                  </Col>
                </Row>
                <ProductTabs description={description} />
              </div>
            </div>
          </CardBody>
        </Card>
        <ProductUpdateForm
          open={openProductUpdateDialog}
          onClose={() => this.setState({ openProductUpdateDialog: false })}
          product={product}
          errors={errors}
          key={productId}
        />
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  currentProduct: state.product.currentProduct,
  errors: state.errors
});

const mapDispatchToProps = {
  retrieveProductById
};

const connectedForm = connect(mapStateToProps, mapDispatchToProps)(ProductCard);

export default withRouter(connectedForm);
