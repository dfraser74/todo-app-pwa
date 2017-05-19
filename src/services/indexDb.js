const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

import { database } from '../db/firebase';

class IndexedDB {
  connection;
  constructor() {
    const connection = indexedDB.open("todo-app-pwa", 1);
    connection.onerror = (event) => {
      console.log('Connect indexedDB error: ', event);
    };

    connection.onsuccess = (event) => {
      console.log('Connect indexedDB success');
      this.connection = connection.result;
      this.onsuccess && this.onsuccess();
    }

    connection.onupgradeneeded = function(event) {
      const db = event.target.result;
      ['users', 'tasks', 'categories'].forEach((item) => {
        db.createObjectStore(item, {keyPath: "id"});
      });
    }
  }

  add(table, data, key) {
    return new Promise((resolve, reject) => {
      if (!!!this.connection) return reject("Can't connection indexedDB");
      const request = this.connection.transaction([table], "readwrite");
      const objectStore = request.objectStore(table);
      const checkExist = objectStore.get(key);
      checkExist.onerror = reject;

      checkExist.onsuccess = (event) => {
        if(!checkExist.result) {
          const addNew = objectStore.add({ id: key, ...data });
          addNew.onerror = (event) => reject(event.result);
          addNew.onsuccess = (event) => resolve({ id: key, ...data });
        } else {
          const oldCategory = checkExist.result;

          if (oldCategory.updatedAt < data.updatedAt) {
            const updateNew = objectStore.put({...oldCategory, ...data});
            updateNew.onerror = (event) => reject(event.result);
            updateNew.onsuccess = (event) => resolve({ id: key, ...data });
          } else if (oldCategory.updatedAt > data.updatedAt) {
            const newCategory = {...data, ...oldCategory};
            database.ref(`categories/${key}`)
              .update(newCategory)

            resolve(checkExist.result);
          } else {
            resolve(checkExist.result);
          }
        }
      }
    })
  }

  addUser(user, key) {
    return this.add('users', user, key);
  }

  addTask(task, key) {
    return this.add('tasks', task, key);
  }

  addCategory(category, key) {
    return this.add('categories', category, key);
  }

  sync(table, data) {
    return Promise.all(Object.keys(data).map(key => {
      const task = {...data[key]};
      return this.add(table, task, key);
    }));
  }

  syncDatabaseTask(tasks) {
    return this.sync('tasks', tasks);
  }

  syncDatabaseCategory(categories) {
    return this.sync('categories', categories);
  }

  fetch(table, key) {
    return new Promise((resolve, reject) => {
      if (!!!this.connection) return reject("Can't connection indexedDB");
      const request = this.connection.transaction(table, "readonly");
      const objectStore = request.objectStore(table);
      const checkExist = objectStore.get(key);
      checkExist.onerror = reject;
      checkExist.onsuccess = (event) => {
        if(!checkExist.result) {
          reject(null);
        } else {
          resolve(checkExist.result);
        }
      };
    })
  }

  fetchAllTask(createdBy) {
    return new Promise((resolve, reject) => {
      if (!!!this.connection) return reject("Can't connection indexedDB");
      const request = this.connection.transaction(["tasks"], "readonly");
      const cursorRequest = request.objectStore("tasks").openCursor();
      const tasks = {};
      cursorRequest.onsuccess = (event) => {
        const result = event.target.result;
        if (!result) return;
        if (createdBy === result.value.createdBy) tasks[result.key] = result.value;
        result.continue();
      }

      request.oncomplete = () => resolve(tasks);
    })
  }

  fetchAllCategories(createdBy) {
    return new Promise((resolve, reject) => {
      if (!!!this.connection) return reject("Can't connection indexedDB");
      const request = this.connection.transaction(["categories"], "readonly");
      const cursorRequest = request.objectStore("categories").openCursor();
      const tasks = {};
      cursorRequest.onsuccess = (event) => {
        const result = event.target.result;
        if (!result) return;
        if (createdBy === result.value.createdBy) tasks[result.key] = result.value;
        result.continue();
      }

      request.oncomplete = () => resolve(tasks);
    })
  }
}

export default new IndexedDB();
