import Button from '../classes/Button.js';

export default class PlayMenu extends PIXI.Sprite {
  constructor() {
    super(ds.assets.misc['splash_screen']);
    ds.gui.addChild(this);
    this.hide();
    
    this.play = new Button(370 - 40, ds.baseSize.y / 2, 80, 32, 'Play BR', this);
    this.play.on('click', function() {
      ds.loginMenu.show();
    }).on('tap', function() {
      ds.loginMenu.show();
    });
  }
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }
};