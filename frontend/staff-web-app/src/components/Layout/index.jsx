/* eslint-disable no-return-assign */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import NotificationSystem from 'rc-notification';
import Topbar from './topbar/Topbar';
import Sidebar from './sidebar/Sidebar';
import {BasicNotification} from '../../shared/components/Notification';

let notification = null;

const showNotification = () => {
    notification.notice({
        content: <BasicNotification
            title="👋 Welcome to the EasyDev!"
            message="You have successfully registered in the EasyDev. Now you can start to explore the dashboard
                interface with a bunch of components and applications. Enjoy!"
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: `right-up`,
    });
};

class Layout extends Component {
    static propTypes = {

    };

    componentDidMount() {
        NotificationSystem.newInstance({style: {top: 65}}, n => notification = n);
        setTimeout(() => showNotification(), 700);
    }

    componentWillUnmount() {
        notification.destroy();
    }

    render() {
        const layoutClass = classNames({
            "layout": true,
        });

        return (
            <div className={layoutClass}>
                <Topbar
                    changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
                    changeSidebarVisibility={this.changeSidebarVisibility}
                    user = {{}}
                />
                <Sidebar
                    changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
                />
            </div>
        );
    }
}

export default withRouter(connect(state => ({
}))(Layout));
