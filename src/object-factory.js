import {Sprite, SpriteMaterial, Texture} from 'three';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import $ from 'jquery';

const ObjectFactory = Object.freeze({
    createCss2dObject(dom) {
        return new CSS2DObject(dom);
    },
    createSprite(config) {
        return new Sprite(new SpriteMaterial(config));
    },
    createSpriteTextureFromCanvas(canvas) {
        const texture = new Texture(canvas)
        texture.needsUpdate = true;
        return texture;
    },
    createDom(htmlText) {
        return $(htmlText)[0]
    },
})

class TextureCanvas {
    dom;

    constructor(size = {width: 256, height: 256}) {
        this.dom = document.createElement('canvas');
        this.dom.width = size.width;
        this.dom.height = size.height;
    }

    drawText(text, _config) {
        const config = Object.assign({color: '#000000', size: 20, font: 'Arial', x: 0, y: 0}, _config);
        const ctx = this.dom.getContext('2d');

        if (!ctx) {
            return
        }

        ctx.font = `${config.size}px ${config.font}`;
        ctx.fillStyle = config.color;
        ctx.fillText(text, config.x, config.y);

    }

    drawRect(_config) {
        const config = Object.assign({color: '#000000', x: 0, y: 0, w: 10, h: 10}, _config);
        const ctx = this.dom.getContext('2d');

        if (!ctx) {
            return
        }

        ctx.fillStyle = config.color;
        ctx.fillRect(config.x, config.y, config.w, config.h);
    }

    drawImage(image, _config) {
        const {x, y, w, h, rotate} = Object.assign({x: 0, y: 0, w: 1, h: 1, rotate: 0}, _config);
        const ctx = this.dom.getContext('2d');
        if (!ctx) {
            return;
        }

        if (!rotate) {
            ctx.drawImage(image, x, y, w, h);
            return;
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotate);
        ctx.drawImage(image, -w / 2, -y / 2, w, y);
        ctx.restore();

    }

    clear() {
        const ctx = this.dom.getContext('2d');
        if (!ctx) {
            return
        }

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.dom.width, this.dom.height);
        ctx.restore();
    }
}

export {
    ObjectFactory, TextureCanvas,
}