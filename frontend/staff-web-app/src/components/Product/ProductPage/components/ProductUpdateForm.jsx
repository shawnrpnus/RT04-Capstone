import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { retrieveAllCategoryTagStyle } from "../../../../redux/actions/productActions";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";

class ProductUpdateForm extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
    // selectedValue: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      originalProduct: this.props.product,
      product: this.props.product,
      open: this.props.open,
      categories: [],
      tagList: [],
      styleList: []
    };
  }

  async componentDidMount() {
    const response = await retrieveAllCategoryTagStyle();
    const { categories, tags, styles } = response;
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

  onSelectTag = (event, tagArray) => {
    const product = { ...this.state.product };
    product.tags = tagArray;
    this.setState({ product });
  };

  onSelectStyle = (event, styleArray) => {
    const product = { ...this.state.product };
    product.styles = styleArray;
    this.setState({ product });
  };

  make = () => {
    return <TextField id="standard-basic" label="Standard" />;
  };

  render() {
    const {
      productId,
      serialNum,
      productName,
      description,
      tags,
      category,
      price,
      cost,
      styles
    } = this.state.product;
    const { errors, open, onClose } = this.props;
    const { categories, tagList, styleList } = this.state;

    return (
      <Dialog onClose={onClose} open={open} fullWidth maxWidth={"xs"}>
        <DialogTitle>Update product </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="productName"
            value={productName}
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
            value={description}
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
            value={price}
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
            value={cost}
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
            {category && (
              <Select
                onClick={this.onSelectCategory}
                name="category"
                value={category.categoryId}
              >
                <MenuItem key={""} value="" />
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
            getOptionLabel={option => option.name}
            value={tags}
            renderInput={params => (
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
            )}
          />
          <Autocomplete
            style={{ margin: "3% 0" }}
            multiple
            id="styles"
            options={styleList}
            onChange={(event, value) => this.onSelectStyle(event, value)}
            getOptionLabel={option => option.styleName}
            value={styles}
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
        <DialogActions>
          <Button autoFocus onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button color="primary">Subscribe</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ProductUpdateForm;
