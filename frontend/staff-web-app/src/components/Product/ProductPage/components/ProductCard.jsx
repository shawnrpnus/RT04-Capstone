import React, { PureComponent } from "react";
import { Redirect } from "react-router-dom";
import { Col, ButtonToolbar, Button, ButtonGroup } from "reactstrap";
import StarIcon from "mdi-react/StarIcon";
import StarOutlineIcon from "mdi-react/StarOutlineIcon";
import { withRouter } from "react-router-dom";
import ProductGallery from "./ProductGallery";
import ProductTabs from "./ProductTabs";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import ImageIcon from "@material-ui/icons/Image";
import Row from "reactstrap/es/Row";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  retrieveProductById,
  deleteProductVariant
} from "../../../../redux/actions/productActions";
import IconButton from "@material-ui/core/IconButton";
import CreateIcon from "@material-ui/icons/Create";
import BuildIcon from "@material-ui/icons/Build";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import ProductUpdateForm from "./ProductUpdateForm";
import AddProductVariantForm from "./AddProductVariantForm";
import AddSizeForm from "./AddSizeForm";
import UpdateImageForm from "./UpdateImageForm";
import withPage from "../../../Layout/page/withPage";
import colourList from "../../../../scss/colours.json";
import Typography from "@material-ui/core/Typography";
import withMaterialConfirmDialog from "./../../../Layout/page/withMaterialConfirmDialog";
import axios from "axios";

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
    colourSizeMap: [],
    openProductUpdateDialog: false,
    openCreateProductVariantDialog: false,
    openAddSizeDialog: false,
    openUpdateImageDialog: false,
    productVariants: []
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

  handleCloseProductUpdateDialog = () => {
    this.setState({ openProductUpdateDialog: false });
  };

  handleOpenCreateProductVariantDialog = e => {
    this.setState({ openCreateProductVariantDialog: true });
  };

  handleOpenAddSizeDialog = e => {
    this.setState({ openAddSizeDialog: true });
  };

  handleOpenUpdateImageDialog = e => {
    this.setState({ openUpdateImageDialog: true });
  };

  handleSelectColour = colour => {
    this.setState({ selectedColour: colour, selectedSize: null });
  };

  handleSelectSize = ({ target, currentTarget }) => {
    const { value } = currentTarget;
    this.setState({ selectedSize: value });
  };

  handleDeleteProductVariant = () => {
    const { selectedSize, product } = this.state;

    this.props
      .confirmDialog({ description: "Selected product will be deleted" })
      .then(() =>
        this.props.deleteProductVariant(selectedSize, product.productId)
      );
  };

  render() {
    const {
      productName,
      price,
      productVariants,
      category,
      tags,
      styles,
      serialNumber,
      productId,
      description,
      cost
    } = this.state.product;
    const {
      selectedColour,
      selectedSize,
      colourSizeMap,
      openProductUpdateDialog,
      openCreateProductVariantDialog,
      openAddSizeDialog,
      openUpdateImageDialog
    } = this.state;
    const { errors, location, currentProduct } = this.props;
    const leafNodeName = _.get(currentProduct, "leafNodeName");

    const variants = _.keyBy(
      _.get(this.props, "currentProduct.product.productVariants"),
      "productVariantId"
    );

    return (
      <div>
        {colourSizeMap.length > 0 ? (
          <div className="product-card">
            <ProductGallery
              colourSizeMap={colourSizeMap}
              selectedColour={selectedColour}
            />
            <div className="product-card__info">
              <Row>
                <Col xs={12} md={6}>
                  <h3 className="product-card__title">
                    {productName}{" "}
                    {variants[selectedSize] && variants[selectedSize].sku}
                  </h3>
                </Col>
                <Col xs={2} md={1}>
                  {selectedSize && (
                    <Tooltip
                      title={<span style={{ fontSize: 15 }}>Delete size</span>}
                    >
                      <IconButton onClick={this.handleDeleteProductVariant}>
                        <DeleteIcon style={{ fontSize: 40 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Col>

                <Col xs={2} md={1}>
                  <Tooltip
                    title={<span style={{ fontSize: 15 }}>Update images</span>}
                  >
                    <IconButton onClick={this.handleOpenUpdateImageDialog}>
                      <ImageIcon style={{ fontSize: 40 }} />
                    </IconButton>
                  </Tooltip>
                  {/* <Switch
                checked={uploadImage}
                onChange={this.handleToggleUploadImage}
              /> */}
                </Col>
                <Col xs={2} md={1}>
                  <Tooltip
                    title={<span style={{ fontSize: 15 }}>Add sizes</span>}
                  >
                    <IconButton onClick={this.handleOpenAddSizeDialog}>
                      <AddCircleRoundedIcon style={{ fontSize: 40 }} />
                    </IconButton>
                  </Tooltip>
                </Col>
                <Col xs={2} md={1}>
                  <Tooltip
                    title={
                      <span style={{ fontSize: 15 }}>Add new colours</span>
                    }
                  >
                    <IconButton
                      onClick={this.handleOpenCreateProductVariantDialog}
                    >
                      <CreateIcon style={{ fontSize: 40 }} />
                    </IconButton>
                  </Tooltip>
                </Col>
                <Col xs={3} md={2}>
                  <Tooltip
                    title={<span style={{ fontSize: 15 }}>Update product</span>}
                  >
                    <IconButton onClick={this.handleOpenProductUpdateDialog}>
                      <BuildIcon style={{ fontSize: 40 }} />
                    </IconButton>
                  </Tooltip>
                </Col>
              </Row>
              <div className="product-card__rate">
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarOutlineIcon />
                <a className="product-card__link"></a>
              </div>

              <h1 className="product-card__price">
                ${price}{" "}
                <span className="product-card__old-price">${cost}</span>
              </h1>
              <h4 className="product-card__category">{leafNodeName}</h4>
              <div className="form__form-group">
                <span className="product-card__form-label">Select Color</span>
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
                  <Typography
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 10,
                      fontSize: 20
                    }}
                  >
                    {colourSizeMap[selectedColour] &&
                      jsonColorList[
                        _.get(colourSizeMap, `[${selectedColour}].colour`, null)
                      ].name}
                  </Typography>
                </div>
                <span className="product-card__form-label">Select Size</span>
                <div className="form__form-group-field">
                  {/* Product Variant .map() */}
                  <ButtonToolbar>
                    <ButtonGroup>
                      {colourSizeMap[selectedColour].sizeMaps.map(
                        ({ size, productVariantId }, index) => {
                          const active =
                            selectedSize &&
                            selectedSize.toString() ===
                              productVariantId.toString();
                          return (
                            <Button
                              key={productVariantId}
                              outline
                              active={active}
                              value={productVariantId}
                              onClick={this.handleSelectSize}
                            >
                              <Typography style={{ color: "inherit" }}>
                                {size}
                              </Typography>
                            </Button>
                          );
                        }
                      )}
                    </ButtonGroup>
                  </ButtonToolbar>
                </div>
              </div>
              <ProductTabs
                description={description}
                tags={tags}
                styles={styles}
              />
            </div>
          </div>
        ) : (
          this.props.renderLoader()
        )}

        {openProductUpdateDialog && (
          <ProductUpdateForm
            open={openProductUpdateDialog}
            onClose={this.handleCloseProductUpdateDialog}
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
        {openUpdateImageDialog && (
          <UpdateImageForm
            open={openUpdateImageDialog}
            onClose={() => {
              this.setState({ openUpdateImageDialog: false });
            }}
            errors={errors}
            key={productId + "image"}
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
  retrieveProductById,
  deleteProductVariant
};

const connectedForm = connect(mapStateToProps, mapDispatchToProps)(ProductCard);

export default withRouter(withMaterialConfirmDialog(withPage(connectedForm)));
