import React, { Component } from 'react'
import Sidebar from './common/sidebar_components/sidebar';
import Footer from './common/footer';
import Header from './common/header_components/header';

export class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ltr: true,
            divName: 'RTL',
        }
    }
    ChangeRtl(divName) {
        if (divName === 'RTL') {
            document.body.classList.add('rtl');
            this.setState({ divName: 'LTR' });
        } else {
            document.body.classList.remove('rtl');
            this.setState({ divName: 'RTL' });
        }
    }
    render() {
        return (
            <div>
                <div className="page-wrapper" >
                    <Header />
                    <div className="page-body-wrapper">
                        <Sidebar />
                        <div className="page-body">
                            {this.props.children}
                        </div>
                        <Footer />
                    </div>
                </div>
                <div className="btn-light custom-theme" onClick={() => this.ChangeRtl(this.state.divName)}>{this.state.divName}</div>
            </div>
        )
    }
}

export default Layout
