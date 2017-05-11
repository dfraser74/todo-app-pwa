import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MdMenu from 'react-icons/lib/md/menu';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import DrawerService from '../../services/drawer';

const styles = {
  navigation: {
    width: '100%',
    background: '#FFF',
    margin: '0 auto'
  },
  titleStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#1D1D26'
  }
}

@observer
class Navigation extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onRight: PropTypes.func,
    rightIcon: PropTypes.node,
  }

  static defaultProps = {
    title: '',
    onRight: () => {},
  }

  render() {
    const { title, onRight, rightIcon, ...args } = this.props;

    const app = {
      title,
      ...args,
      style: styles.navigation,
      titleStyle: styles.titleStyle,
      onRightIconButtonTouchTap: onRight,
      onLeftIconButtonTouchTap: () => DrawerService.onOpen(),
      iconElementRight: <IconButton>{rightIcon}</IconButton>,
      iconElementLeft: <IconButton><MdMenu size={24} color={'#D8D8D8'} /></IconButton>,
    }

    return(
      <AppBar
        {...app}
        title="Settings"
      />
    );
  }
}

export default Navigation;
