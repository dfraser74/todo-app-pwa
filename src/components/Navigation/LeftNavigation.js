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
import Avatar from 'material-ui/Avatar';

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
    const { displayName, email } = currentUser || {};
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
            avatar={
              <Avatar
                style={styles.avatar}
              >
                <img style={styles.img} src={currentUser.photoURL || userImage} alt={displayName || email}/>
              </Avatar>
            }
            title={displayName || email}
          />
          {!!currentUser.bio && <CardText>{currentUser.bio}</CardText>}
        </Card>
        <Divider />
        <List
          style={styles.listItem}
        >
          {
            ['Home', 'New-task', 'Category', 'Settings'].map((key, index) =>
              <ListItem
                key={index}
                primaryText={key.replace(/-/g,' ')}
                style={styles.menuItem}
                onTouchTap={() => {
                  DrawerService.onClose();
                  if (key === 'Home') return this.props.history.replace('/');
                  this.props.history.push(key.toLocaleLowerCase());
                }}
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
