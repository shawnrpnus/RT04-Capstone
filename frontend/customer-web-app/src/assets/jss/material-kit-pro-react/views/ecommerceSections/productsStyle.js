import {
  cardTitle,
  coloredShadow,
  container,
  grayColor,
  mlAuto,
  mrAuto,
  section,
  main,
  mainRaised
} from "assets/jss/material-kit-pro-react.js";

import customCheckboxRadioSwitch from "assets/jss/material-kit-pro-react/customCheckboxRadioSwitchStyle.js";

import tooltipsStyle from "assets/jss/material-kit-pro-react/tooltipsStyle.js";
import imagesStyles from "assets/jss/material-kit-pro-react/imagesStyles";

const styles = {
  ...customCheckboxRadioSwitch,
  ...tooltipsStyle,
  main,
  ...imagesStyles,
  mainRaised: {
    ...mainRaised,
    margin: "0px 30px 0px",
    "@media (max-width: 576px)": {
      marginTop: "0px"
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
  cardDescription: {
    color: grayColor[0],
    textAlign: "center"
  },
  container: {
    ...container
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
      display: "block"
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
    marginLeft: "18px",
    marginRight: "18px"
  },
  sizeChip: {
    borderRadius: "0",
    height: "20px"
  },
  heartChip: {
    height: "20px"
  }
};

export default styles;
