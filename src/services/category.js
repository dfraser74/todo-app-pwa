import { observable, autorun } from 'mobx';
import { database } from '../db/firebase';
import IndexDb from './indexDb';
import Network from './network';

class Cateogry {
  @observable categoryList = {};
  database;
  isLoaded;

  constructor() {
    this.dataOffline();
    autorun(() => {
      if (!Network.check) {
        this.dataOffline();
        !!this.database && typeof this.database.off === 'function' && this.database.off();
        return;
      } else {
        this.database = null;
      }

      this.database = database.ref('categories').on('value', (snapshot) => {
        this.categoryList = snapshot.val() || {};
        this.isLoaded = true;
        if (Object.keys(this.categoryList).length === 0) return;
        IndexDb.syncDatabaseCategory(this.categoryList);
      });
    });
  }

  dataOffline() {
    IndexDb.onsuccess = (e) => {
      IndexDb.fetchAllCategories().then(categories => {
        if (!this.isLoaded || !Network.check) {
          this.categoryList = {...categories};
        }
      })
    }
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

  onFilter(text) {
    if (!!!text) return this.categoryList;
  }
}

export default new Cateogry();
