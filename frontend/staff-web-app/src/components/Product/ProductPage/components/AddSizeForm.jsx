import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import { createProductVariants } from "../../../../redux/actions/productActions";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withPage from "../../../Layout/page/withPage";
import colourList from "../../../../scss/colours.json";
import { Grid, Typography } from "@material-ui/core";

const _ = require("lodash");
const defaultSizes = ["XS", "S", "M", "L", "XL"];
const jsonColorList = _.keyBy(colourList, "hex");

class AddSizeForm extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      productId: _.get(this.props.product, "productId"),
      sizes: [],
      colourSizeMap: {},
      sizesAvailable: []
    };
  }

  async componentDidMount() {
    const colourSizeMap = {
      ..._.get(this.props, `colours[${this.props.selectedColourIndex}]`)
    };
    // delete colourSizeMap.productImages;
    // Get { color : "Red", sizeMaps: ["S", "M", "L"]}
    colourSizeMap["sizes"] = _.map(colourSizeMap.sizeMaps, "size");
    // Filter out the sizes that already exist in database
    const sizesAvailable = defaultSizes.filter(
      size => !colourSizeMap["sizes"].includes(size)
    );
    this.setState({ colourSizeMap, sizesAvailable, sizes: sizesAvailable });
  }

  onSelectSizes = async (event, sizes) => {
    await this.setState({ sizes });
  };

  onSubmit = e => {
    e.preventDefault();
    const { productId, sizes, colourSizeMap } = this.state;
    const colourToImageUrlsMaps = Array(colourSizeMap.colour).map(colour => ({
      colour,
      imageUrls: []
    }));
    const request = { productId, sizes, colourToImageUrlsMaps };
    this.props.createProductVariants(request);
  };

  render() {
    const { errors, open, onClose, product } = this.props;
    const { colourSizeMap, sizes, sizesAvailable } = this.state;

    return (
      <Dialog onClose={onClose} open={open} fullWidth maxWidth={"xs"}>
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
                padding: "0 2%",
                backgroundColor: _.get(colourSizeMap, "colour"),
                color: _.get(colourSizeMap, "colour") !== "#000000" || "White",
                fontSize: 16,
                fontWeight: "bold",
                alignItems: "center"
              }}
            />
            <Autocomplete
              style={{ margin: "3% 0" }}
              multiple
              id="sizes"
              options={sizesAvailable}
              onChange={(event, value) => this.onSelectSizes(event, value)}
              getOptionLabel={option => option}
              defaultValue={sizesAvailable}
              filterSelectedOptions
              noOptionsText="All sizes exist in database"
              renderInput={params => {
                return (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Sizes"
                    // placeholder="Styles"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                );
              }}
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button autoFocus onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={this.onSubmit}
            disabled={sizesAvailable.length <= 0}
          >
            Create
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
  createProductVariants
};

const connectedForm = connect(mapStateToProps, mapDispatchToProps)(AddSizeForm);

export default withRouter(withPage(connectedForm));
