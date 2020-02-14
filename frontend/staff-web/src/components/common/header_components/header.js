import React, { Component,Fragment } from 'react'
import SearchHeader from './searchHeader';
import Notification from './notification';
import User_menu from './user-menu';
import Language from './language';
import { AlignLeft, Maximize2, Bell, MessageSquare, MoreHorizontal } from 'react-feather';

//images
import logo from '../../../assets/images/dashboard/multikart-logo.png'

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar: true,
            rightSidebar: true,
            navMenus: false
        }
    }
    toggle() {
        this.setState(prevState => ({
            navMenus: !prevState.navMenus
        }));
    }
    showRightSidebar = () => {
        if (this.state.rightSidebar) {
            this.setState({ rightSidebar: false })
            document.querySelector(".right-sidebar").classList.add('show');
        } else {
            this.setState({ rightSidebar: true })
            document.querySelector(".right-sidebar").classList.remove('show');
        }
    }
    goFull = () => {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }
    openCloseSidebar = () => {
        if (this.state.sidebar) {
            this.setState({ sidebar: false })
            document.querySelector(".page-main-header").classList.add('open');
            document.querySelector(".page-sidebar").classList.add('open');
        } else {
            this.setState({ sidebar: true })
            document.querySelector(".page-main-header").classList.remove('open');
            document.querySelector(".page-sidebar").classList.remove('open');
        }
    }
    render() {
        return (
            <Fragment>
                {/* open */}
                <div className="page-main-header ">
                    <div className="main-header-right row">
                        <div className="main-header-left d-lg-none" >
                            <div className="logo-wrapper">
                                <a href="index.html">
                                    <img className="blur-up lazyloaded" src={logo} alt="" />
                                </a>
                            </div>
                        </div>
                        <div className="mobile-sidebar">
                            <div className="media-body text-right switch-sm">
                                <label className="switch"><a onClick={this.openCloseSidebar}><AlignLeft /></a></label>
                            </div>
                        </div>
                        <div className="nav-right col">
                            <ul className={"nav-menus " + (this.state.navMenus ? 'open' : '')}>
                                <li>
                                    <SearchHeader />
                                </li>
                                <li><a onClick={this.goFull} className="text-dark" href="#!"><Maximize2 /></a></li>
                                <li className="onhover-dropdown"><a className="txt-dark" href="#">
                                    <h6>EN</h6></a>
                                    <Language />
                                </li>

                                <li className="onhover-dropdown"><Bell /><span className="badge badge-pill badge-primary pull-right notification-badge">3</span><span className="dot"></span>
                                    <Notification />
                                </li>
                                <li><a onClick={this.showRightSidebar}><MessageSquare /><span className="dot"></span></a></li>
                                <User_menu />
                            </ul>
                            <div className="d-lg-none mobile-toggle pull-right" onClick={() => this.toggle()}><MoreHorizontal /></div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Header
