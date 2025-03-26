export default class TextInput extends PIXI.Sprite {
  constructor(parent) {
    super();
    parent.addChild(this);
    
    /*
    e.type = "text"
    e.style.display = "none"
    e.style.position = "fixed"
    e.style.opacity = 0
    e.style.pointerEvents = "none"
    e.style.left = "0px"
    e.style.bottom = "0px"
    e.style.left = "-100px"
    e.style.top = "-100px"
    e.style.zIndex = 10
    e.autocapitalize = "off"
    */

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.style.display = 'none';
    this.input.style.position = 'fixed';
    this.input.style.opacity = 0;
    this.input.style.pointerEvents = 'none';
    this.input.style.left = '0px';
    this.input.style.bottom = '0px';
    this.input.style.left = '-100px';
    this.input.style.top = '-100px';
    this.input.style.zIndex = 10;
    this.input.autocapitalize = 'off';
    document.body.appendChild(this.input);

    this.input.addEventListener('input', e => {
      console.log(e);
    });
  }
  focus() {
    setTimeout(() => {
      console.log(this.input.focus);
      this.input.focus();
    }, 5);
  }
}
