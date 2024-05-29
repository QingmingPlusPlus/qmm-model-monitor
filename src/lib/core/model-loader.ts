import {GLTFLoader, DRACOLoader,RGBELoader} from 'three/addons';
import {GLTF} from 'three/examples/jsm/loaders/GLTFLoader.d.ts';
import {TextureLoader} from 'three';
import {Texture} from 'three/src/textures/Texture.d.ts';
import {DataTexture} from 'three/src/textures/DataTexture.d.ts';


class ModelLoader {
    private gltfLoader?: GLTFLoader;
    private dracoLoader?: DRACOLoader;
    private rgbeLoader?: RGBELoader;

    public initGltfLoaderWithDraco(path: string = '/draco/gltf/') {
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

    public async loadGltf(url: string): Promise<GLTF> {
        if (!this.gltfLoader || !this.dracoLoader) {
            this.initGltfLoaderWithDraco();
        }
        if (!this.gltfLoader || !this.dracoLoader) {
            throw new Error('Gltf loader or draco loader not initialized')
        }
        return this.gltfLoader!.loadAsync(url)
    }

    public async loadTexture(url: string): Promise<Texture> {
        return new Promise((resolve, reject) => {
            new TextureLoader().load(url, resolve, undefined, reject)
        })
    }

    public async loadEnvMap(url: string): Promise<DataTexture> {
        if (!this.rgbeLoader) {
            this.rgbeLoader = new RGBELoader();
        }
        return await this.rgbeLoader.loadAsync(url);
    }
}

export {
    ModelLoader
}