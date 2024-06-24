import './style.css'
import {ModelLoader, ModelMonitor, ObjectFactory} from './lib';
import {Light, Object3D} from 'three';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.d.ts';

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
modelLoader.initGltfLoaderWithDraco()

//补上灯光
const plantLight = ObjectFactory.createRectAreaLight(0xffffff, 24, 13, 12)
plantLight.position.set(0, 60, 0)
plantLight.lookAt(0, 0, 0)
modelMonitor.addObject(plantLight)

//加载场景
const model = await modelLoader.loadGltf('/model-scene.glb')
const envMap = await modelLoader.loadEnvMap('/env.hdr')
modelMonitor.setEnvMap(envMap)
modelMonitor.addObject(model.scene);
// modelMonitor.scene.traverse(c=>{
//     //@ts-ignore
//     if (c.isLight){
//         (c as Light).intensity*=2
//     }
// })
//加载设备并构建map
const devMap: Map<string, Object3D> = new Map()
const deviceSubScene = await modelLoader.loadGltf('/model-dev.glb')

deviceSubScene.scene.children.forEach(obj => {
    if (obj?.userData) {
        const userData = obj.userData as { key: string, type: string };
        devMap.set(`${userData.key}-${userData.type}`, obj)
    }
})
const devConfig = [
    {
        key: 'exchanger-on',
        position: [-8.0621, 0.7611, -6.0113 - 0.0035]
    }, {
        key: 'exchanger-on',
        position: [-8.0621, 0.7611, -4.7714 - 0.0035]
    }, {
        key: 'exchanger-on',
        position: [-8.0621, 0.7611, -3.5089 - 0.0035]
    }, {
        key: 'exchanger-off',
        position: [-8.0621, 0.7611, -2.2014 - 0.0035]
    },
    {
        key: 'bump-off',
        position: [-1.7775, 1.191, -5.9333 + 0.1633]
    }, {
        key: 'bump-on',
        position: [-1.7775, 1.191, -4.5961 + 0.1633]
    }, {
        key: 'bump-on',
        position: [-1.7775, 1.191, -3.2548 + 0.1633]
    }, {
        key: 'bump-on',
        position: [-1.7775, 1.191, -1.8854 + 0.1633]
    }, {
        key: 'bump-on',
        position: [-1.7775, 1.191, -0.52576 + 0.1633]
    }, {
        key: 'bump-on',
        position: [-1.7775, 1.191, 1.9393 + 0.1633]
    }, {
        key: 'bump-on',
        position: [-1.7775, 1.191, 3.3076 + 0.1633]
    }, {
        key: 'bump-on',
        position: [-1.7775, 1.191, 4.6722 + 0.1633]
    }, {
        key: 'bump-on',
        position: [-1.7775, 1.191, 6.0242 + 0.1633]
    },
    {
        key: 'boiler-on',
        position: [3.6037, 0.70215, -5.1358 - 0.1526]
    }, {
        key: 'boiler-on',
        position: [3.6037, 0.70215, -3.8817 - 0.1526]
    }, {
        key: 'boiler-on',
        position: [3.6037, 0.70215, -2.6136 - 0.1526]
    }, {
        key: 'boiler-on',
        position: [3.6037, 0.70215, -1.3789 - 0.1526]
    }, {
        key: 'boiler-on',
        position: [3.6037, 0.70215, -0.13778 - 0.1526]
    }, {
        key: 'boiler-off',
        position: [3.6037, 0.70215, 2.4304 - 0.1526]
    }, {
        key: 'boiler-off',
        position: [3.6037, 0.70215, 3.7192 - 0.1526]
    }, {
        key: 'boiler-off',
        position: [3.6037, 0.70215, 5.0316 - 0.1526]
    }
]
devConfig.forEach(({key, position}) => {
    const dev = devMap.get(key)!.clone()
    if (dev) {
        //@ts-ignore
        dev.position.set(...position)
        modelMonitor.addObject(dev)
    }
})
//创建小指示牌
const creatInfoLabel = (val?: number) => {
    return ObjectFactory.createDom(`
                        <div class="info">
                         <div class="value"><strong>${val || '--'}</strong>℃</div>
                        </div>
                    `)
}
// 创建设备指示牌
const createDevLabel = (val?: number | null, devName?: string) => {
    return ObjectFactory.createDom(`
        <div>
            <div class="detail">
                <div class="detail-title">${devName || '--'}</div>
                <div class="detail-info">
                    <span>当前水温</span>   
                    <span>
                        <strong>${val || '--'}</strong>
                        ℃
                    </span>   
                </div>
                  <div class="detail-info">
                    <span>运行状态</span>   
                    <span>
                        <strong>正常</strong>
                    </span>   
                </div>
            </div>
        </div>
`
    )
}
const createPointLabel = (val1?: number, val2?: number) => {
    return ObjectFactory.createDom(`
                       <div>
                    <div class="detail">
                        <div class="detail-info">
                            <span>当前流速</span>   
                            <span>
                                <strong>${val1 || '--'}</strong>
                                m³/h
                            </span>   
                        </div>
                        <div class="detail-info">
                            <span>当前水温</span>   
                            <span>
                                <strong>${val2 || '--'}</strong>
                                ℃
                            </span>   
                        </div>
                    </div>
                </div>   
                    `)

}
//加载占位点
const placeHolderSubScene = await modelLoader.loadGltf('/model-placeholder.glb')
const infoLabels: CSS2DObject[] = []
const detailLabels: CSS2DObject[] = []
const devLabels: { name: string, obj: CSS2DObject }[] = []

