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
import { changeMobileSidebarVisibility, changeSidebarVisibility } from '../../redux/actions/sidebarActions';
import {SidebarProps } from '../../shared/prop-types/ReducerProps';

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
        className: `right-up ltr-support`,
    });
};

class Layout extends Component {
    static propTypes = {
        sidebar: SidebarProps.isRequired,
    };

    componentDidMount() {
        NotificationSystem.newInstance({style: {top: 65}}, n => notification = n);
        setTimeout(() => showNotification(), 700);
    }

    componentWillUnmount() {
        notification.destroy();
    }

    changeSidebarVisibility = () => {
        const { dispatch } = this.props;
        dispatch(changeSidebarVisibility());
    };

    changeMobileSidebarVisibility = () => {
        const { dispatch } = this.props;
        dispatch(changeMobileSidebarVisibility());
    };

    render() {
        const { sidebar } = this.props;
        const layoutClass = classNames({
            layout: true,
            'layout--collapse': sidebar.collapse,
        });

        return (
            <div className={layoutClass}>
                <Topbar
                    changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
                    changeSidebarVisibility={this.changeSidebarVisibility}
                    user = {{}}
                />
                <Sidebar
                    sidebar={sidebar}
                    changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    sidebar: state.sidebar
})

export default withRouter(
    connect(mapStateToProps)(Layout)
);
