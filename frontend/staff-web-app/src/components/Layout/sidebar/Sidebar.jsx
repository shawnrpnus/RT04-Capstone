import React from 'react';
import Scrollbar from 'react-smooth-scrollbar';
import classNames from 'classnames';
import * as PropTypes from 'prop-types';
import SidebarContent from './SidebarContent';

const Sidebar = ({
  changeMobileSidebarVisibility
}) => {
  const sidebarClass = classNames({
    sidebar: true,
  });

  return (
    <div className={sidebarClass}>
      <button className="sidebar__back" type="button" onClick={changeMobileSidebarVisibility} />
      <Scrollbar className="sidebar__scroll scroll">
        <div className="sidebar__wrapper sidebar__wrapper--desktop">
          <SidebarContent
            onClick={() => {}}
          />
        </div>
        <div className="sidebar__wrapper sidebar__wrapper--mobile">
          <SidebarContent
            onClick={changeMobileSidebarVisibility}
          />
        </div>
      </Scrollbar>
    </div>
  );
};

Sidebar.propTypes = {
  changeMobileSidebarVisibility: PropTypes.func.isRequired,
};

export default Sidebar;
