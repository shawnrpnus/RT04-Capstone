import React from "react";
import "moment";
import { connect } from "react-redux";
import { Grid, TextField, Chip, TablePagination } from "@material-ui/core";
import MaterialTable from "material-table";
import MaterialTextField from "../../../../shared/components/Form/MaterialTextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as PropTypes from "prop-types";
import CreateProductRequest from "../../../../models/product/CreateProductRequest";
import {
  createNewProduct,
  retrieveAllCategoryTagStyle
} from "../../../../redux/actions/productActions";
import withPage from "../../../Layout/page/withPage";
import colourList from "../../../../scss/colours.json";
import { Button, ButtonToolbar, Card, CardBody } from "reactstrap";
import ContentSaveIcon from "mdi-react/ContentSaveIcon";
import CloseCircleIcon from "mdi-react/CloseCircleIcon";
import renderDropZoneMultipleField from "./../../../../shared/components/Form/DropZoneMultiple";
import { Field, reduxForm } from "redux-form";
import ColourToImagesMap from "./../../../../models/product/ColourToImagesMap";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";

import { clearErrors, updateErrors } from "../../../../redux/actions";

const _ = require("lodash");
const defaultSizes = ["XS", "S", "M", "L", "XL"];

class ProductForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    errors: PropTypes.object,
    clearErrors: PropTypes.func,
    disabled: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      serialNumber: "",
      productName: "",
      description: "",
      price: "",
      cost: "",
      allTags: [],
      tagIds: [],
      categories: [],
      categoryId: "",
      allStyles: [],
      styleIds: [],
      colours: [],
      colourToImageUrlsMaps: [],
      sizes: [],
      isLoading: false
    };
  }

  async componentDidMount() {
    const response = await retrieveAllCategoryTagStyle();
    let { categories, tags, styles } = response;
    tags = tags.map(tag => _.pick(tag, ["tagId", "name"]));
    this.setState({ categories, allTags: tags, allStyles: styles });
    this.setState({ sizes: defaultSizes });
  }

  onSelectCategory = async (event, selectedCategory) => {
    if (selectedCategory === null) return;
    await this.setState({ categoryId: selectedCategory.category.categoryId });
    // console.log(this.state.categoryId);
  };

  onSelectColour = async (event, selectedColours) => {
    const colourToImageUrlsMaps = selectedColours.map(
      colour => new ColourToImagesMap(colour.hex, [])
    );
    // console.log(selectedColours);
    await this.setState({ colours: selectedColours, colourToImageUrlsMaps });
    // console.log(this.state.colours);
  };

  onSelectSizes = async (event, sizes) => {
    await this.setState({ sizes });
    // console.log(this.state.sizes);
  };

  onSelectTag = async (event, tagArray) => {
    tagArray = _.map(tagArray, "tagId");
    await this.setState({ tagIds: tagArray });
    // console.log(this.state.tagIds);
  };

  onSelectStyle = async (event, styleArray) => {
    styleArray = _.map(styleArray, "styleId");
    await this.setState({ styleIds: styleArray });
    // console.log(this.state.styleIds);
  };

  //for text field: serial number, name, description, price, cost
  onChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value });
    // console.log(name);
    // console.log(e.target.value);
    //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
    // console.log(this.state.category);
  };

  onChangeNumber = e => {
    const name = e.target.name;
    const stateValue = this.state[name];
    let value = e.target.value;
    const lastChar = e.target.value.substr(value.length - 1, 1);
    if (lastChar === "." && !stateValue.includes(".")) {
      this.setState({ [name]: value });
    } else {
      value = parseFloat(e.target.value).toString();
      if (value === "NaN") value = "";
      this.setState({ [name]: value });
    }

    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  onChangeSerialNumber = e => {
    const name = e.target.name;
    const value = e.target.value.replace(/\D/, "");
    this.setState({ [name]: value });

    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  onCancel = () => {
    this.props.history.goBack();
  };

  handleOnDrop = (files, selectedColour) => {
    const coloursToImageUrlsMap = new ColourToImagesMap(selectedColour, files);
    let colourToImageUrlsMaps = [...this.state.colourToImageUrlsMaps];

    const index = _.findIndex(
      colourToImageUrlsMaps,
      _.matchesProperty("colour", selectedColour)
    );

    // If got existing, replace
    colourToImageUrlsMaps[index] = coloursToImageUrlsMap;

    this.setState({ colourToImageUrlsMaps });
  };

  onSubmit = e => {
    e.preventDefault();
    let {
      serialNumber,
      productName,
      description,
      price,
      cost,
      categoryId,
      tagIds,
      styleIds,
      sizes,
      colourToImageUrlsMaps
    } = this.state;
    const product = new CreateProductRequest(
      serialNumber,
      productName,
      description,
      price,
      cost
    );
    const req = {
      product,
      categoryId,
      tagIds,
      styleIds,
      sizes,
      colourToImageUrlsMaps
    };

    const form = new FormData();
    colourToImageUrlsMaps.map(({ colour, files }, index) => {
      files.map(file => {
        console.log(file);
        form.append(index, file);
      });
    });
    form.append("request", JSON.stringify(req));
    this.props.createNewProduct(form, this.props.history, () =>
      this.setState({ isLoading: false })
    );
    this.setState({ isLoading: true });
  };

  render() {
    const { handleSubmit, errors, disabled } = this.props;
    // const hasErrors = Object.keys(this.props.errors).length !== 0;
    const {
      serialNumber,
      productName,
      description,
      price,
      cost,
      categoryId,
      sizes,
      colourToImageUrlsMaps,
      isLoading
    } = this.state;

    const disable =
      !serialNumber ||
      serialNumber.length < 5 ||
      !productName ||
      !price ||
      !cost ||
      !categoryId ||
      sizes.length === 0 ||
      !description ||
      !colourToImageUrlsMaps ||
      colourToImageUrlsMaps.length === 0;

    return (
      <form className="material-form">
        <Backdrop style={{ zIndex: 1000 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <MaterialTextField
              fieldLabel="Serial Number *"
              onChange={this.onChangeSerialNumber}
              fieldName="serialNumber"
              state={this.state}
              errors={errors}
              autoFocus={true}
              error={errors}
            />
            <small>Serial number must be at least 5 digits</small>
          </Grid>
          <Grid item xs={12} md={4}>
            <MaterialTextField
              fieldLabel="Name *"
              onChange={this.onChange}
              fieldName="productName"
              state={this.state}
              errors={errors}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              id="tags-standard"
              options={this.state.categories}
              getOptionLabel={option => option.leafNodeName}
              onChange={(event, value) => this.onSelectCategory(event, value)}
              getOptionSelected={(option, value) =>
                option.categoryId === value.categoryId
              }
              renderInput={params => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Category"
                  fullWidth
                  required
                />
              )}
              errors={errors}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows="4"
              name="description"
              variant="outlined"
              fullWidth
              onChange={this.onChange}
              state={this.state}
              errors={errors}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              id="tags-standard"
              options={this.state.allTags}
              onChange={(event, value) => this.onSelectTag(event, value)}
              getOptionLabel={option => {
                return option.name;
              }}
              getOptionSelected={(option, value) =>
                option.tagId === value.tagId
              }
              filterSelectedOptions
              renderInput={params => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Tags"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              id="tags-standard"
              options={this.state.allStyles}
              getOptionLabel={option => option.styleName}
              onChange={(event, value) => this.onSelectStyle(event, value)}
              getOptionSelected={(option, value) =>
                option.styleId === value.styleId
              }
              filterSelectedOptions
              renderInput={params => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Styles"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <Autocomplete
              style={{ margin: "3% 0" }}
              multiple
              id="colours"
              options={colourList}
              onChange={(event, value) => this.onSelectColour(event, value)}
              getOptionSelected={(option, value) => option.name === value.name}
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
                  />
                );
              }}
              renderInput={params => {
                return (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Colours"
                    required
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
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
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
                  required
                  // placeholder="Styles"
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <MaterialTextField
              // type="number"
              fieldLabel="Price *"
              onChange={this.onChangeNumber}
              fieldName="price"
              state={this.state}
              errors={errors}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MaterialTextField
              fieldLabel="Cost *"
              onChange={this.onChangeNumber}
              fieldName="cost"
              state={this.state}
              errors={errors}
            />
          </Grid>
        </Grid>
        <div
          className="table"
          style={{
            width: "auto",
            verticalAlign: "middle",
            marginTop: "1%"
          }}
        >
          <MaterialTable
            title="Upload Images"
            columns={[
              { title: "Colours", field: "name" },
              {
                title: "Images",
                field: "dropzone",
                render: rowData => {
                  return (
                    <Field
                      key={rowData.hex}
                      name={`${rowData.hex}-images`}
                      selectedColour={rowData.hex}
                      handleOnDrop={this.handleOnDrop}
                      component={renderDropZoneMultipleField}
                    />
                  );
                }
              }
            ]}
            options={{
              search: false,
              paging: false,
              sorting: false,
              filtering: false,
              headerStyle: { textAlign: "center" },
              cellStyle: { textAlign: "center" },
              draggable: false
            }}
            data={this.state.colours}
          />
        </div>
        <small style={{ color: "red" }}>
          Serial number, price and cost cannot have '-' character
        </small>
        <ButtonToolbar className="form__button-toolbar">
          <Button
            color="primary"
            className="icon"
            onClick={this.onSubmit}
            disabled={disable}
          >
            <p>
              <ContentSaveIcon />
              Submit
            </p>
          </Button>
          <Button type="button" className="icon" onClick={this.onCancel}>
            <p>
              <CloseCircleIcon />
              Cancel
            </p>
          </Button>
        </ButtonToolbar>
      </form>
    );
  }
}

// mapping the state of 'global store' to the props of the local component
const mapStateToProps = state => ({
  errors: state.errors
});

const mapDispatchToProps = {
  createNewProduct,
  clearErrors,
  updateErrors
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: "create_product_images_form" // a unique identifier for this form
  })(withPage(ProductForm, "Create Product"))
);
