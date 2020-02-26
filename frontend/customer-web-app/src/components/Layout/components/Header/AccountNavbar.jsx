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
const jsog = require("jsog");

const useHeaderStyles = makeStyles(headersStyle);
const useTypoStyles = makeStyles(typographyStyle);

// Responsive component
function AccountNavbar(props) {
  const classes = useHeaderStyles();
  const { dropdownHoverColor } = props;
  return (
    <React.Fragment>
      <Hidden smDown className={classes.hidden}>
        {renderAccountTooltip(classes)}
      </Hidden>
      <Hidden mdUp className={classes.hidden}>
        {renderAccountDropdownDrawer(dropdownHoverColor, classes)}
      </Hidden>
    </React.Fragment>
  );
}

// Renders the button that when hovered, activates the tooltip
const renderAccountTooltip = classes => {
  return (
    <React.Fragment>
      <HtmlTooltip title={<AccountToolTipContent />} interactive>
        <Button className={classes.navLink} round color="transparent">
          <AccountCircle />
        </Button>
      </HtmlTooltip>
    </React.Fragment>
  );
};

// Renders tooltip content after hovering button
function AccountToolTipContent(props) {
  const headerClasses = useHeaderStyles();
  const typoClasses = useTypoStyles();

  let customer = localStorage.getItem("customer");
  if (customer) customer = jsog.parse(customer);
  console.log(customer);
  return (
    <React.Fragment>
      <h4
        className={classNames(
          headerClasses.mlAuto,
          headerClasses.mrAuto,
          headerClasses.textCenter,
          typoClasses.miniTitle
        )}
      >
        Welcome{customer ? `, ${customer.firstName}` : ""}
      </h4>
      <Divider />
      <List component="nav">
        {renderAccDropdownLinks(undefined, ListItem, { button: true })}
      </List>
    </React.Fragment>
  );
}

// Renders dropdown menu when the drawer in responsive mode (smDown)
const renderAccountDropdownDrawer = (dropdownHoverColor, classes) => (
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

export default AccountNavbar;

// Styling of tooltip content
const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: "100%",
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
    width: "200px",
    padding: "0"
  }
}))(Tooltip);
