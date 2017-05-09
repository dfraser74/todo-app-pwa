class Notification {
  constructor(reg) {
    this.serviceWorker = reg;
    this.url = `${process.env.SERVER_HOST}/notification`;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.addSubscription = this.addSubscription.bind(this);
  }

  subscribe() {
    return new Promise((resolve, reject) => {
      this.serviceWorker.pushManager
          .subscribe({ userVisibleOnly: true })
          .then(this.addSubscription)
          .then(() => resolve())
          .catch(reject)
    })
  }

  unsubscribe() {
    return new Promise((resolve, reject) => {
      this.serviceWorker.pushManager
          .getSubscription()
          .then((sub) =>
            sub.unsubscribe()
              .then(() => this.deleteSubscription(sub))
              .then(() => resolve(sub))
              .catch(reject)
          );
    })
  }

  addSubscription(sub) {
    return new Promise((resolve, reject) => {
      const uid = sub.endpoint.split('gcm/send/')[1];
      const body = JSON.stringify({ uid: uid });
      const init = {
        method: 'POST',
        headers: this.headers,
        body: body
      };

      fetch(this.url, init)
        .then((res) => {
          if ( res.errors ) { reject(); }
          resolve(sub);
        })
        .catch(() => reject());
    });
  }

  deleteSubscription(sub) {
    return new Promise((resolve, reject) => {
      const uid = sub.endpoint.split('gcm/send/')[1];
      const init = {
        method: 'DELETE',
        headers: this.headers
      };
      fetch(`${this.url}${uid}`, init)
        .then((res) => {
            if ( res.errors ) { reject(); }
            resolve();
        })
        .catch(() => reject());
    });
  }
}

class NotificationStack {
  stacks = {};

  init(res) {
    this.stacks[res] = this.stacks[res] || new Notification(res);
    return this.stacks[res]
  }
}

export default new NotificationStack();
