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

const searchClient = algoliasearch(
  "0B4ODLCUAM",
  "c8154cb9be7f12cf578f5a7bfdd937b3"
);

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
          label="Search"
          margin="normal"
          variant="outlined"
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
  );
};
