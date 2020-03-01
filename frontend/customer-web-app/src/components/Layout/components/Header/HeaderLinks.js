/* eslint-disable */
import React, { useEffect } from "react";
// nodejs library to set properties for components
import * as PropTypes from "prop-types";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import ViewDay from "@material-ui/icons/ViewDay";
import ViewCarousel from "@material-ui/icons/ViewCarousel";

// core components
import CustomDropdown from "components/UI/CustomDropdown/CustomDropdown.js";
import Button from "components/UI/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-pro-react/components/headerLinksStyle.js";
import { AccountCircle, Favorite, Search } from "@material-ui/icons";
import CustomInput from "components/UI/CustomInput/CustomInput";
import Hidden from "@material-ui/core/Hidden";
import AccountNavbar from "components/Layout/components/Header/AccountNavbar";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core";
import CategoryNavbar from "components/Layout/components/Header/CategoryNavbar";
import { useDispatch, useSelector } from "react-redux";
import { retrieveAllRootCategories } from "redux/actions/categoryActions";
import AgAutocomplete from "components/Algolia/AgAutocomplete";

const useStyles = makeStyles(styles);

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: "100%",
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9"
  }
}))(Tooltip);

export default function HeaderLinks(props) {
  const rootCategories = useSelector(state => state.category.rootCategories);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(retrieveAllRootCategories());
  }, []);
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const smoothScroll = (e, target) => {
    if (window.location.pathname === "/sections") {
      let isMobile = navigator.userAgent.match(
        /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
      );
      if (isMobile) {
        // if we are on mobile device the scroll into view will be managed by the browser
      } else {
        e.preventDefault();
        let targetScroll = document.getElementById(target);
        scrollGo(document.documentElement, targetScroll.offsetTop, 1250);
      }
    }
  };
  const scrollGo = (element, to, duration) => {
    let start = element.scrollTop,
      change = to - start,
      currentTime = 0,
      increment = 20;

    let animateScroll = function() {
      currentTime += increment;
      let val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  };

  const { dropdownHoverColor } = props;
  const classes = useStyles();
  return (
    <React.Fragment>
      <List className={classes.list + " " + classes.mrAuto}>
        {rootCategories &&
          rootCategories.map(rc => (
            <ListItem key={rc.categoryId} className={classes.listItem}>
              <CategoryNavbar category={rc} />
            </ListItem>
          ))}
        <ListItem className={classes.listItem}>
          <CustomDropdown
            noLiPadding
            navDropdown
            hoverColor={dropdownHoverColor}
            buttonText="Lookbook"
            buttonProps={{
              className: classes.navLink,
              color: "transparent"
            }}
            buttonIcon={ViewCarousel}
            dropdownList={[]}
          />
        </ListItem>
      </List>
      <List className={classes.list + " " + classes.mlAuto}>
        <ListItem>
          <AgAutocomplete />
          <Button color="white" justIcon round>
            <Search className={classes.searchIcon} />
          </Button>
        </ListItem>
        <ListItem className={classes.listItem}>
          <AccountNavbar />
        </ListItem>
        <ListItem className={classes.listItem}>
          <Button className={classes.navLink} round color="transparent">
            <Favorite />
            <Hidden mdUp implementation="css" className={classes.hidden}>
              <div className={classes.collapse}>Wishlist</div>
            </Hidden>
          </Button>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Button className={classes.navLink} round color="transparent">
            <Link key="login" to="/shoppingCart" style={{ color: "#555555" }}>
              <ShoppingCart className={classes.icons} /> Shop
            </Link>
          </Button>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Button className={classes.navLink} round color="transparent">
            <ShoppingCart className={classes.icons} /> Reserve
          </Button>
        </ListItem>
      </List>
    </React.Fragment>
  );
}

HeaderLinks.defaultProps = {
  hoverColor: "primary"
};

HeaderLinks.propTypes = {
  dropdownHoverColor: PropTypes.oneOf([
    "dark",
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose"
  ])
};
