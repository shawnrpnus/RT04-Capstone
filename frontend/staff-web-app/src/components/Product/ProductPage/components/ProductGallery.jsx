/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
const _ = require("lodash");

export default class ProductGallery extends PureComponent {
  static propTypes = {
    colourSizeMap: PropTypes.arrayOf(
      PropTypes.shape({
        productImages: PropTypes.arrayOf(
          PropTypes.shape({
            productImageUrl: PropTypes.string
          })
        )
      })
    ).isRequired
  };

  constructor() {
    super();
    this.state = {
      lightboxIsOpen: false,
      currentImage: 0,
      currentImagePreview: 0
    };
  }

  changeImg = (i, e) => {
    e.preventDefault();
    this.setState({
      currentImagePreview: i,
      currentImage: i
    });
  };

  openLightbox = (index, event) => {
    event.preventDefault();
    this.setState({
      currentImage: index,
      lightboxIsOpen: true
    });
  };

  closeLightbox = () => {
    this.setState(prevState => ({
      currentImage: prevState.currentImagePreview,
      lightboxIsOpen: false
    }));
  };

  gotoPrevious = () => {
    this.setState(prevState => ({ currentImage: prevState.currentImage - 1 }));
  };

  gotoNext = () => {
    this.setState(prevState => ({ currentImage: prevState.currentImage + 1 }));
  };

  gotoImage = index => {
    this.setState({
      currentImage: index
    });
  };

  handleClickImage = () => {
    const { images } = this.props;
    const { currentImage } = this.state;
    if (currentImage === images.length - 1) return;
    this.gotoNext();
  };

  showSmallBlank = n => {
    return (
      <div key={n} className="product-gallery__img-preview">
        <img
          src="/blank.png"
          style={{ border: "1px solid black" }}
          alt="product-img"
          key={n + "img"}
        />
      </div>
    );
  };

  showBigBlank = () => {
    return (
      <div className="product-gallery__current-img">
        <img
          src="/blank.png"
          style={{ border: "1px solid black" }}
          alt="product-img"
        />
      </div>
    );
  };

  render() {
    const { selectedColour, colourSizeMap } = this.props;
    const images = colourSizeMap[selectedColour].productImages;
    const { currentImage, currentImagePreview, lightboxIsOpen } = this.state;

    console.log(images);
    return (
      <div className="product-gallery">
        {images.length > 0 ? (
          <a
            className="product-gallery__current-img"
            onClick={e => this.openLightbox(currentImage, e)}
            href={images[currentImage].productImageUrl}
          >
            <img
              src={images[currentImagePreview].productImageUrl}
              alt="product-img"
            />
          </a>
        ) : (
          this.showBigBlank()
        )}
        <div className="product_gallery__gallery">
          {images.length > 0
            ? images.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={e => this.changeImg(i, e)}
                  className="product-gallery__img-preview"
                >
                  <img
                    src={img.productImageUrl}
                    alt="product-img"
                    style={{ height: "100%" }}
                  />
                </button>
              ))
            : _.times(5, n => this.showSmallBlank(n))}
        </div>
        {/*<Lightbox*/}
        {/*  currentImage={currentImage}*/}
        {/*  images={images}*/}
        {/*  isOpen={lightboxIsOpen}*/}
        {/*  onClickImage={this.handleClickImage}*/}
        {/*  onClickNext={this.gotoNext}*/}
        {/*  onClickPrev={this.gotoPrevious}*/}
        {/*  onClickThumbnail={this.gotoImage}*/}
        {/*  onClose={this.closeLightbox}*/}
        {/*/>*/}
      </div>
    );
  }
}
