import { observable, computed } from 'mobx';

class Network {
  @observable isOnline = navigator.onLine;
  constructor() {
    this.updateStatus = this.updateStatus.bind(this);
    window.addEventListener('online', this.updateStatus);
    window.addEventListener('offline', this.updateStatus);
    console.log(`Site is ${navigator.onLine ? 'online' : 'offline'}`);
  }

  updateStatus() {
    console.log(`Site is ${navigator.onLine ? 'online' : 'offline'}`);
    this.isOnline = navigator.onLine;
  }

  @computed get check() {
    return this.isOnline;
  }
}

export default new Network();
