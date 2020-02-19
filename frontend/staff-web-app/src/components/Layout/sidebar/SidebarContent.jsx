import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';

class SidebarContent extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          <SidebarLink title="Log Out" icon="exit" route="/log_in" />
          <SidebarLink
            title="Dashboard E-commerce"
            icon="store"
            route="/dashboard_e_commerce"
            onClick={this.hideSidebar}
          />
          <SidebarCategory title="Products">
            <SidebarLink title="Create" route="/" onClick={this.hideSidebar} />
            <SidebarLink title="View All" route="/" onClick={this.hideSidebar} />
          </SidebarCategory>
        </ul>
      </div>
    );
  }
}

export default SidebarContent;
