import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navClose: { right: '0px' }
        }
    }

    componentWillMount() {
        if (window.innerWidth < 750) {
            this.setState({ navClose: { right: '-410px' } })
        }
        if (window.innerWidth < 1199) {
            this.setState({ navClose: { right: '-300px' } })
        }
    }

    openNav() {
        console.log('open');
        this.setState({ navClose: { right: '0px' } })
    }
    closeNav() {
        this.setState({ navClose: { right: '-410px' } })
    }

    onMouseEnterHandler() {
        if (window.innerWidth > 1199) {
            document.querySelector("#main-menu").classList.add("hover-unset");
        }
    }

    handleSubmenu = (event) => {
        if (event.target.classList.contains('sub-arrow'))
            return;

        if(event.target.nextElementSibling.classList.contains('opensubmenu'))
            event.target.nextElementSibling.classList.remove('opensubmenu');
        else{
            document.querySelectorAll('.nav-submenu').forEach(function (value) {
                value.classList.remove('opensubmenu');
            });
            document.querySelector('.mega-menu-container').classList.remove('opensubmenu');
            event.target.nextElementSibling.classList.add('opensubmenu')
        }
    };

    handleMegaSubmenu = (event) => {
        if (event.target.classList.contains('sub-arrow'))
            return;
            
        if(event.target.parentNode.nextElementSibling.classList.contains('opensubmegamenu'))
            event.target.parentNode.nextElementSibling.classList.remove('opensubmegamenu');
        else{
            document.querySelectorAll('.menu-content').forEach(function (value) {
                value.classList.remove('opensubmegamenu');
            });
            event.target.parentNode.nextElementSibling.classList.add('opensubmegamenu')
        }
    };

    render() {
        return (
            <div>
                <div className="main-navbar">
                    <div id="mainnav" >
                        <div className="toggle-nav" onClick={this.openNav.bind(this)} >
                            <i className="fa fa-bars sidebar-bar"/>
                        </div>
                        <ul className="nav-menu" style={this.state.navClose}>
                            <li className="back-btn" onClick={this.closeNav.bind(this)} >
                                <div className="mobile-back text-right">
                                    <span >Back</span>
                                    <i className="fa fa-angle-right pl-2" aria-hidden="true"/>
                                </div>
                            </li>
                            <li >
                                <Link to="#" className="nav-link" onClick={(e) => this.handleSubmenu(e)}>
                                    {'home'}
                                    <span className="sub-arrow"/>
                                </Link>
                                <ul className="nav-submenu" >
                                    <li><Link to={`${process.env.PUBLIC_URL}/fashion`} >{'fashion'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/beauty`} >{'beauty'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/electronic`} >{'electronic'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/furniture`} >{'furniture'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/kids`} >{'kids'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/pets`} >{'pets'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/vegetables`} >{'vegetables'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/watch`} >{'watch'}</Link></li>
                                </ul>
                            </li>
                            <li >
                                <Link to="#" className="nav-link" onClick={(e) => this.handleSubmenu(e)}>
                                    {'shop'}
                                    <span className="sub-arrow"/>
                                </Link>
                                <ul className="nav-submenu">
                                    <li><Link to={`${process.env.PUBLIC_URL}/left-sidebar/collection`} >{'category_left_sidebar'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/right-sidebar/collection`} >{'category_right_sidebar'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/no-sidebar/collection`} >{'category_no_sidebar'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/metro/collection`} >{'category_metro'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/full-width/collection`} >{'category_full_width'}</Link></li>
                                </ul>
                            </li>
                            <li >
                                <Link to="#" className="nav-link" onClick={(e) => this.handleSubmenu(e)}>
                                    {'products'}
                                    <span className="sub-arrow"/>
                                </Link>
                                <ul className="nav-submenu">
                                    <li><Link to={`${process.env.PUBLIC_URL}/left-sidebar/product/1`} >{'left_sidebar'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/right-sidebar/product/1`} >{'right_sidebar'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/no-sidebar/product/1`} >{'no_sidebar'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/col-left/product/1`} >{'three_col_thumbnail_left'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/col-right/product/1`} >{'three_col_thumbnail_right'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/column/product/1`} >{'thumbnail_below'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/left-image/product/1`} >{'thumbnail_left'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/right-image/product/1`} >{'thumbnail_right'}</Link></li>
                                </ul>
                            </li>
                            <li className="mega-menu">
                                <Link to="#" className="dropdown" onClick={(e) => this.handleSubmenu(e)}>
                                    {'features'}
                                    <span className="sub-arrow"/>
                                </Link>
                                <div className="mega-menu-container" >
                                    <div className="container">
                                        <div className="row">
                                            <div className="col mega-box">
                                                <div className="link-section">
                                                    <div className="menu-title" >
                                                        <h5 onClick={(e) => this.handleMegaSubmenu(e)}>
                                                            {'portfolio'}
                                                            <span className="sub-arrow"/>
                                                        </h5>
                                                    </div>
                                                    <div className="menu-content">
                                                        <ul>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/portfolio-grid/2`} >{'portfolio_grid_2'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/portfolio-grid/3`} >{'portfolio_grid_3'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/portfolio-grid/4`} >{'portfolio_grid_4'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/portfolio-masonary/2`} >{'portfolio_masonary_2'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/portfolio-masonary/3`} >{'portfolio_masonary_3'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/portfolio-masonary/4`} >{'portfolio_masonary_4'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/portfolio-masonary/full`} >{'portfolio_masonary_full'}</Link></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col mega-box">
                                                <div className="link-section">
                                                    <div className="menu-title" >
                                                        <h5 onClick={(e) => this.handleMegaSubmenu(e)}>
                                                            {'theme_elements'}
                                                            <span className="sub-arrow"/>
                                                        </h5>
                                                    </div>
                                                    <div className="menu-content">
                                                        <ul>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/element-title`} >{'element_title'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/element-banner`} >{'collection_banner'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/element-slider`} >{'home_slider'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/element-category`} >{'category'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/element-service`} >{'service'}</Link></li>
                                                            {/*<li><Link to={`${process.env.PUBLIC_URL}/features/element-ratio`} >{'image_size_ratio'}</Link></li>*/}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col mega-box">
                                                <div className="link-section">
                                                    <div className="menu-title" >
                                                        <h5 onClick={(e) => this.handleMegaSubmenu(e)}>
                                                            {'product_elements'}
                                                            <span className="sub-arrow"/>
                                                        </h5>
                                                    </div>
                                                    <div className="menu-content" >
                                                        <ul>
                                                            <li className="up-text"><Link to={`${process.env.PUBLIC_URL}/features/element-product-box`} >{'product_box'}<span>10+</span></Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/element-product-slider`} >{'product_slider'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/element-product-no-slider`} >{'no_slider'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/element-product-multiple-slider`} >{'multi_slider'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/features/element-product-tab`} >{'tab'}</Link></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col mega-box">
                                                <div className="link-section">
                                                    <div className="menu-title" >
                                                        <h5 onClick={(e) => this.handleMegaSubmenu(e)}>
                                                            {'email_template'}
                                                            <span className="sub-arrow"/>
                                                        </h5>
                                                    </div>
                                                    <div className="menu-content" >
                                                        <ul>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/email-template.html`} target="_blank">{'order_success'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/email-template-two.html`} target="_blank">{'order_success'}2</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/email-order-success.html`} target="_blank">{'email_template'}</Link></li>
                                                            <li><Link to={`${process.env.PUBLIC_URL}/email-order-success-two.html`} target="_blank">{'email_template'}2</Link></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col mega-box">
                                                <div className="link-section">
                                                    <div className="menu-title">
                                                        <h5 onClick={(e) => this.handleMegaSubmenu(e)}>
                                                            {'accessories'}
                                                            <span className="sub-arrow"/>
                                                        </h5>
                                                    </div>
                                                    <div className="menu-content" >
                                                        <ul>
                                                            <li><a href="#">{'fashion_jewellery'}</a></li>
                                                            <li><a href="#">{'caps_and_hats'}</a></li>
                                                            <li><a href="#">{'precious_jewellery'}</a></li>
                                                            <li><a href="#">{'necklaces'}</a></li>
                                                            <li><a href="#">{'earrings'}</a></li>
                                                            <li><a href="#">{'rings_wrist_wear'}</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="col mega-box">
                                                <div className="link-section">
                                                    <div className="menu-title" >
                                                        <h5 onClick={(e) => this.handleMegaSubmenu(e)}>
                                                            {'men_accessories'}
                                                            <span className="sub-arrow"></span>
                                                        </h5>
                                                    </div>
                                                    <div className="menu-content" >
                                                        <ul>
                                                            <li><a href="#">{'ties'}</a></li>
                                                            <li><a href="#">{'cufflinks'}</a></li>
                                                            <li><a href="#">{'pockets_squares'}</a></li>
                                                            <li><a href="#">{'helmets'}</a></li>
                                                            <li><a href="#">{'scarves'}</a></li>
                                                            <li><a href="#">{'phone_cases'}</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <Link to="#" className="nav-link" onClick={(e) => this.handleSubmenu(e)}>
                                    {'pages'}
                                    <span className="sub-arrow"/>
                                </Link>
                                <ul className="nav-submenu">
                                    <li><Link to={`${process.env.PUBLIC_URL}/pages/about-us`} >{'about_us'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/pages/404`} >404</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/pages/lookbook`} >{'lookbook'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/pages/login`} >{'login'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/pages/register`} >{'register'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/pages/search`} >{'search'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/pages/collection`} >{'collection'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/pages/forget-password`} >{'forget_password'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/pages/contact`} >{'contact'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/pages/dashboard`} >{'dashboard'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/pages/faq`} >{'FAQ'}</Link></li>
                                </ul>
                            </li>
                            <li >
                                <Link to="#" className="nav-link" onClick={(e) => this.handleSubmenu(e)}>
                                    {'blog'}
                                    <span className="sub-arrow"/>
                                </Link>
                                <ul className="nav-submenu">
                                    <li><Link to={`${process.env.PUBLIC_URL}/blog/blog-page`} >{'blog_left_sidebar'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/blog/right-sidebar`} >{'blog_right_sidebar'}</Link></li>
                                    <li><Link to={`${process.env.PUBLIC_URL}/blog/details`} >{'blog_detail'}</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}


export default NavBar;
