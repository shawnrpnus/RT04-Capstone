import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {connect} from "react-redux";
import {getTrendingTagCollection} from "../../../services";

import SideImageItem from "../common/side-image-item"

class Trending extends Component {

    render (){
            const {titan, reebok, rolex, unisex, symbol} = this.props;
        return (
            <div>
                {/*Paragraph*/}
                <section className="p-0">
                    <div className="tab-bg">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col">
                                    <div className="title4">
                                        <h2 className="title-inner4">trending products</h2>
                                        <div className="line"><span></span></div>
                                    </div>
                                    <Tabs className="theme-tab">
                                        <TabList  className="tabs tab-title">
                                            <Tab>UNISEX WATCHES</Tab>
                                            <Tab>TITANIUM WATCHES</Tab>
                                            <Tab>REEBOK WATCHES</Tab>
                                            <Tab>ROLEX WATCHES</Tab>
                                        </TabList>
                                        <div className="tab-content-cls">
                                            <TabPanel className="tab-content">
                                                <div className="row product-tab">
                                                    {unisex.map((item, i) =>
                                                        <div className="tab-box" key={i}>
                                                            <SideImageItem product={item} symbol={symbol}  />
                                                        </div>
                                                    )}
                                                </div>
                                            </TabPanel>
                                            <TabPanel className="tab-content">
                                                <div className="row product-tab">
                                                    {titan.map((item, i) =>
                                                        <div className="tab-box" key={i}>
                                                            <SideImageItem product={item} symbol={symbol}  />
                                                        </div>
                                                    )}
                                                </div>
                                            </TabPanel>
                                            <TabPanel className="tab-content">
                                                <div className="row product-tab">
                                                    {reebok.map((item, i) =>
                                                        <div className="tab-box" key={i}>
                                                            <SideImageItem product={item} symbol={symbol}  />
                                                        </div>
                                                    )}
                                                </div>
                                            </TabPanel>
                                            <TabPanel className="tab-content">
                                                <div className="row product-tab">
                                                    {rolex.map((item, i) =>
                                                        <div className="tab-box" key={i}>
                                                            <SideImageItem product={item} symbol={symbol}  />
                                                        </div>
                                                    )}
                                                </div>
                                            </TabPanel>
                                        </div>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => ({
    titan: getTrendingTagCollection(state.data.products, ownProps.type, 'titan'),
    reebok: getTrendingTagCollection(state.data.products, ownProps.type, 'reebok'),
    rolex: getTrendingTagCollection(state.data.products, ownProps.type, 'rolex'),
    unisex: getTrendingTagCollection(state.data.products, ownProps.type, 'unisex'),
    symbol: state.data.symbol
})
export default connect(mapStateToProps) (Trending);