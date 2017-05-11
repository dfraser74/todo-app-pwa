import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import MdCheck from 'react-icons/lib/md/check';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Form from '../../components/Settings/Form';
import Navigation from '../../components/Navigation';
import styles from './styles';

class Settings extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  onSave() {
    this.form
    .onSave()
    .then(() => this.props.history.goBack());
  }

  render() {
    return (
      <Paper
        style={styles.container}
      >
        <Navigation
          title="Settings"
          onRight={this.onSave.bind(this)}
          rightIcon={<MdCheck size={24} color={'#D8D8D8'} />}
        />
        <Form ref={ref => this.form = ref} />
      </Paper>
    );
  }
}

export default withRouter(Settings);
