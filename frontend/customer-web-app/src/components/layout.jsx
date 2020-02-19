import React, {Component} from 'react';

// Custom Components

import HeaderThree from './common/headers/header';

import Footer from "./common/footers/footer";
import PrimarySearchAppBar from "./common/headers/header-material";



class Layout extends Component {

    render() {
        return (
            <div>
                <HeaderThree logoName={'logo.png'}/>
                {this.props.children}
                <Footer logoName={'logo.png'}/>
            </div>
        );
    }
}

export default Layout;