import React, { PureComponent } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { Chip } from "@material-ui/core"; 
const _ = require("lodash");

export default class ProductTabs extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "1"
    };
  }

  toggle = tab => {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  render() {
    const { activeTab } = this.state;
    const { description } = this.props;
    var tags = "No Tags selected yet"
    
    if(this.props.tags != undefined && Object.keys(this.props.tags).length>0) {
       tags = this.props.tags.map(function(value, i){
        return <Chip
                style={{margin: 10}}
                label={value.name}/>
      });
    }

    var styles = "No Styles selected yet"
    
    if(this.props.styles != undefined && Object.keys(this.props.styles).length>0) {
       styles = this.props.styles.map(function(value, i){
        return <Chip
                style={{margin: 10}}
                label={value.styleName}/>
      });
    }


    return (
      <div className="tabs">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => {
                this.toggle("1");
              }}
            >
              Description
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => {
                this.toggle("2");
              }}
            >
              Tags
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "3" })}
              onClick={() => {
                this.toggle("3");
              }}
            >
              Styles
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className="typography-message">
          <TabPane tabId="1">
            <p>{description}</p>
          </TabPane>
          <TabPane tabId="2">
            <p>
              {tags}         
            </p>
          </TabPane>
          <TabPane tabId="3">
            <p>
              {styles}  
            </p>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}
