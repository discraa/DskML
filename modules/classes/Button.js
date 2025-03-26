export default class Button extends PIXI.Sprite {
  constructor(
    _x = 0,
    _y = 0,
    _width = 32,
    _height = 32,
    _textOptions,
    _parent
  ) {
    super();
    this.position.set(_x, _y);
    this.size2 = new PIXI.Point(_width, _height);

    this.gfx = new PIXI.Graphics();
    this.addChild(this.gfx);

    this.textOptions =
      typeof _textOptions === 'object'
        ? _textOptions
        : {
            text: typeof _textOptions === 'string' ? _textOptions : 'Title',
            style: {
              fill: 'white',
              fontSize: 12,
              align: 'center'
            }
          };

    this.title = new PIXI.Text(this.textOptions);
    this.addChild(this.title);
    this.title.anchor.set(0.5);
    ds.center(this.title);
    ds.middle(this.title);

    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.pressedAlpha = 0.8;
    this.unpressedAlpha = 1;
    this.pressed = () => (this.alpha = this.pressedAlpha);
    this.unpressed = () => (this.alpha = this.unpressedAlpha);
    this.on('pointerdown', this.pressed)
      .on('pointerup', () => this.unpressed())
      .on('pointerupoutside', this.unpressed);

    this.strokeWidth = 3;
    this.strokeColor = ds.color.light;
    this.cornerRadius = 2;
    this.color = ds.color.base;

    this.onRender = () => {
      this.gfx
        .clear()
        .roundRect(0, 0, this.size2.x, this.size2.y, this.cornerRadius)
        .fill({
          color: this.color
        })
        .stroke({
          color: this.strokeColor,
          width: this.strokeWidth,
          alignment: 0
        });
    };

    (_parent || ds.gui).addChild(this);
  }

  setText(text) {
    this.title.text = text;
    ds.center(this.title);
    ds.middle(this.title);
  }
};