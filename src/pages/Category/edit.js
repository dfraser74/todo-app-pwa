import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { observer } from 'mobx-react';
import Navigation from '../../components/Navigation';
import MdCheck from 'react-icons/lib/md/check';
import MdClose from 'react-icons/lib/md/close';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import CategoryService from '../../services/category';
import styles from './styles.js';
import Form from '../../components/Category/Form';

@observer
class EditCategory extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.onEdit = this.onEdit.bind(this);
    this.onBack = this.onBack.bind(this);
    this.renderCategory = this.renderCategory.bind(this);
  }

  componentWillMount() {
    const categoryId = this.props.match.params.categoryId;
    CategoryService.onFetch(categoryId).then(category => {
      if (!this.form) return;
      this.form.category = {...category};
    });
  }

  onEdit() {
    const categoryId = this.props.match.params.categoryId;
    !!this.form && this.form.edit(categoryId).then(this.onBack);
  }

  onBack() {
    this.props.history.push('/categories');
  }

  renderCategory(key, category) {
    debugger;
  }

  render() {
    return (
       <Paper
        zDepth={0}
        style={styles.flexColumn}
      >
        <div>
          <Navigation
            title="Edit Category"
            onRight={this.onEdit}
            onLeft={this.onBack}
            leftIcon={<MdClose size={24} color={'#D8D8D8'} />}
            rightIcon={<MdCheck size={24} color={'#D8D8D8'} />}
          />
        </div>

        <Form ref={ref => (this.form = ref)} />

      </Paper>
    );
  }
}

export default withRouter(EditCategory);
