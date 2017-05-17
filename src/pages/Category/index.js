import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Categories from '../../components/Category/List';
import { observer } from 'mobx-react';
import Navigation from '../../components/Navigation';
import MdAdd from 'react-icons/lib/md/add';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import styles from './styles.js';
import { isAuthenticate } from '../../components/isAuthenticate';

@observer
class Category extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  render() {
    return (
       <Paper
        zDepth={0}
        style={styles.flexColumn}
      >
        <div>
          <Navigation
            title="Categories"
            onRight={() => (this.props.history.push('/new-category'))}
            rightIcon={<MdAdd size={24} color={'#D8D8D8'} />}
          />
        </div>
        <Categories router={this.props.history} />
      </Paper>
    );
  }
}

export default withRouter(isAuthenticate(Category));
