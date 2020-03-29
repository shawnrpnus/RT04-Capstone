import {
  cardTitle,
  coloredShadow,
  container,
  grayColor,
  mlAuto,
  mrAuto,
  section,
  main,
  whiteColor,
  mainRaised,
  title
} from "assets/jss/material-kit-pro-react.js";

import customCheckboxRadioSwitch from "assets/jss/material-kit-pro-react/customCheckboxRadioSwitchStyle.js";

import tooltipsStyle from "assets/jss/material-kit-pro-react/tooltipsStyle.js";
import imagesStyles from "assets/jss/material-kit-pro-react/imagesStyles";
import { blackColor } from "assets/jss/material-kit-pro-react";

const styles = theme => ({
  ...customCheckboxRadioSwitch,
  ...tooltipsStyle,
  main,
  title,
  ...imagesStyles,
  mainRaised: {
    ...mainRaised,
    margin: "-60px 30px 0px",
    "@media (max-width: 576px)": {
      marginTop: "0px"
    }
  },
  brand: {
    "& h1, & h4": {
      color: whiteColor
    }
  },
  checkRoot: {
    padding: "14px",
    "&:hover": {
      backgroundColor: "unset"
    }
  },
  coloredShadow,
  mlAuto,
  mrAuto,
  cardTitle: {
    ...cardTitle,
    textAlign: "left",
    marginBottom: "0px !important"
  },
  reset: {
    ...cardTitle,
    marginBottom: "0px !important",
    marginTop: "0px !important",
    color: "inherit !important"
  },
  cardDescription: {
    color: grayColor[0],
    textAlign: "center"
  },
  container: {
    ...container,
    zIndex: "2"
  },
  description: {
    color: grayColor[0]
  },
  section: {
    ...section,
    padding: "70px 0px"
  },
  priceContainer: {
    display: "inline-flex"
  },
  price: {
    ...cardTitle,
    color: grayColor[22],
    textAlign: "right",
    marginBottom: "0px !important"
  },
  pullRight: {
    float: "right"
  },
  cardHeaderImage: {
    position: "relative",
    padding: "0",
    zIndex: "1",
    marginLeft: "15px",
    marginRight: "15px",
    marginTop: "-30px",
    borderRadius: "6px",
    "& img": {
      width: "100%",
      borderRadius: "6px",
      pointerEvents: "none"
    },
    "& a": {
      display: "block"
    }
  },
  justifyContentBetween: {
    WebkitBoxPack: "justify!important",
    justifyContent: "space-between !important"
  },
  customExpandPanel: {
    maxHeight: "273px",
    overflowY: "scroll",
    "&  label": {
      display: "flex"
    }
  },
  priceSlider: {
    fontWeight: "500"
  },
  refineButton: {
    margin: "-3px 0"
  },
  cardBodyRefine: {
    paddingLeft: "15px",
    paddingRight: "15px"
  },
  textLeft: {
    textAlign: "left",
    marginTop: "2px"
  },
  textCenter: {
    textAlign: "center"
  },
  cardBodyPlain: {
    padding: "0",
    marginLeft: "3px",
    marginRight: "3px"
  },
  sizeChip: {
    borderRadius: "0",
    height: "20px",
    width: "30px "
  },
  heartIconBtn: {
    float: "right",
    position: "relative",
    bottom: "40px",
    right: "5px",
    marginBottom: "-40px",
    padding: "6px",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white"
    }
  },
  labelSmall: {
    padding: "0"
  },
  floatingFilter: {
    zIndex: "5",
    margin: 0,
    top: "auto",
    left: 20,
    bottom: 20,
    right: "auto",
    position: "fixed"
  },
  floatingFilterDrawer: {
    zIndex: "5",
    margin: 0,
    top: "auto",
    left: 175,
    bottom: 20,
    right: "auto",
    position: "fixed"
  },
  filterDrawer: {
    width: "300px"
  },
  labelText: {
    color: blackColor
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 999,
    color: "#fff"
  },
  discountedPrice: {
    color: "grey",
    textDecorationLine: "line-through",
    marginLeft: "5%",
    "@media (max-width: 500px)": {
      display: "flex",
      justifyContent: "flex-end"
    }
  }
});

export default styles;
