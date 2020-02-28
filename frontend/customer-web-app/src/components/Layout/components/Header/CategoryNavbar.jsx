import React from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import headersStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/headersStyle";
import CustomDropdown from "components/UI/CustomDropdown/CustomDropdown";
import Button from "components/UI/CustomButtons/Button";
import { AccountCircle } from "@material-ui/icons";
import Hidden from "@material-ui/core/Hidden";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import typographyStyle from "assets/jss/material-kit-pro-react/views/componentsSections/typographyStyle.js";
import classNames from "classnames";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { useDispatch, useSelector } from "react-redux";
import { customerLogout } from "redux/actions/customerActions";
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
        <RenderAccountDropdownDrawer
          dropdownHoverColor={dropdownHoverColor}
          classes={classes}
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
    <GridItem md>
      <Link
        to={`/shop/${rootCategory.categoryName}/${subCategory.categoryName}`}
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
            to={`/shop/${rootCategory.categoryName}/${subCategory.categoryName}/${c.categoryName}`}
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
function RenderAccountDropdownDrawer(props) {
  const { dropdownHoverColor, classes } = props;
  return (
    <CustomDropdown
      noLiPadding
      navDropdown
      hoverColor={dropdownHoverColor}
      buttonText="Account"
      buttonProps={{
        className: classes.navLink,
        color: "transparent"
      }}
      buttonIcon={AccountCircle}
      dropdownList={renderAccDropdownLinks(classes)}
    />
  );
}

// Standard links in tooltip and drawer
const renderAccDropdownLinks = (classes, Component, componentProps) => {
  return [
    <Link
      key="login"
      to="/account/login"
      className={classes ? classes.dropdownLink : null}
    >
      {Component ? <Component {...componentProps}>Login</Component> : "Login"}
    </Link>,
    <Link
      key="register"
      to="/account/register"
      className={classes ? classes.dropdownLink : null}
    >
      {Component ? (
        <Component {...componentProps}>Register</Component>
      ) : (
        "Register"
      )}
    </Link>
  ];
};

function AccDropDownLinksAfterLogin(props) {
  const { classes, Component, componentProps } = props;
  const dispatch = useDispatch();
  return [
    <Link
      key="profile"
      to="/account/profile"
      className={classes ? classes.dropdownLink : null}
    >
      {Component ? (
        <Component {...componentProps}>My Profile</Component>
      ) : (
        "My Profile"
      )}
    </Link>,
    <Link
      key="logout"
      to="/"
      className={classes ? classes.dropdownLink : null}
      onClick={() => dispatch(customerLogout())}
    >
      {Component ? <Component {...componentProps}>Logout</Component> : "Logout"}
    </Link>
  ];
}

export default CategoryNavbar;

// Styling of tooltip content
const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: "100vw",
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
    minWidth: "200px",
    padding: "10px"
  }
}))(Tooltip);
