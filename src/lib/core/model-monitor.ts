import {
    Camera,
    EquirectangularReflectionMapping, Intersection,
    Object3D,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Vector2,
    WebGLRenderer
} from 'three';
import {OrbitControls, CSS2DRenderer} from 'three/addons';
import {Texture} from 'three/src/textures/Texture.d.ts';


class ModelMonitor {
    private readonly _scene: Scene;
    private readonly _camera: PerspectiveCamera;
    private readonly _renderer: WebGLRenderer;
    private readonly _css2dRenderer: CSS2DRenderer;
    private readonly _controls: OrbitControls;
    public startAnimation: () => void;
    _hoverHandler: null | ((Objects: Intersection[]) => any) = () => {
    };

    constructor(width: number, height: number) {
        this._scene = ModelMonitorInitUtils.createScene();
        this._camera = ModelMonitorInitUtils.createCamera(width, height);
        this._renderer = ModelMonitorInitUtils.createRenderer(width, height);
        this._css2dRenderer = ModelMonitorInitUtils.createCss2dRenderer(width, height);
        this._controls = ModelMonitorInitUtils.createControls(this.camera, this.css2dRenderer.domElement);

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
        // this.css2dRenderer.domElement.addEventListener('click', mouseFn);

    }

    //====================public====================
    public setEnvMap(envMap: Texture) {
        this.scene.environment = envMap;
        (this.scene.environment as Texture).mapping = EquirectangularReflectionMapping;
    }

    public addObject(object: Object3D, parentObj?: Object3D) {
        parentObj = parentObj || this.scene;

        if (Array.isArray(object)) {
            parentObj.add(...object)
        } else {
            parentObj.add(object)
        }
    }

    public onResize(width: number, height: number) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.css2dRenderer.setSize(width, height);
    }

    //====================private====================
    private renderFrame() {
        this.renderer.render(this.scene, this.camera);
        this.css2dRenderer.render(this.scene, this.camera);
    }

    private hoverFn(e: MouseEvent) {

        if (!this.hoverHandler) return;

        e.preventDefault();
        const width = this.css2dRenderer.domElement.clientWidth;
        const height = this.css2dRenderer.domElement.clientHeight;

        const rayCaster = new Raycaster();
        const mouse = new Vector2();

        const x = e.clientX - this.css2dRenderer.domElement.getBoundingClientRect().left;
        const y = e.clientY - this.css2dRenderer.domElement.getBoundingClientRect().top;

        mouse.x = (x / width) * 2 - 1;
        mouse.y = -(y / height) * 2 + 1;

        rayCaster.setFromCamera(mouse, this.camera);
        const intersects = rayCaster.intersectObjects(this.scene.children, true);

        this.hoverHandler(intersects)
    }

    //====================getter====================
    public get controls() {
        return this._controls;
    }

    public get renderer() {
        return this._renderer;
    }

    get camera(): PerspectiveCamera {
        return this._camera;
    }

    get css2dRenderer() {
        return this._css2dRenderer;
    }

    get scene(): Scene {
        return this._scene;
    }

//====================setter====================
    public set hoverHandler(fn: null | ((Objects: Intersection[]) => any)) {
        this._hoverHandler = fn;
    }

    public get hoverHandler() {
        return this._hoverHandler;
    }

}

const ModelMonitorInitUtils = {
    createScene: () => {
        return new Scene();
    },
    createCamera: (width: number, height: number) => {
        const camera = new PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(30, 30, 30);
        camera.lookAt(0, 0, 0);
        return camera;
    },
    createRenderer: (width: number, height: number) => {
        const renderer = new WebGLRenderer({
            antialias: true, alpha: true
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.zIndex = '1';
        return renderer;
    },
    createControls: (camera: Camera, domElement: HTMLElement) => {
        const controls = new OrbitControls(camera, domElement)
        controls.target.set(0, 0, 0);
        return controls;
    },
    createCss2dRenderer: (width: number, height: number) => {
        const renderer = new CSS2DRenderer();
        renderer.setSize(width, height);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.zIndex = '2';
        return renderer;
    }
} as const;
export {
    ModelMonitor
}