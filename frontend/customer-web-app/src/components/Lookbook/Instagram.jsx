import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import Card from "components/UI/Card/Card";
import CardHeader from "components/UI/Card/CardHeader";
import CardBody from "components/UI/Card/CardBody";
import Muted from "components/UI/Typography/Muted";

import instagramStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/teamsStyle";
import { retrieveAllActiveInstagramPost } from "../../redux/actions/instagramActions";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(instagramStyle);
const _ = require("lodash");

const Instagram = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const instagramPosts = useSelector(state => state.instagram.instagramPosts);

  useEffect(() => {
    dispatch(retrieveAllActiveInstagramPost());
  }, []);

  console.log(instagramPosts);
  return (
    <div className={classes.team}>
      <div className={classes.container}>
        <GridContainer>
          {instagramPosts.map(({ instagramImgUrl, associatedProducts }) => {
            return (
              <GridItem xs={12} sm={4} md={4}>
                <Card plain profile>
                  <CardHeader image plain>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <img src={instagramImgUrl} alt="..." />
                    </a>
                    <div
                      className={classes.coloredShadow}
                      style={{
                        backgroundImage: `url(${instagramImgUrl})`,
                        opacity: "1"
                      }}
                    />
                  </CardHeader>
                  <CardBody plain>
                    {/* <h4 className={classes.cardTitle}>Alec Thompson</h4> */}
                    {associatedProducts.map(
                      ({ productName, productId }, index) => {
                        return (
                          <Muted>
                            <Link to={`/shop/product/${productId}`}>
                              <h6 className={classes.cardCategory}>
                                {productName}
                              </h6>
                              {index < associatedProducts.length - 1 && (
                                <Divider className={classes.divider} />
                              )}
                            </Link>
                          </Muted>
                        );
                      }
                    )}
                  </CardBody>
                </Card>
              </GridItem>
            );
          })}
        </GridContainer>
      </div>
    </div>
  );
};

export default Instagram;
