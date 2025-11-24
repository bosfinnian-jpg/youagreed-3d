import * as THREE from 'three'
import Time from './Utils/Time.js'
import Sizes from './Utils/Sizes.js'
import Resources from './Resources.js'
import Camera from './Camera.js'

// Import only what we need from World
import Car from './World/Car.js'
import Floor from './World/Floor.js'
import Physics from './World/Physics.js'
import Controls from './World/Controls.js'

export default class SimpleApplication {
    constructor(_options) {
        this.$canvas = _options.$canvas

        // Set up utilities
        this.time = new Time()
        this.sizes = new Sizes()
        this.resources = new Resources()

        this.setConfig()
        this.setRenderer()
        this.setCamera()
        this.setWorld()

        // Start animation
        this.time.on('tick', () => {
            this.renderer.render(this.scene, this.camera.instance)
        })
    }

    setConfig() {
        this.config = {}
        this.config.debug = window.location.hash === '#debug'
        this.config.touch = false
    }

    setRenderer() {
        // Scene
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x87ceeb)

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.$canvas,
            antialias: true
        })
        this.renderer.shadowMap.enabled = true
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)

        // Resize event
        this.sizes.on('resize', () => {
            this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
        })
    }

    setCamera() {
        this.camera = new Camera({
            time: this.time,
            sizes: this.sizes,
            renderer: this.renderer,
            config: this.config
        })

        this.scene.add(this.camera.container)

        // Make camera follow car
        this.time.on('tick', () => {
            if (this.car && this.car.chassis) {
                this.camera.target.x = this.car.chassis.object.position.x
                this.camera.target.y = this.car.chassis.object.position.y
            }
        })
    }

    setWorld() {
        this.container = new THREE.Object3D()
        this.scene.add(this.container)

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        this.container.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(50, 50, 50)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.width = 2048
        directionalLight.shadow.mapSize.height = 2048
        this.container.add(directionalLight)

        // Physics
        this.physics = new Physics({
            config: this.config,
            time: this.time
        })

        // Floor
        this.floor = new Floor({
            time: this.time,
            physics: this.physics
        })
        this.container.add(this.floor.container)

        // Controls
        this.controls = new Controls({
            config: this.config,
            time: this.time,
            sizes: this.sizes,
            camera: this.camera
        })

        // Car
        this.car = new Car({
            time: this.time,
            resources: this.resources,
            physics: this.physics,
            shadows: null,
            config: this.config,
            sounds: null,
            renderer: this.renderer,
            camera: this.camera,
            controls: this.controls
        })
        this.container.add(this.car.container)
    }
}