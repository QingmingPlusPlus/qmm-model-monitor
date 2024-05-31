import {CSS2DObject} from 'three/addons';
import {AxesHelper, RectAreaLight, UniformsLib} from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import $ from 'jquery';

const ObjectFactory = {
    createCss2dObject(dom:HTMLElement) {
        return new CSS2DObject(dom);
    },

    createDom(htmlText:string) {
        return $(htmlText)[0]
    },

    createAxesHelper(size:number) {
        return new AxesHelper(size)
    },

    createRectAreaLight(color: number, intensity: number, width: number, height: number) {
        if(!('RectAreaLight' in UniformsLib)){
            RectAreaLightUniformsLib.init();
        }
        return new RectAreaLight(color, intensity, width, height);
    }


}as const;

export {
    ObjectFactory
}