import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {TextureLoader} from 'three';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

class ModelLoader {
    gltfLoader;
    dracoLoader;

    initGltfLoaderWithDraco(path = '/draco/gltf/') {
        if (!this.gltfLoader) {
            this.gltfLoader = new GLTFLoader();
        }
        if (!this.dracoLoader) {
            this.dracoLoader = new DRACOLoader();
            this.dracoLoader.setDecoderPath(path);
            this.dracoLoader.setDecoderConfig({type: 'wasm'});
            this.gltfLoader.setDRACOLoader(this.dracoLoader);
        }
    }

    async loadGltf(url) {
        this.initGltfLoaderWithDraco()
        return this.gltfLoader.loadAsync(url)
    }

    async loadTexture(url) {
        return new Promise((resolve, reject) => {
            new TextureLoader().load(url, resolve, undefined, reject)
        })
    }

    async loadEnvMap(url) {
        const rgbeLoader = new RGBELoader();
        return await rgbeLoader.loadAsync(url);
    }
}

export {
    ModelLoader,
}
