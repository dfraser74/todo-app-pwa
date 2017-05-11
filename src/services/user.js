import { auth, database, storage } from '../db/firebase';
import { observable } from 'mobx';

const fields = ['uid', 'email', 'photoURL', 'displayName', 'refreshToken', 'emailVerified', 'birthday', 'gender', 'notifications'];

class User {
  @observable isLoaded = false;
  @observable info = {
    uid: null,
    email: null,
    gender: 'male',
    photoURL: null,
    birthday: null,
    displayName: null,
    refreshToken: null,
    notifications: true,
    emailVerified: false,
  };

  onSave(profile, file) {
    if (!!file) {
      return new Promise((resolve, reject) => {
        storage.ref(`/users/${file.name}`)
          .put(file)
          .then(res => {
            profile.photoURL = res.downloadURL;
            auth.currentUser
                .updateProfile(profile)
                .then(() => {
                  database.ref(`/users/${this.info.uid}`).update(profile);
                  resolve(profile);
                }, reject);
          });
      });
    }

    return new Promise((resolve, reject) => {
      auth.currentUser
          .updateProfile(profile)
          .then(() => {
            database.ref(`/users/${this.info.uid}`).update(profile);
            resolve(profile);
          }, reject);
    })
  }

  onLogin({ email, password }, callback) {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => callback(null))
      .catch(callback)
  }

  onLogout() {
    return auth.signOut();
  }

  onRegister({email, password, displayName}, callback) {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const profile = { birthday: Date.now(), gender: 'male', notifications: true };
        if (!!displayName) profile.displayName = displayName;
        database.ref(`/users/${user.uid}`).set(profile)
        callback(null);
      })
      .catch((error) => {
        const errors = {};
        switch (error.code) {
          case 'auth/weak-password':
            errors.password = error.message;
            break;
          case 'auth/invalid-email':
          case 'auth/email-already-in-use':
            errors.email = error.message;
            break;
          default:
            errors.errorText = error.message
        }
        callback(Object.keys(errors).length > 0, errors);
      })
  }
}

const currentUser = new User();

auth.onAuthStateChanged((user) => {
  if (user !== null && !user.isAnonymous) {
    const info = fields.reduce((obj, item) => ({ ...obj, [item]: user[item] }), {});
    currentUser.info = {...info};
    database.ref('/users').child(user.uid).on('value', snapshot => {
      if (!snapshot.val()) return;
      const newUser = snapshot.val();
      const newInfo = fields.reduce((obj, item) => {
        !!newUser[item] && (obj[item] = newUser[item]);
        return obj;
      }, {});
      currentUser.info = {...currentUser.info, ...newInfo};
    })

  } else {
    currentUser.info = {};
  }

  currentUser.isLoaded = true;
})

export default currentUser;
