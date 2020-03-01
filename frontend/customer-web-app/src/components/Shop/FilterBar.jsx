import React, { useEffect, useState } from "react";
import CardBody from "components/UI/Card/CardBody";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "components/UI/CustomButtons/Button";
import Cached from "@material-ui/core/SvgIcon/SvgIcon";
import Clearfix from "components/UI/Clearfix/Clearfix";
import Accordion from "components/UI/Accordion/Accordion";
import Card from "components/UI/Card/Card";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-kit-pro-react/views/ecommerceSections/productsStyle";
import selectStyles from "assets/jss/material-kit-pro-react/customSelectStyle.js";
import classNames from "classnames";
import Slider from "@material-ui/core/Slider";
import CheckboxGroup from "components/UI/CheckboxGroup/CheckboxGroup";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Fab from "@material-ui/core/Fab";
import { Publish, RotateLeft } from "@material-ui/icons";
import Link from "@material-ui/core/Link";
import FilterProductRequest from "models/product/FilterProductRequest";
import { useDispatch, useSelector } from "react-redux";
import { filterProducts } from "redux/actions/productActions";
import {
  setCheckedColours,
  setCheckedSizes,
  setCheckedTags,
  setPriceRange,
  setSelectedSort
} from "redux/actions/filterBarActions";

const _ = require("lodash");
const useStyles = makeStyles(styles);
const useSelectStyles = makeStyles(selectStyles);

