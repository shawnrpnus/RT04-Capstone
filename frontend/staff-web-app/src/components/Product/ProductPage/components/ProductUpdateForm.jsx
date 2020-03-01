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
const _ = require("lodash");

class ProductUpdateForm extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
    // selectedValue: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      originalProduct: this.props.currentProduct,
      product: this.props.currentProduct,
      open: this.props.open,
      categories: [],
      tagList: [],
      styleList: []
    };
  }

  async componentDidMount() {
    const response = await retrieveAllCategoryTagStyle();
    console.log(response);
    let { categories, tags, styles } = response;
    tags = tags.map(tag => _.pick(tag, ["tagId", "name"]));
    this.setState({ categories, tagList: tags, styleList: styles });
  }

  onChange = ({ target: input }) => {
    const product = { ...this.state.product };
    product[input.name] = input.value;
    this.setState({ product });
  };

  onSelectCategory = async ({ target: input }) => {
    if (input.name === undefined) return;
    const product = { ...this.state.product };
    product[input.name].categoryId = input.value;
    await this.setState({ product });
  };

  onSelectTag = async (event, tagArray) => {
    const product = { ...this.state.product };
    product.tags = tagArray;
    await this.setState({ product });
  };

  onSelectStyle = (event, styleArray) => {
    const product = { ...this.state.product };
    product.styles = styleArray;
    this.setState({ product });
  };

  onSubmit = e => {
    e.preventDefault();
    const product = _.pick(this.state.product, [
      "productId",
      "productName",
      "description",
      "price",
      "cost",
      "category",
      "tags",
      "styles"
    ]);
    product.category = _.pick(product.category, ["categoryId"]);
    product.tags = product.tags.map(tag => _.pick(tag, ["tagId"]));
    product.styles = product.styles.map(style => _.pick(style, ["styleId"]));
    this.props.updateProduct(product, this.props.onClose);
    this.setState({});
  };

  // console.log(_.keyBy(colourList, "hex"));

  render() {
    const { errors, open, onClose } = this.props;
    const { categories, tagList, styleList, product } = this.state;
    let error = false;
    if (this.state.product) {
      const {
        productName,
        description,
        price,
        cost,
        category
      } = this.state.product;
      error =
        tagList.length <= 0 ||
        styleList.length <= 0 ||
        !productName ||
        !description ||
        !price ||
        !cost ||
        !category;
    }

    return (
      <Dialog onClose={onClose} open={open} fullWidth maxWidth={"xs"}>
        <DialogTitle>Update product </DialogTitle>
        {product && (
          <DialogContent>
            <TextField
              label="Name"
              name="productName"
              value={product.productName}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              onChange={this.onChange}
            />
            <TextField
              label="Description"
              name="description"
              value={product.description}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              onChange={this.onChange}
              multiline
              rowsMax={6}
            />
            <TextField
              type="number"
              label="Price"
              name="price"
              value={product.price}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              onChange={this.onChange}
            />
            <TextField
              type="number"
              label="Cost"
              name="cost"
              value={product.cost}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              onChange={this.onChange}
            />
            <FormControl fullWidth style={{ margin: "3% 0" }}>
              <InputLabel required shrink>
                Category
              </InputLabel>
              {categories && (
                <Select
                  onClick={this.onSelectCategory}
                  name="category"
                  value={product.category.categoryId}
                >
                  <MenuItem key={"x"} value={product.category.categoryId} />
                  {categories.map(({ category, leafNodeName }, index) => {
                    return (
                      <MenuItem key={index} value={category.categoryId}>
                        {leafNodeName}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            </FormControl>
            <Autocomplete
              style={{ margin: "3% 0" }}
              multiple
              id="tags"
              options={tagList}
              onChange={(event, value) => this.onSelectTag(event, value)}
              getOptionLabel={option => {
                return option.name;
              }}
              getOptionSelected={(option, value) =>
                option.tagId === value.tagId
              }
              value={product.tags}
              filterSelectedOptions
              renderInput={params => {
                return (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Tags"
                    placeholder="Tags"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                );
              }}
            />
            <Autocomplete
              style={{ margin: "3% 0" }}
              multiple
              id="styles"
              options={styleList}
              onChange={(event, value) => this.onSelectStyle(event, value)}
              getOptionLabel={option => option.styleName}
              getOptionSelected={(option, value) =>
                option.styleId === value.styleId
              }
              value={product.styles}
              filterSelectedOptions
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
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button autoFocus onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={this.onSubmit} disabled={error}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  currentProduct:
    state.product.currentProduct && state.product.currentProduct.product,
  errors: state.errors
});

const mapDispatchToProps = {
  retrieveProductById,
  updateProduct
};

const connectedForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductUpdateForm);

export default withRouter(withPage(connectedForm));
