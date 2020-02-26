import React, { PureComponent } from "react";
import {
  Card,
  CardBody,
  Col,
  ButtonToolbar,
  Button,
  ButtonGroup
} from "reactstrap";
import StarIcon from "mdi-react/StarIcon";
import StarOutlineIcon from "mdi-react/StarOutlineIcon";
import { withRouter } from "react-router-dom";
import ProductGallery from "./ProductGallery";
import images from "./imgs";
import ProductTabs from "./ProductTabs";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Switch from "@material-ui/core/Switch";
import Row from "reactstrap/es/Row";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { retrieveProductById } from "../../../../redux/actions/productActions";
import IconButton from "@material-ui/core/IconButton";
import CreateIcon from "@material-ui/icons/Create";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import ProductUpdateForm from "./ProductUpdateForm";
import AddProductVariantForm from "./AddProductVariantForm";
import AddSizeForm from "./AddSizeForm";
import withPage from "../../../Layout/page/withPage";
import colourList from "../../../../scss/colours.json";

const _ = require("lodash");
const jsonColorList = _.keyBy(colourList, "hex");

class ProductCard extends PureComponent {
  static propTypes = {
    product: PropTypes.object,
    errors: PropTypes.object,
    retrieveProductById: PropTypes.func.isRequired
  };

  state = {
    product: {},
    selectedColour: 0,
    selectedSize: "",
    uploadImage: false,
    colourSizeMap: [],
    openProductUpdateDialog: false,
    openCreateProductVariantDialog: false,
    openAddSizeDialog: false
  };

  componentDidMount() {
    this.props.retrieveProductById(this.props.match.params.id);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.currentProduct !== prevState.product) {
      this.setState({
        product: this.props.currentProduct.product,
        colourSizeMap: this.props.currentProduct.colourToSizeImageMaps
      });
    }
  }

  handleOpenProductUpdateDialog = e => {
    this.setState({ openProductUpdateDialog: true });
  };

  handleOpenCreateProductVariantDialog = e => {
    this.setState({ openCreateProductVariantDialog: true });
  };

  handleOpenAddSizeDialog = e => {
    this.setState({ openAddSizeDialog: true });
  };

  handleToggleUploadImage = e => {
    this.setState({ uploadImage: e.target.checked });
  };

  handleSelectColour = colour => {
    this.setState({ selectedColour: colour });
  };

  handleSelectSize = async ({ target }) => {
    const { value } = target;
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
      openCreateProductVariantDialog,
      openAddSizeDialog,
      product
    } = this.state;
    const { errors, location } = this.props;

    return (
      <div className="product-card">
        {colourSizeMap.length > 0 && (
          <ProductGallery
            colourSizeMap={colourSizeMap}
            selectedColour={selectedColour}
          />
        )}
        <div className="product-card__info">
          <Row>
            <Col xs={3} md={7}>
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
                <AddCircleRoundedIcon onClick={this.handleOpenAddSizeDialog} />
              </IconButton>
            </Col>
            <Col xs={2} md={1}>
              <IconButton>
                <AddCircleRoundedIcon
                  onClick={this.handleOpenCreateProductVariantDialog}
                />
              </IconButton>
            </Col>
            <Col xs={3} md={2}>
              <IconButton onClick={this.handleOpenProductUpdateDialog}>
                <CreateIcon />
              </IconButton>
            </Col>
          </Row>
          <div className="product-card__rate">
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarOutlineIcon />
            <a className="product-card__link">
              {colourSizeMap[selectedColour] &&
                jsonColorList[
                  _.get(colourSizeMap, `[${selectedColour}].colour`, null)
                ].name}
            </a>
          </div>
          <h1 className="product-card__price">
            ${price} <span className="product-card__old-price">$23</span>
          </h1>
          <p className="typography-message">
            {category && category.categoryName}
          </p>
          <div className="form__form-group">
            <span className="form__form-group-label product-card__form-label">
              Select Color
            </span>
            <div className="form__form-group-field">
              {/* Product Variant .map() */}
              {colourSizeMap &&
                colourSizeMap.map(({ colour }, index) => {
                  return (
                    <FiberManualRecordIcon
                      style={{
                        color: colour,
                        cursor: "pointer",
                        fontSize: 40
                      }}
                      key={colour}
                      onClick={() => this.handleSelectColour(index)}
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
                    colourSizeMap[selectedColour].sizeMaps.map(
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
        {openProductUpdateDialog && (
          <ProductUpdateForm
            open={openProductUpdateDialog}
            onClose={() => {
              this.setState({
                openProductUpdateDialog: false
              });
            }}
            errors={errors}
            key={productId + "update"}
          />
        )}
        {openCreateProductVariantDialog && (
          <AddProductVariantForm
            open={openCreateProductVariantDialog}
            onClose={() => {
              this.setState({
                openCreateProductVariantDialog: false
              });
            }}
            errors={errors}
            key={productId + "add"}
          />
        )}
        {openAddSizeDialog && (
          <AddSizeForm
            open={openAddSizeDialog}
            onClose={() => {
              this.setState({
                openAddSizeDialog: false
              });
            }}
            errors={errors}
            key={productId + "size"}
            selectedColourIndex={selectedColour}
          />
        )}
      </div>
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

export default withRouter(withPage(connectedForm));
