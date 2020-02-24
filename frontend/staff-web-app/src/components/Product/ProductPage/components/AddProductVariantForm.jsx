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
import {
  retrieveAllCategoryTagStyle,
  retrieveProductById,
  updateProduct
} from "../../../../redux/actions/productActions";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withPage from "../../../Layout/page/withPage";
import colourList from "../../../../scss/colours.json";

const _ = require("lodash");

class AddProductVariantForm extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
    // selectedValue: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      productId: "",
      colours: "",
      sizes: "",
      product: this.props.product,
      existingColours: this.props.colours,
      colourList: colourList
    };
  }

  async componentDidMount() {
    let colourList = [...this.state.colourList];
    const { existingColours } = this.state;
    if (this.props.colours)
      colourList = colourList.filter(
        colour => !existingColours.includes(colour)
      );

    await this.setState({ colourList });
  }

  // onChange = ({ target: input }) => {
  //   const product = { ...this.state.product };
  //   product[input.name] = input.value;
  //   this.setState({ product });
  // };

  // onSelectCategory = async ({ target: input }) => {
  //   if (input.name === undefined) return;
  //   const product = { ...this.state.product };
  //   product[input.name].categoryId = input.value;
  //   await this.setState({ product });
  // };

  // onSubmit = e => {
  //   e.preventDefault();
  //   const product = _.pick(this.state.product, [
  //     "productId",
  //     "productName",
  //     "description",
  //     "price",
  //     "cost",
  //     "category",
  //     "tags",
  //     "styles"
  //   ]);
  //   product.category = _.pick(product.category, ["categoryId"]);
  //   product.tags = product.tags.map(tag => _.pick(tag, ["tagId"]));
  //   product.styles = product.styles.map(style => _.pick(style, ["styleId"]));
  //   this.props.updateProduct(product, this.props.history);
  //   this.setState({});
  // };

  render() {
    const { errors, open, onClose, product } = this.props;
    const { productId, existingColours, colourList } = this.state;

    return (
      <Dialog onClose={onClose} open={open} fullWidth maxWidth={"xs"}>
        <DialogTitle>Create product </DialogTitle>
        {product && (
          <DialogContent>
            <Autocomplete
              style={{ margin: "3% 0" }}
              multiple
              id="colours"
              options={colourList}
              // onChange={(event, value) => this.onSelectTag(event, value)}
              getOptionLabel={option =>
                option.name ? option.name : option.colour
              }
              renderOption={(option, { selected }) => {
                return (
                  <Chip
                    style={{
                      backgroundColor: option.hex,
                      fontWeight: "bold",
                      width: "100%"
                    }}
                    label={option.name}
                    onClick={null}
                  />
                );
              }}
              value={existingColours}
              renderInput={params => {
                console.log(params);
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
                      startAdornment: [
                        <Chip key="gold" style={{ backgroundColor: "gold" }}>
                          Gold
                        </Chip>,
                        <Chip key="black" style={{ backgroundColor: "black" }}>
                          Black
                        </Chip>,
                        <Chip key="pink" style={{ backgroundColor: "pink" }}>
                          <p> Pink </p>
                        </Chip>
                      ]
                    }}
                  />
                );
              }}
            />
            {/* <Autocomplete
              style={{ margin: "3% 0" }}
              multiple
              id="styles"
              options={colourList}
              onChange={(event, value) => this.onSelectStyle(event, value)}
              getOptionLabel={option => option.styleName}
              value={product.styles}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Styles"
                  placeholder="Styles"
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              )}
            /> */}
          </DialogContent>
        )}
        <DialogActions>
          <Button autoFocus onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={this.onSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  product: state.product.currentProduct && state.product.currentProduct.product,
  colours:
    state.product.currentProduct &&
    state.product.currentProduct.colourToSizeImageMaps,
  errors: state.errors
});

const mapDispatchToProps = {
  retrieveProductById,
  updateProduct
};

const connectedForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddProductVariantForm);

export default withRouter(withPage(connectedForm));
