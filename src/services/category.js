import { observable, autorun } from 'mobx';
import { database } from '../db/firebase';
import IndexDb from './indexDb';
import Network from './network';
import UserService from './user';

class Category {
  @observable categoryList = {};
  createdBy = UserService.info.uid;
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

  onFetch(key) {
    return new Promise((resolve, reject) => {
      database.ref('categories').child(key).once('value').then( snapshot => {
        resolve(snapshot.val());
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
    const createdBy = UserService.info.uid;
    return database.ref('categories').push({ ...category, createdAt, updatedAt, createdBy, updatedBy: createdBy });
  }

  onEdit(category, key) {
    const updatedAt = Date.now();
    const updatedBy = UserService.info.uid;
    return database.ref(`categories/${key}`).update({ ...category, updatedAt, updatedBy });
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

export default new Category();
