import './style.css'
import {ModelLoader, ModelMonitor} from './lib';
import {Light} from 'three';

const app = document.getElementById('app');
if (!app) throw new Error('No app element');

//初始化ModelMonitor
const modelMonitor = new ModelMonitor(app.clientWidth, app.clientHeight)
app.appendChild(modelMonitor.renderer.domElement)
app.appendChild(modelMonitor.css2dRenderer.domElement)
modelMonitor.startAnimation()
modelMonitor.camera.position.set(10, 10, 10)

//初始化ModelLoader
const modelLoader = new ModelLoader()
const model = await modelLoader.loadGltf('/model.glb')
const envMap = await modelLoader.loadEnvMap('/env.hdr')
modelMonitor.setEnvMap(envMap)

//模型操作
console.log(model.scene)
model.scene.traverse((obj) => {
    if ((obj as Light).isLight) {
        (obj as Light).intensity /= 800
    }
})
modelMonitor.addObject(model.scene);