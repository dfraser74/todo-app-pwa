import { observable } from 'mobx';
import { database } from '../db/firebase';

class Cateogry {
  @observable categoryList = {};

  constructor() {
    database.ref('categories').on('value', (snapshot) => {
      this.taskList = snapshot.val() || {};
    });
  }

  onAdd(category) {
    const createdAt = Date.now();
    const updatedAt = Date.now();
    return database.ref('categories').push({ ...category, createdAt, updatedAt });
  }

  onEdit(category, key) {
    const updatedAt = Date.now();
    return database.ref(`categories/${key}`).update({ ...category, updatedAt });
  }

  onDelete(key) {
    const categoryList = { ...this.categoryList };
    delete categoryList[key];
    this.categoryList = { ...categoryList };
    return database.ref(`categories/${key}`).remove()
  }
}

export default new Cateogry()
