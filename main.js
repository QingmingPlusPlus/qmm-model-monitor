import './style.css'
import $ from 'jquery'
import {ModelMonitor, ModelLoader, ObjectFactory, TextureCanvas} from './src/index.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import {EquirectangularReflectionMapping} from 'three';



(async function () {
        const app = document.getElementById('app')
        if (!app) throw new Error('No app element found')

        const modelMonitor = new ModelMonitor(app.clientWidth, app.clientHeight)
        app.appendChild(modelMonitor.renderer.domElement)
        app.appendChild(modelMonitor.css2dRenderer.domElement)
        modelMonitor.startAnimation()
        modelMonitor.camera.position.set(10, 10, 10)

        const modelLoader = new ModelLoader()

        const model = await modelLoader.loadGltf('/model.glb')

        const envMap = await modelLoader.loadEnvMap('/env.hdr')
        modelMonitor.setEnvMap(envMap)

        const detailInfo = []
        model.scene.traverse((obj) => {
            if (obj.isLight) {
                obj.intensity /= 1000
            } else if (obj.name === '立方体' || obj.name === '立方体027' || obj.name === '立方体014' || obj.name === '立方体018') {
                const dom = $(`
                        <div class="info">
                            <div class="label">测试数据1:</div>
                         <div class="value">16℃</div>
                        </div>
                    `)
                const css2dObject = ObjectFactory.createCss2dObject(dom[0])
                css2dObject.position.set(0, 1, 0)
                modelMonitor.addObject(css2dObject, obj);

                const dom2 = $(`
                        <div class="info">
                            <div class="label">测试数据2:</div>
                         <div class="value">详细信息222222</div>
                        </div>
                    `)
                const css2dObject2 = ObjectFactory.createCss2dObject(dom2[0])
                css2dObject2.position.set(0, -1, 0)
                css2dObject2.visible = false
                obj.hasDetailDomObject = true
                detailInfo.push([obj.name,css2dObject2])
                modelMonitor.addObject(css2dObject2, obj);

            }
        })
        modelMonitor.addObject(model.scene);

        const hoverHandler = (obj) => {
                detailInfo.find(([name, dom]) => {
                    dom.visible = name === obj.name;
                })
        }

        modelMonitor.setHoverHandler(hoverHandler)

    }
)()