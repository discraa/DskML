import Button from './modules/classes/Button.js';
import PlayMenu from './modules/screens/PlayMenu.js';
import LoginMenu from './modules/screens/LoginMenu.js';

(async () => {
  /* Setup */
  PIXI.TextureStyle.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

  window.ds = new PIXI.EventEmitter();
  ds.wsUrl = 'ws://localhost:8080';
  ds.connection = null;
  ds.version = '5.1.2';
  ds.vt = `?v=${ds.version}`;
  ds.baseSize = new PIXI.Point(740, 416);
  ds.ratio = new PIXI.Point(1, 1);
  ds.debug = {};
  ds.other = {};
  ds.utils = {};
  ds.spr2pos = spr => new PIXI.Point(spr % 16, Math.floor(spr / 16));
  ds.pos2spr = (x, y) => (x.x || x) + (x.y || y) * 16;

  ds.initNetwork = () => {
    ds.connection = new WebSocket(ds.wsUrl);
    
    ds.connection.addEventListener('open', e => {
      console.log('Connection opened:', e);
    });
    ds.connection.addEventListener('close', e => {
      console.log('Connection closed:', e);
    });
    ds.connection.addEventListener('error', e => {
      console.log('Connection error:', e);
    });
    ds.connection.addEventListener('message', e => {
      console.log('Connection message:', e);
    });
  };
  
  ds.center = (e, t) => {
    t = t || e.parent;
    e.x = (t.size2?.x || t.width) / 2;
  };
  ds.middle = (e, t) => {
    t = t || e.parent;
    e.y = (t.size2?.y || t.height) / 2;
  };

  ds.color = {};
  ds.color.bright = 7834252;
  ds.color.light = 6583413;
  ds.color.medium = 5005152;
  ds.color.base = 3686992;
  ds.color.dark = 2699322;

  ds.app = new PIXI.Application();

  await ds.app.init({ resizeTo: window });
  document.body.appendChild(ds.app.canvas);

  ds.stage = ds.app.stage;
  ds.gui = new PIXI.Container();
  ds.stage.addChild(ds.gui);
  ds.gui.sortableChildren = true;

  ds.tickerEvent = null;
  ds.app.ticker.add(event => {
    ds.tickerEvent = event;
    ds.emit('ticker', event);
  });

  ds.wait = ms => new Promise(res => setTimeout(res, ms));

  ds.resize = (size, x = 1, y = 1) => {
    size.set(x * ds.ratio.x, y * ds.ratio.y);
  };

  window.addEventListener('resize', e => {
    // ds.emit('resize', e.currentTarget.innerWidth, e.currentTarget.innerHeight);
  });

  ds.on('resize', (newWidth, newHeight) => {
    ds.ratio.set(newWidth / ds.baseSize.x, newHeight / ds.baseSize.y);
    ds.resize(ds.stage.scale);
  });
  ds.emit('resize', window.innerWidth, window.innerHeight);

  ds.assets = {};
  ds.assets.manifest = {
    bundles: [
      {
        name: 'monsters',
        assets: []
      },
      {
        name: 'misc',
        assets: []
      },
      {
        name: 'hair',
        assets: []
      },
      {
        name: 'clothes',
        assets: []
      },
      {
        name: 'body',
        assets: []
      }
    ]
  };
  ds.assets.clothesFixed = [1, 2, 3, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  ds.assets.clothesHooded = [5, 9, 12, 14];
  ds.assets.hairFixed = [6, 11, 12, 16, 17, 19, 20, 21, 22];
  ds.assets.hairFront = [10, 14];
  ds.assets.maxClothes = 16;
  ds.assets.maxHairs = 22;
  ds.assets.maxBodys = 9;
  ds.assets.maxCotumes = 148;

  ds.assets.addToBundle = (name, path) => {
    const bundle = ds.assets.manifest.bundles.find(e => e.name == name);

    if (bundle) {
      const alias = path.substring(
        path.lastIndexOf('/') + 1,
        path.lastIndexOf('.')
      );

      bundle.assets.push({
        alias: alias,
        src: path
      });
    } else {
      console.log(`No bundle named (${name}) was found`);
    }

    return ds.assets;
  };

  ds.assets.loadAssets = async () => {
    ds.debug.loading.visible = true;
    ds.other.transition.visible = true;

    ds.debug.loading.text = 'Loading bundles ...';

    /* Monsters */
    for (let i = 1; i <= ds.assets.maxCotumes; i++) {
      ds.assets.addToBundle('monsters', `data/monsters/${i}.png`);
    }

    // General
    ds.assets
      .addToBundle('misc', 'data/misc/tile16.png')
      .addToBundle('misc', 'data/misc/item16.png')
      .addToBundle('misc', 'data/misc/splash_screen.jpg')
      .addToBundle('misc', 'data/misc/star.png')
      .addToBundle('misc', 'data/misc/sound_icon.png')
      .addToBundle('misc', 'data/misc/music_icon.png')
      .addToBundle('misc', 'data/misc/mapfont.fnt')
      .addToBundle('misc', 'data/misc/edges.png')
      .addToBundle('misc', 'data/misc/compass.png')
      .addToBundle('misc', 'data/misc/color.png')
      .addToBundle('misc', 'data/misc/chat_tribe.png')
      .addToBundle('misc', 'data/misc/chat_tell.png')
      .addToBundle('misc', 'data/misc/chat_say.png')
      .addToBundle('misc', 'data/misc/chat_party.png')
      .addToBundle('misc', 'data/misc/chat_global.png')
      .addToBundle('misc', 'data/misc/button.png')
      .addToBundle('misc', 'data/misc/buffs.png');

    // Hair
    for (let i = 1; i <= ds.assets.maxHairs; i++) {
      ds.assets.addToBundle('hair', `data/hair/h${i}_a.png`);

      if (-1 != ds.assets.hairFixed.indexOf(i)) {
        ds.assets.addToBundle('hair', `data/hair/h${i}_b.png`);
      }
      if (-1 != ds.assets.hairFront.indexOf(i)) {
        ds.assets.addToBundle('hair', `data/hair/h${i}_c.png`);
      }
    }

    // Clothes
    for (let i = 1; i <= ds.assets.maxClothes; i++) {
      ds.assets.addToBundle('clothes', `data/clothes/c${i}_a.png`);

      if (-1 != ds.assets.clothesFixed.indexOf(i)) {
        ds.assets.addToBundle('clothes', `data/clothes/c${i}_b.png`);
      }
    }

    // Body
    ds.assets.addToBundle('body', 'data/body/e1.png');
    for (let i = 1; i <= ds.assets.maxBodys; i++) {
      ds.assets.addToBundle('body', `data/body/b${i}.png`);
    }

    await PIXI.Assets.init({ manifest: ds.assets.manifest });

    ds.assets.monsters = await PIXI.Assets.loadBundle('monsters', num => {
      ds.debug.loading.text = `Loading monsters: ${Math.floor(num * 100)}% ...`;
    });

    ds.assets.misc = await PIXI.Assets.loadBundle('misc', num => {
      ds.debug.loading.text = `Loading misc: ${Math.floor(num * 100)}% ...`;
    });

    ds.assets.hair = await PIXI.Assets.loadBundle('hair', num => {
      ds.debug.loading.text = `Loading hair: ${Math.floor(num * 100)}% ...`;
    });

    ds.assets.clothes = await PIXI.Assets.loadBundle('clothes', num => {
      ds.debug.loading.text = `Loading clothes: ${Math.floor(num * 100)}% ...`;
    });

    ds.assets.body = await PIXI.Assets.loadBundle('body', num => {
      ds.debug.loading.text = `Loading body: ${Math.floor(num * 100)}% ...`;
    });

    ds.debug.loading.text = 'Loading sprite sheets ...';
    await ds.assets.loadSpriteSheets();

    ds.debug.loading.text = 'Loaded!';
    ds.emit('loadAssets');
  };

  ds.other.loadAlpha = 1;
  ds.other.loadUpdate = event => {
    ds.other.loadAlpha -= 0.04 * event.deltaTime;

    if (ds.other.loadAlpha < 0) {
      ds.other.loadAlpha = 0;
      ds.off('ticker', ds.other.loadUpdate);
    }

    ds.debug.loading.alpha = ds.other.loadAlpha;
  };

  ds.other.transition = new PIXI.Graphics();
  ds.gui.addChild(ds.other.transition);
  ds.other.transition.zIndex = 10;
  ds.other.transition.visible = false;
  ds.other.transition.onRender = () => {
    ds.other.transition.clear().rect(0, 0, ds.baseSize.x, ds.baseSize.y).fill({
      color: 0,
      alpha: ds.other.loadAlpha
    });
  };

  ds.debug.loading = new PIXI.Text({
    text: 'Loading ...',
    style: {
      fontFamily: 'Verdana',
      fontSize: 30,
      fill: '#fff',
      align: 'center',
      stroke: {
        color: 0,
        width: 4
      }
    }
  });
  ds.gui.addChild(ds.debug.loading);
  ds.debug.loading.zIndex = 11;
  ds.debug.loading.anchor.set(0.5);
  ds.debug.loading.position.set(ds.baseSize.x / 2, ds.baseSize.y / 2);
  ds.debug.loading.visible = false;

  ds.spritesheet = (_texture, _row, _col, _isEntity = true) => {
    const textureWidth = _texture.source.pixelWidth;
    const textureHeight = _texture.source.pixelHeight;
    let spriteWidth = 16;
    let spriteHeight = 16;

    if (_isEntity) {
      spriteWidth = textureWidth / 3;
      spriteHeight = textureHeight / 4;
    }
    const rowFrame = spriteWidth * _row;
    const colFrame = spriteHeight * _col;

    return new PIXI.Texture({
      source: _texture,
      frame: new PIXI.Rectangle(rowFrame, colFrame, spriteWidth, spriteHeight)
    });
  };

  ds.assets.loadSpriteSheets = () => {
    return new Promise(res => {
      const array = () => {
        const arr = new Array(4);
        for (let i = 0; i < arr.length; i++) arr[i] = new Array(3);
        return arr;
      };

      ds.assets.monstersSheet = [0];
      Object.keys(ds.assets.monsters)
        .filter(e => !Number.isNaN(Number(e)))
        .sort((a, b) => a - b)
        .forEach(key => {
          const texture = ds.assets.monsters[key];
          const arr = array();

          for (let col = 0; col < arr.length; col++) {
            for (let row = 0; row < arr[0].length; row++) {
              arr[col][row] = ds.spritesheet(texture, row, col, true);
            }
          }

          ds.assets.monstersSheet.push(arr);
        });

      ds.assets.tileSheet = new Array(16);
      for (let i = 0; i < 16; i++) ds.assets.tileSheet[i] = new Array(64);
      ds.assets.itemSheet = new Array(16);
      for (let i = 0; i < 16; i++) ds.assets.itemSheet[i] = new Array(64);

      for (let row = 0; row < 16; row++) {
        for (let col = 0; col < 64; col++) {
          ds.assets.tileSheet[row][col] = ds.spritesheet(
            ds.assets.misc['tile16'],
            row,
            col,
            false
          );
          ds.assets.itemSheet[row][col] = ds.spritesheet(
            ds.assets.misc['item16'],
            row,
            col,
            false
          );
        }
      }

      res();
    });
  };

  ds.once('loadAssets', () => {
    ds.on('ticker', ds.other.loadUpdate);
  });

  await ds.assets.loadAssets();

  const fpsLabel = new PIXI.Text({
    text: 'FPS: 0',
    style: {
      fontFamily: 'Verdana',
      fontSize: 16,
      fill: '#fff',
      align: 'center',
      stroke: {
        color: '#000',
        width: 4
      }
    }
  });
  fpsLabel.onRender = () => {
    fpsLabel.text = `FPS: ${Math.floor(60 / ds.tickerEvent.deltaTime)}`;
  };
  fpsLabel.zIndex = 13;
  ds.gui.addChild(fpsLabel);

  ds.Entity = class extends PIXI.AnimatedSprite {
    constructor(_x = 0, _y = 0, _spriteId = 1, _parent) {
      super([new PIXI.Texture()]);
      this.anchor.set(0.5);
      this.position.set(_x, _y);
      this.animationSpeed = 0.07;
      this.spriteId = _spriteId;
      this.direction = 2;
      this.updateAnimatedSprite();

      this.gfx = new PIXI.Graphics();
      this.addChild(this.gfx);

      this.onLoop = () => {
        this.gfx.clear().rect(0, 0, 1, 1).fill('red');

        this.updateAnimatedSprite();
        this.play();
      };

      (_parent || ds.gui).addChild(this);
    }
    updateTextures() {
      this.textures = ds.assets.monstersSheet[this.spriteId][this.direction];
    }
    updateAnimatedSprite() {
      this.updateTextures();
      this.textures = this.textures;
      this.updateAnimatedSpriteScale();
    }
    updateAnimatedSpriteScale() {
      const texture = this.textures[this.currentFrame];
      this.scale.x = texture.pixelWidth < 32 ? 32 / texture.pixelWidth : 2;
      this.scale.y = texture.pixelHeight < 32 ? 32 / texture.pixelHeight : 2;
    }
  };

  ds.Monster = class extends ds.Entity {
    constructor(_x = 0, _y = 0, _spriteId = 1, _parent) {
      super(_x, _y, _spriteId, _parent);
      this.directions = [0, 1, 2, 3];
      this.play();
    }
    setSprite(_spriteId) {
      this.spriteId = _spriteId;
      this.updateAnimatedSprite();
    }
    setDirection(_direction) {
      this.direction = _direction;
      this.updateAnimatedSprite();
    }
    setWorldPosition(x, y) {
      this.x = (x.x || x) * 32;
      this.y = (x.y || y) * 32;
    }
  };

  ds.playMenu = new PlayMenu();
  ds.loginMenu = new LoginMenu();
  
  ds.playMenu.show();
  
  
})();
