import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import MdCheck from 'react-icons/lib/md/check';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { observer } from 'mobx-react';
import styles from './styles';

@observer
class CategoryNavigation extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  render() {
    return(
      <AppBar
        style={styles.navigation}
        title={
          <div style={styles.titleNavBar}>
            <span style={{fontSize: '20px'}}>{this.props.headerNav}</span>
          </div>
        }
        iconElementLeft={<IconButton><NavigationClose size={24} color={'#D8D8D8'} /></IconButton>}
        iconElementRight={<IconButton><MdCheck size={24} color={'#D8D8D8'} /></IconButton>}
        onRightIconButtonTouchTap={(e) => (this.props.onSubmit())}
        onLeftIconButtonTouchTap={(e) => (this.props.history.push('/categories'))}
      />
    );
  }
}

export default withRouter(CategoryNavigation);
