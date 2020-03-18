import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import styles from "assets/jss/material-kit-pro-react/views/componentsSections/footerStyle.js";
import GridContainer from "components/Layout/components/Grid/GridContainer.js";
import GridItem from "components/Layout/components/Grid/GridItem.js";
import Footer from "components/Layout/components/Footer/components/Footer.js";
import { retrieveAllActiveInstagramPost } from "./../../../../redux/actions/instagramActions";

const useStyles = makeStyles(styles);

export default function FooterSection() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const instagramPosts = useSelector(state => state.instagram.instagramPosts);

  useEffect(() => {
    dispatch(retrieveAllActiveInstagramPost());
  }, []);

  return (
    <Footer
      theme="dark"
      content={
        <div>
          <div className={classes.left}>
            <List className={classes.list}>
              <ListItem className={classes.inlineBlock}>
                <a
                  href="#pablo"
                  className={classes.block}
                  onClick={e => e.preventDefault()}
                >
                  Blog
                </a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a
                  href="#pablo"
                  className={classes.block}
                  onClick={e => e.preventDefault()}
                >
                  Presentation
                </a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a
                  href="#pablo"
                  className={classes.block}
                  onClick={e => e.preventDefault()}
                >
                  Discover
                </a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a
                  href="#pablo"
                  className={classes.block}
                  onClick={e => e.preventDefault()}
                >
                  Payment
                </a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <Link
                  className={classes.block}
                  key="contactUs"
                  to="/contactUs/ticket"
                >
                  Contact Us
                </Link>
              </ListItem>
            </List>
          </div>
          <div className={classes.right}>
            Copyright &copy; {1900 + new Date().getYear()}{" "}
            <a
              href="https://www.creative-tim.com?ref=mkpr-footer-components"
              target="_blank"
              className={classes.aClasses}
            >
              Creative Tim
            </a>{" "}
            All Rights Reserved.
          </div>
        </div>
      }
    >
      <GridContainer>
        <GridItem xs={12} sm={4} md={4}>
          <h5>About Us</h5>
          <p>
            Creative Tim is a startup that creates design tools that make the
            web development process faster and easier.{" "}
          </p>
          <p>
            We love the web and care deeply for how users interact with a
            digital product. We power businesses and individuals to create
            better looking web projects around the world.{" "}
          </p>
        </GridItem>
        <GridItem xs={12} sm={4} md={4}>
          <h5>Social Feed</h5>
          <div className={classes.socialFeed}>
            <div>
              <i className="fab fa-twitter" />
              <p>How to handle ethical disagreements with your clients.</p>
            </div>
            <div>
              <i className="fab fa-twitter" />
              <p>The tangible benefits of designing at 1x pixel density.</p>
            </div>
            <div>
              <i className="fab fa-facebook-square" />
              <p>
                A collection of 25 stunning sites that you can use for
                inspiration.
              </p>
            </div>
          </div>
        </GridItem>
        <GridItem xs={12} sm={4} md={4}>
          <h5>Instagram Feed</h5>
          <div className={classes.galleryFeed}>
            {instagramPosts.map(({ instagramImgUrl, shortCode }) => {
              return (
                <a
                  key={shortCode}
                  href={`https://www.instagram.com/p/${shortCode}`}
                  target="_blank"
                >
                  <img
                    src={instagramImgUrl}
                    className={classNames(
                      classes.img,
                      classes.imgRaised,
                      classes.imgRounded
                    )}
                    alt={`https://www.instagram.com/p/${shortCode}`}
                  />
                </a>
              );
            })}
          </div>
        </GridItem>
      </GridContainer>
    </Footer>
  );
}
