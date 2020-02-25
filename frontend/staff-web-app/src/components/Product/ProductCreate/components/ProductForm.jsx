import React from "react";
import "moment";
import { connect } from "react-redux";
import {Grid, TextField, InputLabel} from "@material-ui/core";
import MaterialTable from "material-table";
import MaterialTextField from "../../../../shared/components/Form/MaterialTextField";
import { Select, MenuItem } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as PropTypes from "prop-types";
import CreateProductRequest from "../../../../models/CreateProductRequest";
import {createNewProduct} from "../../../../redux/actions/productActions";
import withPage from "../../../Layout/page/withPage";
import {
    retrieveAllTags
  } from "../../../../redux/actions/tagAction";

//need to draw sizes from the size details entity in db
const sizes = [
    {size: 'XS'},
    {size: 'S'},
    {size: 'M'},
    {size: 'L'},
    {size: 'XL'}
]

class ProductForm extends React.Component {
    static propTypes = {
      handleSubmit: PropTypes.func,
      errors: PropTypes.object,
      clearErrors: PropTypes.func,
      disabled: PropTypes.bool,
      currentProduct: PropTypes.object
    };

    componentDidMount() {
        this.props.retrieveAllTags();
        //this.props.retrieveAllCategories();
        //this.props.retrieveSizeDetails(); 
      }
    
  
    constructor(props) {
      super(props);
      const { currentProduct } = this.props;
      this.state = {
        productId: currentProduct ? currentProduct.productId : undefined,
        serialNumber: currentProduct ? currentProduct.serialNumber : "",
        productName: currentProduct ? currentProduct.productName : "",
        description: currentProduct ? currentProduct.description : "",
        price: currentProduct ? currentProduct.price : "",
        cost: currentProduct ? currentProduct.cost : "",
        tags: [], 
        colours: [],
        sizes: [],
        category: ""
      };
    }

    //category: dropdown; based on categories that are created
    //size: chip; draw from sizedetails entities from db
    //colour: ideally use colour picker, generate rows in table based on colour
    //Done: setting state of tags upon change of value. need to set state for category & size

    //for text field: serial number, name, description, price, cost
    onChange = e => {
        const name = e.target.name;
      console.log(name);
      console.log(e.target.value);
      this.setState({ [name]: e.target.value }); //computed property name syntax
      if (Object.keys(this.props.errors).length !== 0) {
        this.props.clearErrors();
      }
      console.log(this.state.category);
    };

    onSelectTag = async (event, tagArray) => {
        await this.setState({ tags: tagArray });
    };

    onSelectSize = async (event, sizeArray) => {
        await this.setState({ sizes: sizeArray });
    };

    onCancel = () => {
      this.props.history.goBack();
    };

    handleChange(event, index, values)  { 
        this.setState({ 
         tags: [...this.state.tags, values]
        });
       }

    handleSubmit = (e, formState) => {
        e.preventDefault();
        const {
            serialNumber,
            productName,
            description,
            price,
            cost, 
            tags,
            colours
        } = formState;
        const req = new CreateProductRequest(
            serialNumber,
            productName,
            description,
            price,
            cost, 
            tags,
            colours
        );
            this.props.createNewProduct(req, this.props.history);
      };
    
      
      render() {
      const { handleSubmit, errors, disabled, currentProduct, renderLoader } = this.props;
      const data = this.state.sizes; //color
      const hasErrors = Object.keys(this.props.errors).length !== 0;

      return (
          <form className="material-form">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <MaterialTextField //set value to be the last previous
                  type="number"
                  fieldLabel="Serial Number" 
                  onChange={this.onChange}
                  fieldName="serialNumber"
                  state={this.state}
                  errors={errors}
                  disabled={disabled}
                  autoFocus={true}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MaterialTextField
                    fieldLabel="Name"
                    onChange={this.onChange}
                    fieldName="productName"
                    state={this.state}
                    errors={errors}
                    disabled={disabled}
                    autoFocus={true}
                    />
              </Grid>
              <Grid item xs={12} md={4}>
              <Autocomplete
                id="tags-standard"
                options={this.props.allTags} //all categories
                getOptionLabel={option => option.name}
                onChange={this.onChange}
                renderInput={params => (
                <TextField
                    {...params}
                    variant="standard"
                    label="Category"
                    fullWidth
                />
                )}
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
                    fullWidth="true"
                    onChange={this.onChange}
                    state={this.state}
                    errors={errors}
                    disabled={disabled}
                    autoFocus={true}
                />
                </Grid>
              <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                id="tags-standard"
                options={this.props.allTags}
                getOptionLabel={option => option.name}
                onChange={(event, value) => this.onSelectTag(event, value)}
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
                id="sizes-standard"
                options={sizes} //this.props.allSizes
                getOptionLabel={option => option.size}
                onChange={(event, value) => this.onSelectSize(event, value)}
                renderInput={params => (
                <TextField
                    {...params}
                    variant="standard"
                    label="Sizes"
                    fullWidth
                />
                )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
              <MaterialTextField
                  type="number"
                  fieldLabel="Colours"
                  onChange={this.onChange}
                  fieldName="colours"
                  state={this.state}
                  errors={errors}
                  disabled={disabled}
                />  
              </Grid>
              <Grid item xs={12} md={3}>
                <MaterialTextField
                  type="number"
                  fieldLabel="Price"
                  onChange={this.onChange}
                  fieldName="price"
                  state={this.state}
                  errors={errors}
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <MaterialTextField
                  type="number"
                  fieldLabel="Cost"
                  onChange={this.onChange}
                  fieldName="cost"
                  state={this.state}
                  errors={errors}
                  disabled={disabled}
                />
              </Grid>
            </Grid>
             
      <React.Fragment>
            <div
            className="table"
            style={{
                width: "auto",
                verticalAlign: "middle"
            }}
            >
            <MaterialTable
              title="Upload Images"
              columns={[
                { title: "Name", field: "name"} //change to color field
              ]}
              options={{
                search: false,
                paging: false,
                sorting: false,
                filtering: false
              }}
              data={data}
            />
        </div>
      </React.Fragment>
          </form>
      );
    }
  }
  
// mapping the state of 'global store' to the props of the local component
const mapStateToProps = state => ({
    allTags: state.tag.allTags,
    currentProduct: state.product.currentProduct,
    errors: state.errors
  });
  
  const mapDispatchToProps = {
    retrieveAllTags,
    createNewProduct 
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withPage(ProductForm, "Create Product"));
  
  