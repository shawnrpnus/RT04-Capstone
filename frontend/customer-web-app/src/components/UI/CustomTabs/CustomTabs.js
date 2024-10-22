import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/Card/CardContent";
// import CardHeader from "@material-ui/core/Card/CardHeader";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// core components
import Card from "components/UI/Card/Card.js";
import CardBody from "components/UI/Card/CardBody.js";
import CardHeader from "components/UI/Card/CardHeader.js";
import styles from "assets/jss/material-kit-pro-react/components/customTabsStyle.js";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(styles);

function CustomTabs(props) {
  const history = useHistory();
  const [value, setValue] = React.useState(
    props.activeIndex ? props.activeIndex : 0
  );
  const handleChange = (event, value) => {
    setValue(value);
  };
  const { headerColor, title, tabs, rtlActive, plainTabs, className } = props;
  const classes = useStyles();
  const cardTitle = classNames({
    [classes.cardTitle]: true,
    [classes.cardTitleRTL]: rtlActive
  });
  const tabsContainer = classNames({
    [classes.tabsContainer]: true,
    [classes.tabsContainerRTL]: rtlActive
  });
  return (
    <Card plain={plainTabs} className={className}>
      <CardHeader color={headerColor} plain={plainTabs}>
        {title !== undefined ? (
          <div className={cardTitle}>{"title"}</div>
        ) : null}
        <Tabs
          classes={{
            root: classes.customTabsRoot,
            flexContainer: tabsContainer,
            indicator: classes.displayNone
          }}
          value={value}
          onChange={handleChange}
          textColor="inherit"
        >
          {tabs.map((prop, key) => {
            var icon = {};
            if (prop.tabIcon !== undefined) {
              icon = {
                icon: <prop.tabIcon className={classes.tabIcon} />
              };
            } else {
              icon = {};
            }
            return (
              <Tab
                key={key}
                classes={{
                  root: classes.customTabRoot,
                  selected: classes.customTabSelected,
                  wrapper: classes.customTabWrapper
                }}
                onClick={() => history.push(prop.route)}
                // icon={<prop.tabIcon className={tabIcon} />}
                {...icon}
                label={prop.tabName}
              />
            );
          })}
        </Tabs>
      </CardHeader>
      <CardBody>
        {tabs.map((prop, key) => {
          if (key === value) {
            return <div key={key}>{prop.tabContent}</div>;
          }
          return null;
        })}
      </CardBody>
    </Card>
  );
}

CustomTabs.defaultProps = {
  headerColor: "purple"
};

CustomTabs.propTypes = {
  headerColor: PropTypes.oneOf([
    "warning",
    "success",
    "danger",
    "info",
    "primary",
    "rose"
  ]),
  title: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabName: PropTypes.string.isRequired,
      tabIcon: PropTypes.object,
      tabContent: PropTypes.node.isRequired
    })
  ),
  rtlActive: PropTypes.bool,
  plainTabs: PropTypes.bool
};

export { CustomTabs };
