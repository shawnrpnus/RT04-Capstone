import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {connect} from 'react-redux'

import {getBestSeller, getBestSellerProducts, getMensWear, getNewProducts, getWomensWear} from '../../../services/index'
import {addToCart, addToWishlist, addToCompare} from "../../../actions/index";
import ProductItem from '../common/product-item';

class SpecialProducts extends Component {
    render (){

        const {bestSeller,newProducts, featuredProducts, symbol, addToCart, addToWishlist, addToCompare} = this.props

        return (
            <div>
                <div className="title1 section-t-space">
                    <h4>exclusive products</h4>
                    <h2 className="title-inner1">special products</h2>
                </div>
                <section className="section-b-space p-t-0">
                    <div className="container">
                        <Tabs className="theme-tab">
                            <TabList  className="tabs tab-title">
                                <Tab>NEW PRODUCTS</Tab>
                                <Tab>FEATURED PRODUCTS</Tab>
                                <Tab>BEST SELLERS</Tab>
                            </TabList>

                            <TabPanel>
                                <div className="no-slider row">
                                    { newProducts.map((product, index ) =>
                                        <ProductItem product={product} symbol={symbol}
                                                     onAddToCompareClicked={() => addToCompare(product)}
                                                     onAddToWishlistClicked={() => addToWishlist(product)}
                                                     onAddToCartClicked={() => addToCart(product, 1)} key={index} /> )
                                    }
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="no-slider row">
                                    { featuredProducts.map((product, index ) =>
                                        <ProductItem product={product} symbol={symbol}
                                                     onAddToCompareClicked={() => addToCompare(product)}
                                                     onAddToWishlistClicked={() => addToWishlist(product)}
                                                     onAddToCartClicked={() => addToCart(product, 1)} key={index} /> )
                                    }
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className=" no-slider row">
                                    { bestSeller.map((product, index ) =>
                                        <ProductItem product={product} symbol={symbol}
                                                     onAddToCompareClicked={() => addToCompare(product)}
                                                     onAddToWishlistClicked={() => addToWishlist(product)}
                                                     onAddToCartClicked={() => addToCart(product, 1)} key={index} /> )
                                    }
                                </div>
                            </TabPanel>
                        </Tabs>
                    </div>
                </section>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    bestSeller: getBestSellerProducts(state.data.products, ownProps.type),
    newProducts: getNewProducts(state.data.products, ownProps.type),
    featuredProducts: getBestSellerProducts(state.data.products, ownProps.type).reverse(),
    symbol: state.data.symbol
})

export default connect(mapStateToProps, {addToCart, addToWishlist, addToCompare}) (SpecialProducts);