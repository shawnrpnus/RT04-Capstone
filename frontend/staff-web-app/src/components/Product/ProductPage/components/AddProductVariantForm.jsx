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
import Autocomplete from "@material-ui/lab/Autocomplete";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withPage from "../../../Layout/page/withPage";
import colourList from "../../../../scss/colours.json";

const _ = require("lodash");
const defaultSizes = ["XS", "S", "M", "L", "XL"];

class AddProductVariantForm extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      productId: _.get(this.props.product, "productId"),
      colours: [],
      sizes: defaultSizes,
      product: this.props.product,
      existingColours: this.props.colours,
      colourList: colourList,
      colourSizeMap: []
    };
  }

  async componentDidMount() {
    let colourList = [...this.state.colourList];
    let { existingColours } = this.state;
    existingColours = _.map(existingColours, "colour");
    colourList = _.remove(colourList, colour => {
      return !existingColours.includes(colour.hex);
    });
    await this.setState({ colourList });
  }

  onSelectColour = async (event, colours) => {
    await this.setState({ colours });
  };

  onSelectSizes = async (event, sizes) => {
    await this.setState({ sizes });
  };

  onSubmit = e => {
    e.preventDefault();
    let { productId, colours, sizes } = { ...this.state };
    colours = _.map(colours, "hex");
    const colourToImageUrlsMaps = colours.map(colour => ({
      colour,
      imageUrls: []
    }));
    const request = { productId, colourToImageUrlsMaps, sizes };
    this.props.createProductVariants(request);
  };

  render() {
    const { errors, open, onClose, product } = this.props;
    const { colourList, colours, sizes } = this.state;
    const error = sizes.length <= 0 || colours.length <= 0;

    return (
      <Dialog onClose={onClose} open={open} fullWidth maxWidth={"xs"}>
        <DialogTitle>Create product variants </DialogTitle>
        {product && (
          <DialogContent>
            <Autocomplete
              style={{ margin: "3% 0" }}
              multiple
              id="colours"
              options={colourList}
              value={colours ? colours : []}
              onChange={(event, value) => this.onSelectColour(event, value)}
              filterSelectedOptions
              getOptionLabel={option => {
                return {
                  name: option.name,
                  hex: option.hex
                };
              }}
              renderOption={option => {
                return (
                  <Chip
                    style={{
                      backgroundColor: option.hex,
                      fontWeight: "bold",
                      width: "100%"
                    }}
                    label={option.name}
                    onClick={this.onSelectColour}
                  />
                );
              }}
              renderInput={params => {
                return (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Colours"
                    placeholder="colours"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment:
                        params.InputProps.startAdornment &&
                        params.InputProps.startAdornment.map(element => (
                          <Chip
                            key={element.props.label.name}
                            style={{
                              backgroundColor: element.props.label.hex,
                              fontWeight: "bold",
                              margin: "1%"
                            }}
                            label={element.props.label.name}
                            onClick={null}
                            onDelete={element.props.onDelete}
                          />
                        ))
                    }}
                  />
                );
              }}
            />
            <Autocomplete
              style={{ margin: "3% 0" }}
              multiple
              id="sizes"
              options={defaultSizes}
              onChange={(event, value) => this.onSelectSizes(event, value)}
              getOptionLabel={option => option}
              defaultValue={defaultSizes}
              filterSelectedOptions
              renderInput={params => (
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
              )}
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button autoFocus onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={this.onSubmit} disabled={error}>
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

const connectedForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddProductVariantForm);

export default withRouter(withPage(connectedForm));
