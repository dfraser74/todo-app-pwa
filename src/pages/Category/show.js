import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { observer } from 'mobx-react';
import Navigation from '../../components/Navigation';
import MdEdit from 'react-icons/lib/fa/edit';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import TaskService from '../../services/task';
import CategoryService from '../../services/category';
import Tasks from '../../components/Task/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import styles from './styles.js';
import { observable } from 'mobx';

@observer
class ShowCategory extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }
  @observable tasks = {
    Completed: {},
    UnCompleted: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      value: 'Completed',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({
      value: value,
    });
  };

  componentWillMount() {
    const categoryId = this.props.match.params.categoryId;
    TaskService.getTaskByCategory(categoryId).then(tasks => {
      if (!this.tasks) return;
      this.tasks = {...tasks};
    });
  }

  render() {
    const categoryId = this.props.match.params.categoryId;
    const category = CategoryService.categoryList[categoryId] || {};
    return (
       <Paper
        zDepth={0}
        style={styles.flexColumn}
      >
        <div>
          <Navigation
            title={category.title}
            onRight={() => (this.props.history.push(`/category/${categoryId}/edit`))}
            onLeft={() => (this.props.history.goBack())}
            leftIcon={<MdArrowBack size={24} color={'#D8D8D8'} />}
            rightIcon={<MdEdit size={24} color={'#D8D8D8'} />}
          />
        </div>
        <Tabs
          tabItemContainerStyle={styles.tabItem}
          inkBarStyle={styles.inkBar}
          style={styles.tab}
          value={this.state.value}
          onChange={this.handleChange}
        >
          <Tab
            label="Completed"
            value="Completed"
          >
            <Tasks completed data={this.tasks}/>
          </Tab>
          <Tab
            label="Uncompleted"
            value="Uncompleted"
          >
            <Tasks data={this.tasks} />
          </Tab>
        </Tabs>
      </Paper>
    );
  }
}

export default withRouter(ShowCategory);