placeHolderSubScene.scene.traverse(obj => {
    if (obj?.userData?.isPlaceholder) {
        //@ts-ignore
        obj.material.transparent = true
        //@ts-ignore
        obj.material.opacity = 0
        const label = ObjectFactory.createCss2dObject(creatInfoLabel())
        label.position.set(0, 0, 0)
        infoLabels.push(label)
        modelMonitor.addObject(label, obj)

        let detailLabel: CSS2DObject
        if (obj.userData.devName.startsWith('点位')) {
            detailLabel = ObjectFactory.createCss2dObject(createPointLabel())
            detailLabel.position.set(0, 0, 0)
            modelMonitor.addObject(detailLabel, obj)
            detailLabels.push(detailLabel)
            detailLabel.visible = false
        } else {
            detailLabel = ObjectFactory.createCss2dObject(createDevLabel(null, obj.userData.devName))
            detailLabel.position.set(0, 0, 0)
            modelMonitor.addObject(detailLabel, obj)
            detailLabel.visible = false
            devLabels.push({
                name: obj.userData.devName,
                obj: detailLabel
            })

        }

        label.element.addEventListener('mousemove', () => {
            detailLabel.visible = true
            label.element.style.opacity = '0';
        })
        label.element.addEventListener('mouseleave', () => {
            detailLabel.visible = false
            label.element.style.opacity = '1';
        })
    }
})
modelMonitor.addObject(placeHolderSubScene.scene)

modelMonitor.hoverHandler = (hitArr) => {
    const userDataArr = hitArr.map(item => item.object?.userData)
        .filter(userData => userData.isPlaceholder)
    const firstObjectName = userDataArr[0] && userDataArr[0].devName


    for (const {name, obj} of devLabels) {
        obj.visible = (name === firstObjectName)
    }

}
const upDate = (val: number) => {
    infoLabels.forEach(label => {
        label.element.innerHTML = `<div class="info">
                         <div class="value"><strong>${val}</strong>℃</div>
                        </div>`
    })
    detailLabels.forEach(label => {
        label.element.innerHTML = createPointLabel(val, val).innerHTML
    })
    devLabels.forEach(({name, obj}) => {
        obj.element.innerHTML = createDevLabel(val, name).innerHTML
    })
}
setInterval(() => {
    upDate(Math.floor(Math.random() * 100))
}, 1000)
