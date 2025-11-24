import * as THREE from 'three'
import { Text } from 'troika-three-text'
import gsap from 'gsap'

export default class LiveAnalyserSection
{
    constructor(_options)
    {
        // Options
        this.time = _options.time
        this.resources = _options.resources
        this.camera = _options.camera
        this.passes = _options.passes
        this.zones = _options.zones
        this.areas = _options.areas
        this.x = _options.x
        this.y = _options.y

        // Set up
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false
        this.container.updateMatrix()

        this.setFloorPanel()
        this.setText()
        this.setDecorativeElements()
        this.setInteractionArea()
        this.setZone()
    }

    setFloorPanel()
    {
        // Darker, more dramatic panel for the interactive experience
        const panelGeometry = new THREE.PlaneGeometry(22, 16)
        const panelMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xececec,
            transparent: true,
            opacity: 0.96
        })
        this.floorPanel = new THREE.Mesh(panelGeometry, panelMaterial)
        this.floorPanel.position.set(this.x, 0.01, this.y)
        this.floorPanel.rotation.x = -Math.PI / 2
        this.container.add(this.floorPanel)

        // Double border for emphasis
        const outerBorderGeometry = new THREE.PlaneGeometry(22.3, 16.3)
        const outerBorderMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x1a1a1a,
            transparent: true,
            opacity: 0.5
        })
        const outerBorder = new THREE.Mesh(outerBorderGeometry, outerBorderMaterial)
        outerBorder.position.set(this.x, 0.005, this.y)
        outerBorder.rotation.x = -Math.PI / 2
        this.container.add(outerBorder)

        const innerBorderGeometry = new THREE.PlaneGeometry(21.8, 15.8)
        const innerBorderMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        })
        const innerBorder = new THREE.Mesh(innerBorderGeometry, innerBorderMaterial)
        innerBorder.position.set(this.x, 0.008, this.y)
        innerBorder.rotation.x = -Math.PI / 2
        this.container.add(innerBorder)
    }

    setDecorativeElements()
    {
        // Glitch-style corner elements to emphasize the critical/surveillance theme
        const corners = [
            { x: -10, z: -7, rotation: 0 },
            { x: 10, z: -7, rotation: Math.PI / 2 },
            { x: -10, z: 7, rotation: -Math.PI / 2 },
            { x: 10, z: 7, rotation: Math.PI }
        ]

        corners.forEach(corner => {
            const geometry = new THREE.PlaneGeometry(1.2, 0.1)
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x1a1a1a,
                transparent: true,
                opacity: 0.7
            })
            const line1 = new THREE.Mesh(geometry, material)
            line1.position.set(this.x + corner.x, 0.015, this.y + corner.z)
            line1.rotation.x = -Math.PI / 2
            line1.rotation.z = corner.rotation
            this.container.add(line1)

            const line2 = new THREE.Mesh(geometry, material.clone())
            line2.position.set(this.x + corner.x, 0.015, this.y + corner.z)
            line2.rotation.x = -Math.PI / 2
            line2.rotation.z = corner.rotation + Math.PI / 2
            this.container.add(line2)
        })
    }

    setText()
    {
        // Title - ADD TO CONTAINER FIRST
        this.titleText = new Text()
        this.container.add(this.titleText)
        this.titleText.text = 'LIVE ANALYSER'
        this.titleText.fontSize = 1.8
        this.titleText.position.set(this.x, 0.05, this.y - 6)
        this.titleText.rotation.set(-Math.PI / 2, 0, 0)
        this.titleText.color = 0x000000
        this.titleText.anchorX = 'center'
        this.titleText.anchorY = 'middle'
        this.titleText.fontWeight = 'bold'
        this.titleText.letterSpacing = 0.12
        this.titleText.sync()

        // Subtitle with project name
        this.subtitleText = new Text()
        this.container.add(this.subtitleText)
        this.subtitleText.text = 'YOU AGREED — Interactive Installation'
        this.subtitleText.fontSize = 0.45
        this.subtitleText.position.set(this.x, 0.05, this.y - 4.5)
        this.subtitleText.rotation.set(-Math.PI / 2, 0, 0)
        this.subtitleText.color = 0x666666
        this.subtitleText.anchorX = 'center'
        this.subtitleText.anchorY = 'middle'
        this.subtitleText.sync()

        // Heavy divider
        const lineGeometry = new THREE.PlaneGeometry(18, 0.06)
        const lineMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000, 
            opacity: 0.4, 
            transparent: true 
        })
        const line = new THREE.Mesh(lineGeometry, lineMaterial)
        line.position.set(this.x, 0.015, this.y - 3.3)
        line.rotation.x = -Math.PI / 2
        this.container.add(line)

        // Description - experiential focus
        this.bodyText = new Text()
        this.container.add(this.bodyText)
        this.bodyText.text = `Experience the installation firsthand.
Upload your ChatGPT conversations and discover
what's hidden in your data.

The analyzer reveals:
⚠ Privacy exposure through conversation content
⚠ Carbon footprint of your AI interactions  
⚠ Data patterns you've unknowingly shared
⚠ The gap between consent and awareness

This is the live application — the critical intervention
that makes surveillance capitalism visible and visceral.`
        
        this.bodyText.fontSize = 0.36
        this.bodyText.position.set(this.x, 0.05, this.y - 0.2)
        this.bodyText.rotation.set(-Math.PI / 2, 0, 0)
        this.bodyText.color = 0x1a1a1a
        this.bodyText.anchorX = 'center'
        this.bodyText.anchorY = 'middle'
        this.bodyText.maxWidth = 17
        this.bodyText.textAlign = 'center'
        this.bodyText.lineHeight = 1.65
        this.bodyText.sync()

        // Warning text - critical edge
        this.warningText = new Text()
        this.container.add(this.warningText)
        this.warningText.text = '[ By uploading, you consent to public exhibition — Section 19 ]'
        this.warningText.fontSize = 0.3
        this.warningText.position.set(this.x, 0.05, this.y + 4.8)
        this.warningText.rotation.set(-Math.PI / 2, 0, 0)
        this.warningText.color = 0x666666
        this.warningText.anchorX = 'center'
        this.warningText.anchorY = 'middle'
        this.warningText.fontStyle = 'italic'
        this.warningText.sync()

        // Strong CTA
        this.ctaText = new Text()
        this.container.add(this.ctaText)
        this.ctaText.text = '→ LAUNCH EXPERIENCE ←'
        this.ctaText.fontSize = 0.5
        this.ctaText.position.set(this.x, 0.05, this.y + 6.2)
        this.ctaText.rotation.set(-Math.PI / 2, 0, 0)
        this.ctaText.color = 0x000000
        this.ctaText.anchorX = 'center'
        this.ctaText.anchorY = 'middle'
        this.ctaText.fontWeight = 'bold'
        this.ctaText.letterSpacing = 0.1
        this.ctaText.sync()

        // More prominent pulse for the interactive section
        this.time.on('tick', () => {
            const scale = 1 + Math.sin(this.time.elapsed * 0.003) * 0.08
            this.ctaText.fontSize = 0.5 * scale
            this.ctaText.sync()

            // Subtle opacity pulse on warning
            const warningOpacity = 0.6 + Math.sin(this.time.elapsed * 0.002) * 0.3
            this.warningText.color = new THREE.Color().setRGB(
                0.4 * warningOpacity, 
                0.4 * warningOpacity, 
                0.4 * warningOpacity
            )
            this.warningText.sync()
        })
    }

    setInteractionArea()
    {
        // Larger clickable area for prominence
        this.area = this.areas.add({
            position: new THREE.Vector2(this.x, this.y),
            halfExtents: new THREE.Vector2(10, 7),
            hasKey: false,
            testCar: true,
            active: false
        })

        this.area.on('interact', () => {
            // Link to analyzer will be added
            console.log('Live Analyser clicked - link will be added')
        })
    }

    setZone()
    {
        // Larger zone for this key section
        const zone = this.zones.add({
            position: { x: this.x, y: this.y },
            halfExtents: { x: 16, y: 16 },
            data: { cameraAngle: 'projects' }
        })

        zone.on('in', (_data) =>
        {
            this.camera.angle.set(_data.cameraAngle)
            
            if(this.passes && this.passes.horizontalBlurPass && this.passes.verticalBlurPass)
            {
                gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, { x: 0, duration: 2.5 })
                gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, { y: 0, duration: 2.5 })
            }

            this.area.activate()

            // Dramatic entrance
            gsap.from(this.titleText.material, { opacity: 0, duration: 1, ease: 'power2.out' })
            gsap.from(this.subtitleText.material, { opacity: 0, duration: 1, delay: 0.15 })
            gsap.from(this.bodyText.material, { opacity: 0, duration: 1, delay: 0.25 })
            gsap.from(this.warningText.material, { opacity: 0, duration: 1, delay: 0.35 })
            gsap.from(this.ctaText.material, { opacity: 0, duration: 1, delay: 0.45 })
        })

        zone.on('out', () =>
        {
            this.camera.angle.set('default')
            
            if(this.passes && this.passes.horizontalBlurPass && this.passes.verticalBlurPass)
            {
                gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, 
                    { x: this.passes.horizontalBlurPass.strength, duration: 2.5 })
                gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, 
                    { y: this.passes.verticalBlurPass.strength, duration: 2.5 })
            }

            this.area.deactivate()
        })
    }
}