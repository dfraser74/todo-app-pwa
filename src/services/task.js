import { observable, computed, autorun, toJS } from 'mobx';
import { database } from '../db/firebase';
import moment from 'moment';
import UserService from './user';

class Task {
  @observable taskList = {};
  createdBy = UserService.info.uid;
  oldCurrent = null;
  @observable current = moment().format('MMMM DD, YYYY');

  constructor() {
    autorun(() => {
      if((this.createdBy === UserService.info.uid && !!this.createdBy)
          && this.oldCurrent === this.current) return;

      this.createdBy = UserService.info.uid;
      this.oldCurrent = toJS(this.current);
      const createdBy = this.createdBy;

      if (!this.createdBy) this.taskList = {};

      database.ref('/tasks')
        .orderByChild('date')
        .equalTo(this.current)
        .on('value', (snapshot) => {
          const taskList = snapshot.val() || {};
          this.taskList = Object.keys(taskList).reduce((obj, key) => {
            const task = taskList[key]
            if (!!createdBy && task.createdBy === createdBy) obj[key] = task;
            return obj;
          }, {})
        });
      });
  }

  @computed get Completed() {
    const taskList = { ...this.taskList };

    if (Object.keys(taskList).length < 1) return {};

    return (
      Object
        .keys(taskList)
        .filter(key => !!taskList[key].completed)
        .reduce((obj, key) => ({ ...obj, [key]: taskList[key] }),{})
    );
  }

  @computed get UnCompleted() {
    const taskList = { ...this.taskList };

    if (Object.keys(taskList).length < 1) return {};

    return (
      Object
        .keys(taskList)
        .filter(key => !taskList[key].completed)
        .reduce((obj, key) => ({ ...obj, [key]: taskList[key] }),{})
    );
  }

  @computed get lengthUncompleted() {
    return Object.keys(this.UnCompleted).length;
  }

  @computed get lengthCompleted() {
    return Object.keys(this.Completed).length;
  }

  findByDate(date) {
    this.current = moment(date).format('MMMM DD, YYYY')
  }

  onToggle(key, value) {
    const updatedAt = Date.now();
    const updatedBy = UserService.info.uid;
    return database.ref(`tasks/${key}`).update({ completed: value, updatedAt, updatedBy})
  }

  onAdd(task) {
    const createdAt = Date.now();
    const updatedAt = Date.now();
    const createdBy = UserService.info.uid;
    const updatedBy = UserService.info.uid;
    return database.ref('/tasks').push({ ...task, createdAt, updatedAt, createdBy, updatedBy });
  }

  onDelete(key) {
    const taskList = { ...this.taskList };
    delete taskList[key];
    this.taskList = { ...taskList };
    return database.ref(`/tasks/${key}`).remove()
  }
}

export default new Task()
