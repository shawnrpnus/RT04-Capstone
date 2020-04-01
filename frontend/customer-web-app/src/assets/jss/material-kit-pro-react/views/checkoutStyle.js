import {
  container,
  title,
  cardTitle,
  main,
  mainRaised,
  mrAuto,
  whiteColor,
  grayColor,
  mlAuto,
  primaryColor,
  primaryBoxShadow
} from "assets/jss/material-kit-pro-react.js";

import buttonGroup from "assets/jss/material-kit-pro-react/buttonGroupStyle.js";
import tooltips from "assets/jss/material-kit-pro-react/tooltipsStyle.js";

const styles = {
  main,
  mainRaised,
  mrAuto,
  mlAuto,
  cardTitle,
  ...buttonGroup,
  ...tooltips,
  container: {
    ...container,
    zIndex: 1,
    ["@media (min-width: 600px)"]: {
      maxWidth: "1550px"
    }
  },
  title: {
    ...title,
    "&, & + h4": {
      color: whiteColor
    }
  },
  block: {
    color: "inherit",
    padding: "0.9375rem",
    fontWeight: "500",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    textDecoration: "none",
    position: "relative",
    display: "block"
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto"
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0"
  },
  left: {
    float: "left!important",
    display: "block"
  },
  right: {
    padding: "15px 0",
    margin: "0",
    float: "right"
  },
  icon: {
    width: "18px",
    height: "18px",
    top: "3px",
    position: "relative"
  },
  imgContainer: {
    width: "100%",
    // maxHeight: "160px",
    marginLeft: "10%",
    transform: "scale(0.9)",
    overflow: "hidden",
    display: "block",
    "& img": {
      width: "100%"
    },
    ["@media(max-width: 500px)"]: {
      transform: "scale(0.8)",
      marginTop: "-8%",
      marginLeft: "0"
    }
  },
  description: {
    maxWidth: "150px"
  },
  tdName: {
    minWidth: "200px",
    fontWeight: "400",
    fontSize: "1.5em"
  },
  tdNameAnchor: {
    color: grayColor[1]
  },
  tdNameSmall: {
    color: grayColor[0],
    fontSize: "0.75em",
    fontWeight: "300"
  },
  tdNumber: {
    textAlign: "right",
    minWidth: "150px",
    fontWeight: "300",
    fontSize: "1.125em !important"
  },
  tdNumberSmall: {
    marginRight: "3px"
  },
  tdNumberAndButtonGroup: {
    lineHeight: "1 !important",
    "& svg,& .fab,& .fas,& .far,& .fal,& .material-icons": {
      marginRight: "0"
    }
  },
  customFont: {
    fontSize: "16px !important"
  },
  actionButton: {
    margin: "0px",
    padding: "5px"
  },
  textCenter: {
    textAlign: "center"
  },
  textRight: {
    textAlign: "right"
  },
  buttonTopMargin: {
    "@media (max-width: 500px)": {
      marginTop: "7%"
    },
    marginTop: "17px"
  },
  productName: {
    ...title,
    marginTop: "0",
    marginBottom: "0"
  },
  selectMenuItem: {
    fontSize: "15px",
    padding: "10px 20px",
    margin: "0 5px",
    textAlign: "center",
    borderRadius: "2px",
    transition: "all 150ms linear",
    display: "block",
    clear: "both",
    fontWeight: "400",
    lineHeight: "2",
    whiteSpace: "nowrap",
    color: grayColor[8],
    paddingRight: "30px",
    "&:hover": {
      backgroundColor: primaryColor[0],
      color: whiteColor,
      ...primaryBoxShadow
    }
  },
  selectMenuItemSelected: {
    backgroundColor: primaryColor[0] + "!important",
    color: whiteColor
  },
  checkoutTitle: {
    ...title,
    marginLeft: "5px",
    marginRight: "5px",
    "@media (max-width: 500px)": {
      fontSize: "125%"
    }
  },
  discountedPrice: {
    color: "grey",
    textDecorationLine: "line-through",
    marginLeft: "5%",
    fontSize: "15px"
  },
  checkoutButton: {
    "@media (max-width: 500px)": {
      width: "inherit"
    }
  },
  discountedTotal: {
    ...title,
    textDecoration: "line-through",
    fontSize: "125%",
    marginLeft: "5px",
    marginRight: "5px",
    margin: 0,
    "@media (max-width: 500px)": {
      fontSize: "80%"
    }
  }
};

export default styles;
