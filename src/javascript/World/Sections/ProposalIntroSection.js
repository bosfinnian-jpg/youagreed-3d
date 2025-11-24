
import * as THREE from 'three'
import { Text } from 'troika-three-text'
import gsap from 'gsap'

export default class ProposalIntroSection
{
    constructor(_options)
    {
        // Options
        this.time = _options.time
        this.resources = _options.resources
        this.camera = _options.camera
        this.passes = _options.passes
        this.zones = _options.zones
        this.debug = _options.debug
        this.x = _options.x
        this.y = _options.y

        // Set up
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false
        this.container.updateMatrix()

        this.setFloorText()
        this.setZone()
    }

    setFloorText()
    {
        // White floor panel (like projects section)
        const floorGeometry = new THREE.PlaneGeometry(16, 10)
        const floorMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        })
        const floor = new THREE.Mesh(floorGeometry, floorMaterial)
        floor.position.set(this.x, 0.01, this.y - 15) // Slightly above ground
        floor.rotation.x = -Math.PI / 2 // Lay flat
        this.container.add(floor)

        // Title text on floor
        this.titleText = new Text()
        this.titleText.text = 'PROJECT PROPOSAL'
        this.titleText.fontSize = 1.2
        this.titleText.position.set(this.x, 0.02, this.y - 18)
        this.titleText.rotation.x = -Math.PI / 2 // Lay flat on floor
        this.titleText.color = 0x000000
        this.titleText.anchorX = 'center'
        this.titleText.anchorY = 'middle'
        this.titleText.fontWeight = 'bold'
        this.titleText.maxWidth = 14
        this.container.add(this.titleText)
        this.titleText.sync()

        // Divider line
        const lineGeometry = new THREE.PlaneGeometry(12, 0.05)
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x666666 })
        const line = new THREE.Mesh(lineGeometry, lineMaterial)
        line.position.set(this.x, 0.02, this.y - 16.5)
        line.rotation.x = -Math.PI / 2
        this.container.add(line)

        // Subtitle
        this.subtitleText = new Text()
        this.subtitleText.text = 'INTRODUCTION'
        this.subtitleText.fontSize = 0.6
        this.subtitleText.position.set(this.x, 0.02, this.y - 15.5)
        this.subtitleText.rotation.x = -Math.PI / 2
        this.subtitleText.color = 0x666666
        this.subtitleText.anchorX = 'center'
        this.subtitleText.anchorY = 'middle'
        this.subtitleText.maxWidth = 14
        this.container.add(this.subtitleText)
        this.subtitleText.sync()

        // Body text
        this.bodyText = new Text()
        this.bodyText.text = `Driven by Data: An Interactive Exploration of AI Surveillance

This project uses Three.js to create an immersive 3D driving experience
that reveals the extent of data collection by AI platforms.

Drive through your ChatGPT conversation history and discover
what's being tracked about you.`
        
        this.bodyText.fontSize = 0.4
        this.bodyText.position.set(this.x, 0.02, this.y - 13.5)
        this.bodyText.rotation.x = -Math.PI / 2
        this.bodyText.color = 0x333333
        this.bodyText.anchorX = 'center'
        this.bodyText.anchorY = 'middle'
        this.bodyText.maxWidth = 14
        this.bodyText.textAlign = 'center'
        this.bodyText.lineHeight = 1.6
        this.container.add(this.bodyText)
        this.bodyText.sync()

        // Border frame (optional - makes it look more defined)
        const borderGeometry = new THREE.EdgesGeometry(floorGeometry)
        const borderMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc, linewidth: 2 })
        const border = new THREE.LineSegments(borderGeometry, borderMaterial)
        border.position.copy(floor.position)
        border.rotation.copy(floor.rotation)
        this.container.add(border)
    }

    setZone()
    {
        // Create zone with birds-eye camera angle (like projects section)
        const zone = this.zones.add({
            position: { x: this.x, y: this.y - 15 },
            halfExtents: { x: 10, y: 8 },
            data: { cameraAngle: 'projects' } // Use same angle as projects!
        })

        // When entering zone
        zone.on('in', (_data) =>
        {
            // Change to birds-eye view
            this.camera.angle.set(_data.cameraAngle)
            
            // Reduce blur for clarity
            if(this.passes && this.passes.horizontalBlurPass && this.passes.verticalBlurPass)
            {
                gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, { x: 0, duration: 2 })
                gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, { y: 0, duration: 2 })
            }

            // Fade in text
            gsap.from(this.titleText, { opacity: 0, duration: 1 })
            gsap.from(this.bodyText, { opacity: 0, duration: 1, delay: 0.2 })
        })

        // When leaving zone
        zone.on('out', () =>
        {
            // Return to default camera
            this.camera.angle.set('default')
            
            // Restore blur
            if(this.passes && this.passes.horizontalBlurPass && this.passes.verticalBlurPass)
            {
                gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, { x: this.passes.horizontalBlurPass.strength, duration: 2 })
                gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, { y: this.passes.verticalBlurPass.strength, duration: 2 })
            }
        })
    }
}