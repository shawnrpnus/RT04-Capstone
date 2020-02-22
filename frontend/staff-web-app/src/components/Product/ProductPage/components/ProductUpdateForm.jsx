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
import { retrieveAllCategoryAndTag } from "../../../../redux/actions/productActions";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

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
      tagList: []
    };
  }

  async componentDidMount() {
    const response = await retrieveAllCategoryAndTag();
    const { categories, tags } = response;
    this.setState({ categories, tagList: tags });
  }

  onChange = ({ target: input }) => {
    console.log(input);
    const product = { ...this.state.product };
    product[input.name] = input.value;
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
      cost
    } = this.state.product;
    const { errors, open, onClose } = this.props;
    const { categories, tagList } = this.state;

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
            <InputLabel
              required
              InputLabelProps={{
                shrink: true
              }}
            >
              Category
            </InputLabel>
            <Select
              onChange={this.handleChange}
              name="category"
              value={category && category.name}
            >
              <MenuItem value=""></MenuItem>
              {categories &&
                categories.map(({ name: category }) => {
                  return (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
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
