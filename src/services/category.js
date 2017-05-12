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
    this.dataOffline(UserService.info.uid);
    autorun(() => {
      if(this.createdBy === UserService.info.uid && !!this.createdBy) return;

      this.createdBy = UserService.info.uid;
      const createdBy = this.createdBy;

      if (!Network.check) {
        this.isLoaded = true;
        this.dataOffline(UserService.info.uid);
        !!this.database && typeof this.database.off === 'function' && this.database.off();
        return;
      } else {
        this.database = null;
      }

      this.database = database.ref('categories').on('value', (snapshot) => {
        const categoryList = snapshot.val() || {};
        this.isLoaded = true;
        if (Object.keys(categoryList).length === 0) return;

        this.isLoaded = true;
        this.categoryList = Object.keys(categoryList).reduce((obj, key) => {
          const category = categoryList[key]
          if (!!createdBy && category.createdBy === createdBy) {
            obj[key] = category;
            IndexDb.addCategory(category, key);
          };
          return obj;
        }, {})

      });
    });
  }

  onFetch(key) {
    return new Promise((resolve, reject) => {
      if (!Network.check) return IndexDb.fetch('categories', key).then(resolve).catch(reject);
      database.ref('categories').child(key).once('value').then( snapshot => {
        resolve(snapshot.val());
      });
    });
  }

  dataOffline(uid) {
    this.categoryList = {};
    setTimeout(() => {
      IndexDb.fetchAllCategories(uid || this.createdBy).then(categoryList => {
        if (!this.isLoaded || !Network.check) {
          this.categoryList = Object.keys(categoryList).reduce((obj, key) => {
            const category = categoryList[key];
            obj[key] = category;
            return obj;
          }, {})
        }
      })
    }, 2000);
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
    const newCategory = { ...category, updatedAt, updatedBy };

    return new Promise((resolve, reject) => {
      if (!Network.check) {
        IndexDb.addCategory(newCategory, key)
              .then((res, ...args) => {
                const categoryList = {...this.categoryList};
                categoryList[key] = {...categoryList[key], ...newCategory};
                this.categoryList = categoryList;
                resolve(res, ...args);
              }).catch(reject);
      } else {
        return database.ref(`categories/${key}`)
              .update(newCategory)
              .then(resolve).catch(reject);
      }
    })
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
