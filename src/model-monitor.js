import {EquirectangularReflectionMapping, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer} from 'three';
import {OrbitControls} from 'three/addons';
import {CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

class ModelMonitor {
    scene
    camera
    renderer
    css2dRenderer
    controls
    startAnimation
    hoverHandler = () => {
    }

    constructor(width, height) {

        this.scene = ModelMonitorInitUtils.createScene();
        this.camera = ModelMonitorInitUtils.createCamera(width, height);
        this.renderer = ModelMonitorInitUtils.createRenderer(width, height);
        this.css2dRenderer = ModelMonitorInitUtils.createCss2dRenderer(width, height);
        this.controls = ModelMonitorInitUtils.createControls(this.camera, this.css2dRenderer.domElement);


        const animate = () => {
            requestAnimationFrame(animate);
            this.renderFrame()
        }
        this.startAnimation = animate;

        const mouseFn = this.hoverFn.bind(this);
        this.css2dRenderer.domElement.addEventListener('mouseenter', () => {
            this.css2dRenderer.domElement.addEventListener('mousemove', mouseFn);
        });
        this.css2dRenderer.domElement.addEventListener('mouseleave', () => {
            this.css2dRenderer.domElement.removeEventListener('mousemove', mouseFn);
        })

    }

    setHoverHandler(fn) {
        this.hoverHandler = fn;
    }

    clearHoverHandler() {
        this.hoverHandler = () => {
        }
    }

    setEnvMap(envMap) {
        this.scene.environment = envMap;
        this.scene.environment.mapping = EquirectangularReflectionMapping;
    }

    renderFrame() {
        this.renderer.render(this.scene, this.camera);
        this.css2dRenderer.render(this.scene, this.camera);
    }

    addObject(object, parentObj) {
        parentObj = parentObj || this.scene;

        if (Array.isArray(object)) {
            parentObj.addObject(...object)
        } else {
            parentObj.add(object)
        }
    }

    onResize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.css2dRenderer.setSize(width, height);
    }

    hoverFn(e) {
        e.preventDefault();
        const width = e.target.clientWidth;
        const height = e.target.clientHeight;

        const rayCaster = new Raycaster();
        const mouse = new Vector2();

        mouse.x = (e.offsetX / width) * 2 - 1;
        mouse.y = -(e.offsetY / height) * 2 + 1;
        rayCaster.setFromCamera(mouse, this.camera);
        const intersects = rayCaster.intersectObjects(this.scene.children, true);
        for (const i of intersects) {
            if (i?.object.visible) {
                this.hoverHandler(i.object)
                break
            }
        }
    }
}

const ModelMonitorInitUtils = Object.freeze({
    createScene: () => {
        return new Scene();
    },
    createCamera: (width, height) => {
        const camera = new PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(30, 30, 30);
        camera.lookAt(0, 0, 0);
        return camera;
    },
    createRenderer: (width, height) => {
        const renderer = new WebGLRenderer({
            antialias: true, alpha: true,
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.zIndex = '1';
        return renderer;
    },
    createControls: (camera, domElement) => {
        const controls = new OrbitControls(camera, domElement)
        controls.target.set(0, 0, 0);
        return controls;
    },
    createCss2dRenderer: (width, height) => {
        const renderer = new CSS2DRenderer();
        renderer.setSize(width, height);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.zIndex = '2';
        return renderer;
    },
})

export {
    ModelMonitor,
}