import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import CategoryNavigation from '../../components/Navigation/CategoryNavigation';
import Form from '../../components/Category/Form';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { isAuthenticate } from '../../components/isAuthenticate';

import styles from './styles'

class NewTask extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.form.add().then(res => {
      this.props.history.replace('/');
    })
  }

  render() {
    return (
      <Paper
        style={styles.container}
      >
        <CategoryNavigation headerNav="New Category" onSubmit={this.onSubmit}/>
        <Form ref={ref => (this.form = ref)} />
      </Paper>
    );
  }
}

export default withRouter(isAuthenticate(NewTask));
