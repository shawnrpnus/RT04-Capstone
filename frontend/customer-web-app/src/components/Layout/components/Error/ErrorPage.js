/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Layout/components/Grid/GridContainer.js";
import GridItem from "components/Layout/components/Grid/GridItem.js";

import errorPageStyle from "assets/jss/material-kit-pro-react/views/errorPageStyles.js";

import image from "assets/img/clint-mckoy.jpg";

const useStyles = makeStyles(errorPageStyle);

export default function ErrorPage({ ...rest }) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();
  return (
    <div>
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        {/* <div className={classes.container}> */}
        <div className={classes.contentCenter}>
          <GridContainer>
            <GridItem md={12}>
              <h1 className={classes.title}>404</h1>
              <h2 className={classes.subTitle}>Page not found :(</h2>
              <h4 className={classes.description}>
                Ooooops! Looks like you got lost.
              </h4>
            </GridItem>
          </GridContainer>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
