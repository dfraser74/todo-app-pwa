import { observable } from 'mobx';

class Drawer {
  @observable open = false;

  onOpen() {
    this.open = true;
  }

  onClose() {
    this.open = false;
  }

  onToggle() {
    this.open = !this.open;
  }

  onRequestChange(open) {
    this.open = open;
  }
}

export default new Drawer();
