import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// react component for creating beautiful carousel
import Carousel from "react-slick";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import LocationOn from "@material-ui/icons/LocationOn";
import { Block } from "@material-ui/icons";
// core components
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem.js";
import Card from "components/UI/Card/Card.js";
import carouselStyle from "assets/jss/material-kit-pro-react/views/componentsSections/carouselStyle.js";

import image1 from "assets/img/bg.jpg";
import image2 from "assets/img/bg2.jpg";
import image3 from "assets/img/bg3.jpg";
import { retrieveAllActiveAdvertisement } from "redux/actions/advertisementActions";

const useStyles = makeStyles(carouselStyle);

const AdvertisementCarousel = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const advertisements = useSelector(
    state => state.advertisement.advertisements
  );

  useEffect(() => {
    dispatch(retrieveAllActiveAdvertisement());
  }, []);

  const settings = {
    // dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
  };

  return (
    <div
    // className={classes.section} id="carousel"
    >
      <div
      // className={classes.container}
      >
        <GridContainer>
          <GridItem xs={12} sm={10} md={8} className={classes.marginAuto}>
            <Card>
              <Carousel {...settings}>
                {advertisements.map((e, index) => {
                  return (
                    <div key={index}>
                      <img
                        src={e.advertisementImgUrl}
                        alt="First slide"
                        className="slick-image"
                      />
                    </div>
                  );
                })}
              </Carousel>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
};

export default AdvertisementCarousel;