function FilterBar(props) {
  const classes = useStyles();
  const selectClasses = useSelectStyles();
  const { allTags, allColours, categoryId } = props;

  const dispatch = useDispatch();

  const keyByAllTags = _.keyBy(allTags, "name");
  const tagNames = Object.keys(keyByAllTags);
  const initialTagsState = {};
  tagNames.map(key => (initialTagsState[key] = false));

  const allSizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
  const initialSizesState = {};
  allSizes.forEach(size => (initialSizesState[size] = false));

  const initialColoursState = {};
  allColours.forEach(colour => (initialColoursState[colour] = false));

  const sortingMap = {
    "Latest Arrivals": "LATEST_ARRIVAL",
    "Price (Low to High)": "PRICE_LOW_TO_HIGH",
    "Price (High To Low)": "PRICE_HIGH_TO_LOW",
    // "Rating (High to Low)": "RATING_HIGH_TO_LOW",
    // "Rating (Low to High)": "Rating RATING_LOW_TO_HIGH",
    // Discount: "DISCOUNTED_AMOUNT_HIGH_TO_LOW",
    // Popularity: "POPULARITY",
    "Stock (Low to High)": "QUANTITY_LOW_TO_HIGH",
    "Stock (High to Low)": "QUANTITY_HIGH_TO_LOW"
  };
  const sortingOptions = Object.keys(sortingMap);

  // const [priceRange, setPriceRange] = useState([0, 200]);
  // const [checkedColours, setCheckedColours] = useState(initialColoursState);
  // const [checkedSizes, setCheckedSizes] = useState(initialSizesState);
  // const [checkedTags, setCheckedTags] = useState(initialTagsState);
  // const [selectedSort, setSelectedSort] = useState("Latest Arrivals");

  const priceRange = useSelector(state => state.filterBar.priceRange);
  const checkedColours = useSelector(state => state.filterBar.checkedColours);
  const checkedSizes = useSelector(state => state.filterBar.checkedSizes);
  const checkedTags = useSelector(state => state.filterBar.checkedTags);
  const selectedSort = useSelector(state => state.filterBar.selectedSort);

  useEffect(() => {
    if (priceRange === null) {
      dispatch(setPriceRange([0, 200]));
    }
    if (checkedColours === null) {
      dispatch(setCheckedColours(initialColoursState));
    }
    if (checkedSizes === null) {
      dispatch(setCheckedSizes(initialSizesState));
    }
    if (checkedTags === null) {
      dispatch(setCheckedTags(initialTagsState));
    }
    if (selectedSort === null) {
      dispatch(setSelectedSort(Object.keys(sortingMap)[0]));
    }
  });

  const handleCheckColour = key => event => {
    dispatch(
      setCheckedColours({
        ...checkedColours,
        [key]: event.target.checked
      })
    );
  };

  const handleCheckSize = key => event => {
    dispatch(
      setCheckedSizes({
        ...checkedSizes,
        [key]: event.target.checked
      })
    );
  };

  const handleCheckTag = key => event => {
    dispatch(
      setCheckedTags({
        ...checkedTags,
        [key]: event.target.checked
      })
    );
  };

  const countApplied = obj => {
    let count = 0;
    Object.keys(obj).forEach(key => {
      if (obj[key]) count++;
    });
    return count;
  };

  const resetFilter = () => {
    dispatch(setPriceRange([0, 200]));
    dispatch(setCheckedColours(initialColoursState));
    dispatch(setCheckedTags(initialTagsState));
    dispatch(setCheckedSizes(initialSizesState));
    const req = new FilterProductRequest(
      categoryId,
      [],
      [],
      [],
      0,
      200,
      sortingMap[Object.keys(sortingMap)[0]]
    );
    dispatch(filterProducts(req));
  };

  const handleSubmit = () => {
    const tags = [];
    allTags.forEach(tag => {
      if (checkedTags[tag.name]) {
        tags.push(_.pick(tag, ["tagId", "name"]));
      }
    });
    const colours = allColours.filter(colour => checkedColours[colour]);
    const sizes = allSizes.filter(size => checkedSizes[size]);
    const minPrice = priceRange[0];
    const maxPrice = priceRange[1];
    const sortEnum = sortingMap[selectedSort];
    const req = new FilterProductRequest(
      categoryId,
      tags,
      colours,
      sizes,
      minPrice,
      maxPrice,
      sortEnum
    );

    dispatch(filterProducts(req));
  };

  return (
    allTags &&
    allColours &&
    priceRange &&
    checkedColours &&
    checkedSizes &&
    checkedTags &&
    selectedSort && (
      <Card plain>
        <Fab
          color="secondary"
          variant="extended"
          className={classes.floatingFilterDrawer}
          onClick={handleSubmit}
        >
          <Publish /> Submit
        </Fab>
        <CardBody className={classes.cardBodyRefine}>
          <h4 className={classes.cardTitle + " " + classes.textLeft}>
            Sort By
          </h4>
          <FormControl fullWidth className={selectClasses.selectFormControl}>
            <Select
              id="sort-select"
              value={selectedSort}
              onChange={e => dispatch(setSelectedSort(e.target.value))}
            >
              {sortingOptions.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <h4 className={classes.cardTitle + " " + classes.textLeft}>
            Filter by
            <Tooltip
              id="tooltip-top"
              title="Reset Filter"
              placement="top"
              classes={{ tooltip: classes.tooltip }}
            >
              <Link
                component="button"
                variant="body2"
                onClick={resetFilter}
                style={{ float: "right" }}
              >
                <h4 className={classes.reset}>Reset</h4>
              </Link>
            </Tooltip>
            <Clearfix />
          </h4>
          <Accordion
            activeColor="rose"
            collapses={[
              {
                title: `Price Range ${
                  priceRange[0] !== 0 || priceRange[1] !== 200
                    ? "(applied)"
                    : ""
                }`,
                key: "Price Range",
                content: (
                  <CardBody className={classes.cardBodyRefine}>
                    <span
                      className={classNames(
                        classes.pullLeft,
                        classes.priceSlider
                      )}
                    >
                      ${priceRange[0]}
                    </span>
                    <span
                      className={classNames(
                        classes.pullRight,
                        classes.priceSlider
                      )}
                    >
                      ${priceRange[1]}
                    </span>
                    <br />
                    <Slider
                      value={priceRange}
                      onChange={(e, newVal) => {
                        dispatch(setPriceRange(newVal));
                      }}
                      valueLabelDisplay="auto"
                      min={0}
                      max={200}
                      style={{
                        borderColor: "#e91e63"
                      }}
                    />
                  </CardBody>
                )
              },
              {
                title: `Colours (${countApplied(checkedColours)} applied)`,
                key: "Colour select",
                content: allColours && !_.isEmpty(checkedColours) && (
                  <CheckboxGroup
                    list={allColours}
                    checkedState={checkedColours}
                    handleChange={handleCheckColour}
                    isColours={true}
                  />
                )
              },
              {
                title: `Sizes (${countApplied(checkedSizes)} applied)`,
                key: "Sizes select",
                content: (
                  <CheckboxGroup
                    list={allSizes}
                    checkedState={checkedSizes}
                    handleChange={handleCheckSize}
                  />
                )
              },
              {
                title: `Tags (${countApplied(checkedTags)} applied)`,
                key: "Tag select",
                content: (
                  <CheckboxGroup
                    list={tagNames}
                    checkedState={checkedTags}
                    handleChange={handleCheckTag}
                  />
                )
              }
            ]}
          />
        </CardBody>
      </Card>
    )
  );
}

export default FilterBar;
