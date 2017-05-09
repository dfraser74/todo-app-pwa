import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Subheader from 'material-ui/Subheader';
import TaskService from '../../services/task';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
import styles from './style'

let DateTimeFormat;

const IntlPolyfill = require('intl');
DateTimeFormat = IntlPolyfill.DateTimeFormat;
require('intl/locale-data/jsonp/en');
require('intl/locale-data/jsonp/en-US');

@observer
class Form extends Component {
  @observable task = {
    name: '',
    completed: false,
    description: '',
    date: null,
    starttime: null,
    endtime: null,
    location: '',
    categoryId: null
  };

  @observable isSubmiting = false;
  @observable error = {};

  add() {
    this.isSubmiting = true

    const task = {
      ...this.task,
      date: moment(this.task.date).format('MMMM d, YYYY'),
      starttime: moment(this.task.starttime).format("hh:mm a"),
      endtime: moment(this.task.endtime).format("hh:mm a")
    }

    this.isSubmiting = false;
    TaskService.onAdd(task)
  }

  reset() {
    this.task = {
      name: '',
      completed: false,
      description: '',
      date: null,
      starttime: null,
      endtime: null,
      location: '',
      categoryId: null,
    };
    this.error = {};
    this.isSubmiting = false;
  }

  render() {
    const { name, completed, description, date, starttime, endtime, location } = this.task;

    return (
      <Paper
        zDepth={0}
        style={styles.container}
      >
        <Subheader style={{textAlign: 'center'}}> Add Task </Subheader>
        <TextField
          value={name}
          fullWidth
          hintText="Task name *"
          errorText={this.error.title}
          onChange={e => (this.task = { ...this.task, name: e.target.value })}
        /><br />
        <TextField
          fullWidth
          multiLine={true}
          value={description}
          hintText="Todo description"
          onChange={e => (this.task = { ...this.task, description: e.target.value })}
        /><br />
        <DatePicker
          {...styles.input}
          hintText="Date"
          style={{
            width: '100%'
          }}
          value={date}
          formatDate={new DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format}
          onChange={(e, date) => (this.task = { ...this.task, date: date  })}
        /><br />
        <div style={{display: 'flex'}}>
          <TimePicker
            {...styles.input}
            style={{maxWidth: '49%', flex: 1, paddingRight: 15}}
            hintText="From"
            value={starttime}
            onChange={(e, date) => (this.task = { ...this.task, starttime: date})}
          />
          <TimePicker
            {...styles.input}
            style={{maxWidth: '49%', flex: 1, paddingLeft: 15}}
            hintText="To"
            value={endtime}
            onChange={(e, date) => (this.task = { ...this.task, endtime: date })}
          />
        </div><br />
        <TextField
          hintText="Location"
          fullWidth
          value={location}
          errorText={this.error.title}
          onChange={e => (this.task = { ...this.task, location: e.target.value })}
        />
        <div style={{display: 'flex'}}>
          <Checkbox
            style={{width: 40}}
            checked={!!completed}
            onTouchTap={(e, value) => (this.task = { ...this.task, completed: !e.target.checked})}
          /> Completed
        </div><br />
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          <RaisedButton
            primary
            label="Add"
            disabled={this.isSubmiting}
            onTouchTap={this.add.bind(this)}
          />
          <RaisedButton
            label="Reset"
            disabled={this.isSubmiting}
            onTouchTap={this.reset.bind(this)}
          />
        </div>
      </Paper>
    )
  }
}

export default Form
