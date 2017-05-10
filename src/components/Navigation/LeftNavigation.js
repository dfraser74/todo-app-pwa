import React from 'react';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { observer } from 'mobx-react';
import UserService from '../../services/user';
import DrawerService from '../../services/drawer';
import styles from './styles';
import userImage from '../../assets/images/user.png';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

@observer
class LeftNavigation extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  onLogout() {
    UserService.onLogout().then(() => this.props.history.replace('/'));
  }

  render() {
    const currentUser = UserService.info || {};
    if(!currentUser.uid) return null
    return (
      <Drawer
        width={300}
        docked={false}
        disableSwipeToOpen
        open={DrawerService.open}
        containerStyle={styles.drawer}
        onRequestChange={(open) => DrawerService.onRequestChange(open)}
      >
        <Card>
          <CardHeader
            style={styles.header}
            subtitleColor="#CFCFCF"
            subtitle={currentUser.email}
            avatar={currentUser.photoURL || userImage}
            title={currentUser.displayName || currentUser.email}
          />
          {!!currentUser.bio && <CardText>{currentUser.bio}</CardText>}
        </Card>
        <Divider />
        <List
          style={styles.listItem}
        >
          {
            ['Home', 'Calendar', 'Overview', 'Groups', 'Groups', 'Lists', 'Profile', 'Timeline', 'Settings'].map((key, index) =>
              <ListItem
                key={index}
                primaryText={key}
                style={styles.menuItem}
                onTouchTap={() => this.props.history.push(key.toLocaleLowerCase())}
              />
            )
          }
          <ListItem
            key="logout"
            primaryText="Logout"
            style={styles.menuItem}
            onTouchTap={() => this.onLogout()}
          />
        </List>
      </Drawer>
    );
  }
}

export default withRouter(LeftNavigation);
