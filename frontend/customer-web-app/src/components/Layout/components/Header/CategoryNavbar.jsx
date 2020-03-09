import React from "react";
import { Link } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import headersStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/headersStyle";
import CustomDropdown from "components/UI/CustomDropdown/CustomDropdown";
import Button from "components/UI/CustomButtons/Button";
import { AccountCircle, ShoppingBasket } from "@material-ui/icons";
import Hidden from "@material-ui/core/Hidden";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import typographyStyle from "assets/jss/material-kit-pro-react/views/componentsSections/typographyStyle.js";
import classNames from "classnames";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import GridItem from "components/Layout/components/Grid/GridItem";
import GridContainer from "components/Layout/components/Grid/GridContainer";

const jsog = require("jsog");

const useHeaderStyles = makeStyles(headersStyle);
const useTypoStyles = makeStyles(typographyStyle);

// Responsive component, receives category prop from HeaderLinks
function CategoryNavbar(props) {
  const classes = useHeaderStyles();
  const { dropdownHoverColor, category } = props;
  return (
    <React.Fragment>
      <Hidden smDown className={classes.hidden}>
        <RenderCategoryToolTip classes={classes} category={category} />
      </Hidden>
      <Hidden mdUp className={classes.hidden}>
        <RenderCategoryDropdownDrawer
          dropdownHoverColor={dropdownHoverColor}
          classes={classes}
          category={category}
        />
      </Hidden>
    </React.Fragment>
  );
}

// Renders the button that when hovered, activates the tooltip
function RenderCategoryToolTip(props) {
  const { classes, category } = props;
  return (
    <React.Fragment>
      <HtmlTooltip
        // open={category.categoryName === "Men"}
        title={<CategoryToolTipContent rootCategory={category} />}
        interactive
      >
        <Button className={classes.navLink} round color="transparent">
          {category.categoryName}
        </Button>
      </HtmlTooltip>
    </React.Fragment>
  );
}

// Renders tooltip content after hovering button
function CategoryToolTipContent(props) {
  const { rootCategory } = props; // 2nd level categories
  const subCategories = rootCategory.childCategories;
  const numSubCategories = subCategories.length;
  return (
    <React.Fragment>
      <GridContainer>
        {subCategories.map(c => (
          <SubCategoryColumn
            key={c.categoryId}
            rootCategory={rootCategory}
            subCategory={c}
            numSubCategories={numSubCategories}
          />
        ))}
      </GridContainer>
    </React.Fragment>
  );
}

function SubCategoryColumn(props) {
  const { subCategory, rootCategory } = props;
  const leafCategories = subCategory.childCategories;
  const headerClasses = useHeaderStyles();
  const typoClasses = useTypoStyles();
  return (
    <GridItem md style={{ width: "10vw" }}>
      <Link
        to={`/shop/catalog/${rootCategory.categoryName}/${subCategory.categoryName}`}
      >
        <h5
          className={classNames(
            headerClasses.mlAuto,
            headerClasses.mrAuto,
            typoClasses.miniTitle
          )}
        >
          {subCategory.categoryName}
        </h5>
      </Link>
      <Divider />
      <List>
        {leafCategories.map(c => (
          <Link
            key={c.categoryId}
            to={`/shop/catalog/${rootCategory.categoryName}/${subCategory.categoryName}/${c.categoryName}`}
          >
            <ListItem button disableGutters>
              {c.categoryName}
            </ListItem>
          </Link>
        ))}
      </List>
    </GridItem>
  );
}

// Renders dropdown menu when the drawer in responsive mode (smDown)
function RenderCategoryDropdownDrawer(props) {
  const { dropdownHoverColor, classes, category } = props;
  const subs = renderSubCategoryDrawerLinks(
    classes,
    category.childCategories,
    category.categoryName
  );
  return (
    <CustomDropdown
      noLiPadding
      navDropdown
      hoverColor={dropdownHoverColor}
      buttonText={category.categoryName}
      buttonProps={{
        className: classes.navLink,
        color: "transparent"
      }}
      buttonIcon={ShoppingBasket}
      dropdownList={subs}
    />
  );
}

const renderSubCategoryDrawerLinks = (classes, childCategories, rootName) => {
  return childCategories.map(c => (
    <CustomDropdown
      key={c.categoryId}
      noLiPadding
      navDropdown
      buttonText={c.categoryName}
      buttonProps={{
        className: classes.navLink,
        color: "transparent"
      }}
      dropdownList={renderLeafCategoryDrawerLinks(
        classes,
        c.childCategories,
        c.categoryName,
        rootName
      )}
    />
  ));
};

const renderLeafCategoryDrawerLinks = (
  classes,
  leafCategories,
  subCategoryName,
  rootName
) => {
  const leafLinks = leafCategories.map(c => (
    <Link
      key={c.categoryId}
      to={`shop/catalog/${rootName}/${subCategoryName}/${c.categoryName}`}
      className={classes ? classes.dropdownLink : null}
    >
      {c.categoryName}
    </Link>
  ));
  return leafLinks;
};

function CategoryDrawerDropdown(props) {
  const { classes, category } = props;
}

export default CategoryNavbar;

// Styling of tooltip content
const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: "white",
    //color: "rgba(0, 0, 0, 0.87)",
    maxWidth: "100vw",
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #F0F0F0",
    borderRadius: "0",
    minWidth: "200px",
    padding: "10px"
  }
}))(Tooltip);
