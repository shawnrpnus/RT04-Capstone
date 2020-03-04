import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { updateProductVariantImages } from "../../../../redux/actions/productActions";
import Chip from "@material-ui/core/Chip";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withPage from "../../../Layout/page/withPage";
import colourList from "../../../../scss/colours.json";
import { Field, reduxForm } from "redux-form";
import renderDropZoneMultipleField from "./../../../../shared/components/Form/DropZoneMultiple";

const _ = require("lodash");
const defaultSizes = ["XS", "S", "M", "L", "XL"];
const jsonColorList = _.keyBy(colourList, "hex");

class UpdateImageForm extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      productId: _.get(this.props.product, "productId"),
      colourSizeMap: {},
      files: []
    };
  }

  async componentDidMount() {
    const colourSizeMap = {
      ..._.get(this.props, `colours[${this.props.selectedColourIndex}]`)
    };
    const colour = _.get(
      this.props,
      `colours[${this.props.selectedColourIndex}].colour`
    );
    this.setState({ colourSizeMap });
  }

  handleOnDrop = files => {
    this.setState({ files });
  };

  onSubmit = e => {
    e.preventDefault();
    const { productId, files, colourSizeMap } = this.state;
    const request = { productId, colour: colourSizeMap.colour };

    const form = new FormData();
    files.map(file => form.append("images", file));
    form.append("request", JSON.stringify(request));
    console.log(this.state);
    this.props.updateProductVariantImages(form, productId);
  };

  render() {
    const { errors, open, onClose, product } = this.props;
    const { colourSizeMap, files } = this.state;
    const disabled = files.length === 0;

    return (
      <Dialog onClose={onClose} open={open} fullWidth maxWidth={"md"}>
        <DialogTitle>Create product variant for selected colour</DialogTitle>
        {product && (
          <DialogContent
            style={{
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Chip
              size="medium"
              label={_.get(jsonColorList[colourSizeMap.colour], "name")}
              style={{
                margin: "2% 0",
                backgroundColor: _.get(colourSizeMap, "colour"),
                color: _.get(colourSizeMap, "colour") !== "#000000" || "White",
                fontSize: 16,
                fontWeight: "bold",
                alignItems: "center"
              }}
            />
            <Field
              name={`${product.productName}`}
              handleOnDrop={this.handleOnDrop}
              component={renderDropZoneMultipleField}
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button autoFocus onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={this.onSubmit} disabled={disabled}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  product: _.get(state, "product.currentProduct.product"),
  colours: _.get(state, "product.currentProduct.colourToSizeImageMaps"),
  errors: state.errors
});

const mapDispatchToProps = {
  updateProductVariantImages
};

const connectedForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateImageForm);

export default withRouter(
  reduxForm({
    form: "update_images_form" // a unique identifier for this form
  })(withPage(connectedForm))
);
