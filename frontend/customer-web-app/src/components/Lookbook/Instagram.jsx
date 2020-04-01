import React, { useEffect, useState } from "react";
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
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState("");

  console.log(hoveredProductId);
  useEffect(() => {
    dispatch(retrieveAllActiveInstagramPost());
  }, []);

  return (
    <div className={classes.team}>
      <div className={classes.container}>
        <GridContainer>
          {instagramPosts.map(
            ({ instagramImgUrl, associatedProducts, shortCode }, index) => {
              return (
                <GridItem
                  xs={12}
                  sm={4}
                  md={4}
                  key={index}
                  spacing={2}
                  alignItems="center"
                >
                  <Card plain profile>
                    <CardHeader image plain>
                      <a
                        href={`https://instagram.com/p/${shortCode}`}
                        target="_blank"
                      >
                        <img
                          src={instagramImgUrl}
                          style={{
                            height: "350px",
                            width: "auto"
                          }}
                          alt={shortCode}
                        />
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
                        (
                          { productName, productId, productVariants },
                          index
                        ) => {
                          return (
                            <Muted key={index}>
                              <Link to={`/shop/product/${productId}`}>
                                <h6
                                  className={classes.cardCategory}
                                  id={productId}
                                  onMouseEnter={e => {
                                    setHoveredProductId(e.currentTarget.id);
                                    setIsHovering(true);
                                  }}
                                  onMouseLeave={e => setIsHovering(false)}
                                >
                                  {productName}
                                </h6>

                                {index < associatedProducts.length - 1 && (
                                  <Divider className={classes.divider} />
                                )}
                              </Link>
                              {isHovering &&
                                hoveredProductId === productId.toString() && (
                                  <img
                                    style={{
                                      position: "absolute",
                                      height: "40%",
                                      bottom: "1px",
                                      zIndex: 500
                                    }}
                                    src={
                                      productVariants[0].productImages[0]
                                        .productImageUrl
                                    }
                                  />
                                )}
                            </Muted>
                          );
                        }
                      )}
                    </CardBody>
                  </Card>
                </GridItem>
              );
            }
          )}
        </GridContainer>
      </div>
    </div>
  );
};

export default Instagram;
