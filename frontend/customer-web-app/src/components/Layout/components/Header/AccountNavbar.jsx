import React from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-kit-pro-react/components/headerLinksStyle.js";
import CustomDropdown from "components/UI/CustomDropdown/CustomDropdown";
import Button from "components/UI/CustomButtons/Button";
import { AccountCircle } from "@material-ui/icons";
import Hidden from "@material-ui/core/Hidden";
import Tooltip from "@material-ui/core/Tooltip";
const useStyles = makeStyles(styles);

// Responsive component
function AccountNavbar(props) {
  const classes = useStyles();
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
      <HtmlTooltip title={renderAccountTooltipContent(classes)} interactive>
        <Button className={classes.navLink} round color="transparent">
          <AccountCircle />
        </Button>
      </HtmlTooltip>
    </React.Fragment>
  );
};

// Renders tooltip content after hovering button
const renderAccountTooltipContent = classes => {
  return (
    <React.Fragment>
      <h3> Welcome </h3>
      {renderAccDropdownLinks(classes)}
    </React.Fragment>
  );
};

// Renders dropdown menu the drawer in responsive mode (smDown)
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
const renderAccDropdownLinks = classes => [
  <Link to="/login" className={classes.dropdownLink}>
    Login
  </Link>,
  <Link to="/account/register" className={classes.dropdownLink}>
    Register
  </Link>
];

export default AccountNavbar;

// Styling of tooltip content
const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: "100%",
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9"
  }
}))(Tooltip);
