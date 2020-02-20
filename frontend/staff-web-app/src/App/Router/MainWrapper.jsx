import React, {PureComponent} from 'react';
import {withRouter} from 'react-router-dom';
import * as PropTypes from 'prop-types';

class MainWrapper extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  render() {
    const {
      children
    } = this.props;
    
    return (
      <div className="theme-light ltr-support" dir="ltr">
        <div className="wrapper blocks-with-shadow-theme">
          {children}
        </div>
      </div>
    );
  }
}

export default withRouter(MainWrapper);
