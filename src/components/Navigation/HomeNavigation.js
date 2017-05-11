import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MdMenu from 'react-icons/lib/md/menu';
import ContentAdd from 'material-ui/svg-icons/content/add';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import TaskService from '../../services/task';
import { observer } from 'mobx-react';
import DatePicker from 'material-ui/DatePicker';
import Moment from 'moment';

let DateTimeFormat;

const IntlPolyfill = require('intl');
DateTimeFormat = IntlPolyfill.DateTimeFormat;
require('intl/locale-data/jsonp/en');
require('intl/locale-data/jsonp/en-US');
import DrawerService from '../../services/drawer';

const styles = {
  navigation: {
    width: '100%',
    background: '#FFF',
    margin: '0 auto'
  },
  titleNavBar: {
    fontSize: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#1D1D26',
  }
}

@observer
class HomeNavigation extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(e, date) {
    this.setState({date});
    TaskService.findByDate(date)
  }

  render() {
    return(
      <div>
        <AppBar
          style={styles.navigation}
          title={Moment(this.state.date).format('MMM DD, YYYY')}
          onTitleTouchTap={() => !!this.datePicker && this.datePicker.openDialog()}
          titleStyle={styles.titleNavBar}
          iconElementLeft={<IconButton><MdMenu size={24} color={'#D8D8D8'} /></IconButton>}
          iconElementRight={<IconButton><ContentAdd color={'#D8D8D8'} /></IconButton>}
          onRightIconButtonTouchTap={() => (this.props.history.push('/new-task'))}
          onLeftIconButtonTouchTap={() => DrawerService.onOpen()}
        />
        <DatePicker
          hintText="Date"
          ref={ref => this.datePicker = ref}
          formatDate={new DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format}
          style={{display: 'none'}}
          onChange={this.onChange}
          defaultDate={this.state.date}
        />
      </div>
    );
  }
}

export default withRouter(HomeNavigation);
