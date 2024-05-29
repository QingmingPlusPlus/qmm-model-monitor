import {CSS2DObject,} from 'three/addons';
import {AxesHelper, } from 'three';
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
    }
}as const;

export {
    ObjectFactory
}