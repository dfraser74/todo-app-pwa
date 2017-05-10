import { observable, computed } from 'mobx';
import { database } from '../db/firebase';
import moment from 'moment';

class Task {
  @observable taskList = {};

  constructor() {
    this.findByDate()
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
    const current = moment(date).format('MMMM DD, YYYY')
    return new Promise((resolve, reject) => {
      database.ref('/tasks').orderByChild('date').equalTo(current).on('value', (snapshot) => {
        this.taskList = snapshot.val() || {};
        resolve(this.taskList);
      });
    })
  }

  onToggle(key, value) {
    const updatedAt = Date.now();
    return database.ref(`tasks/${key}`).update({ completed: value, updatedAt})
  }

  onAdd(task) {
    const createdAt = Date.now();
    const updatedAt = Date.now();
    return database.ref('/tasks').push({ ...task, createdAt, updatedAt });
  }

  onDelete(key) {
    const taskList = { ...this.taskList };
    delete taskList[key];
    this.taskList = { ...taskList };
    return database.ref(`/tasks/${key}`).remove()
  }
}

export default new Task()
