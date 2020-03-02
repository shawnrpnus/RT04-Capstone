import React from "react";
import algoliasearch from "algoliasearch";
import {
  InstantSearch,
  SearchBox,
  Hits,
  connectAutoComplete
} from "react-instantsearch-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import HeaderLinks from "components/Layout/components/Header/HeaderLinks";
import { Link } from "react-router-dom";
import { searchClient } from "components/Algolia/config";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Lock, Visibility, VisibilityOff } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

const AgAutocomplete = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName="Apricot">
      <CustomAutocomplete />
    </InstantSearch>
  );
};

export default AgAutocomplete;

const MyAutoComplete = props => {
  const { hits, currentRefinement, refine } = props;
  return (
    <Autocomplete
      style={{ width: "400px" }}
      options={hits}
      // getOptionLabel={option => option.product.productName}
      renderOption={option => {
        if (currentRefinement) return <SearchResult productDetails={option} />;
      }}
      open={currentRefinement}
      freeSolo
      renderInput={params => (
        <TextField
          {...params}
          placeholder="Search"
          margin="none"
          variant="standard"
          fullWidth
          size="small"
          // InputProps={{
          //   endAdornment: (
          //     <InputAdornment position="end">
          //       <IconButton>
          //         <Visibility />
          //       </IconButton>
          //     </InputAdornment>
          //   )
          // }}
        />
      )}
      value={currentRefinement}
      onInputChange={(event, value) => refine(value)}
    />
  );
};
const CustomAutocomplete = connectAutoComplete(MyAutoComplete);

const SearchResult = props => {
  const { productDetails } = props;
  const { product, colourToSizeImageMaps } = productDetails;
  const { productImages } = colourToSizeImageMaps[0];
  return (
    <Link to={`/shop/product/${product.productId}`}>
      <GridContainer>
        <GridItem xs={4}>
          <img
            height="auto"
            width="100%"
            src={productImages[0].productImageUrl}
            alt="ProdImage"
          />
        </GridItem>
        <GridItem xs={8}>
          <GridContainer>
            <GridItem xs={12}>{product.productName}</GridItem>
            <GridItem>${product.price}</GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </Link>
  );
};
