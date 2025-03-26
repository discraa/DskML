import Button from '/modules/classes/Button.js';
import TextInput from '/modules/classes/TextInput.js';

export default class LoginMenu extends PIXI.Sprite {
  constructor() {
    super(ds.assets.misc['splash_screen']);
    ds.gui.addChild(this);
    this.hide();
    
    this.login = new Button(370 - 40, 0, 80, 36, 'Hi', this);
    ds.middle(this.login);
    
    this.baka = new TextInput(this);
    
    this.login.on('pointerdown', () => {
      console.log('baaaaaa');
      this.baka.focus();
    });
  }
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }
};