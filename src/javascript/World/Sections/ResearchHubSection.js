import * as THREE from 'three'
import { Text } from 'troika-three-text'
import gsap from 'gsap'

export default class ResearchHubSection
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
        this.setInteractionArea()
        this.setZone()
    }

    setFloorPanel()
    {
        // Large white floor panel - project card style
        const panelGeometry = new THREE.PlaneGeometry(18, 12)
        const panelMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.95
        })
        this.floorPanel = new THREE.Mesh(panelGeometry, panelMaterial)
        this.floorPanel.position.set(this.x, 0.01, this.y)
        this.floorPanel.rotation.x = -Math.PI / 2
        this.container.add(this.floorPanel)

        // Subtle border for definition
        const borderGeometry = new THREE.PlaneGeometry(18.2, 12.2)
        const borderMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x1a1a1a,
            transparent: true,
            opacity: 0.3
        })
        const border = new THREE.Mesh(borderGeometry, borderMaterial)
        border.position.set(this.x, 0.005, this.y)
        border.rotation.x = -Math.PI / 2
        this.container.add(border)
    }

    setText()
    {
        // Title - ADD TO CONTAINER FIRST
        this.titleText = new Text()
        this.container.add(this.titleText)
        this.titleText.text = 'RESEARCH HUB'
        this.titleText.fontSize = 1.5
        this.titleText.position.set(this.x, 0.05, this.y - 4.5)
        this.titleText.rotation.set(-Math.PI / 2, 0, 0)
        this.titleText.color = 0x000000
        this.titleText.anchorX = 'center'
        this.titleText.anchorY = 'middle'
        this.titleText.fontWeight = 'bold'
        this.titleText.letterSpacing = 0.05
        this.titleText.sync()

        // Subtitle
        this.subtitleText = new Text()
        this.container.add(this.subtitleText)
        this.subtitleText.text = 'Digital Media Project / COMM3705'
        this.subtitleText.fontSize = 0.4
        this.subtitleText.position.set(this.x, 0.05, this.y - 3.3)
        this.subtitleText.rotation.set(-Math.PI / 2, 0, 0)
        this.subtitleText.color = 0x666666
        this.subtitleText.anchorX = 'center'
        this.subtitleText.anchorY = 'middle'
        this.subtitleText.sync()

        // Divider line
        const lineGeometry = new THREE.PlaneGeometry(14, 0.03)
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x1a1a1a, opacity: 0.2, transparent: true })
        const line = new THREE.Mesh(lineGeometry, lineMaterial)
        line.position.set(this.x, 0.015, this.y - 2.3)
        line.rotation.x = -Math.PI / 2
        this.container.add(line)

        // Description
        this.bodyText = new Text()
        this.container.add(this.bodyText)
        this.bodyText.text = `Comprehensive research documentation exploring surveillance
capitalism and AI data extraction through critical design.

Access full project documentation including:
• Technical implementation and methodology
• Theoretical framework and ethics review
• Timeline, costs, and resource allocation
• Skills development and learning outcomes`
        
        this.bodyText.fontSize = 0.35
        this.bodyText.position.set(this.x, 0.05, this.y - 0.5)
        this.bodyText.rotation.set(-Math.PI / 2, 0, 0)
        this.bodyText.color = 0x333333
        this.bodyText.anchorX = 'center'
        this.bodyText.anchorY = 'middle'
        this.bodyText.maxWidth = 13
        this.bodyText.textAlign = 'center'
        this.bodyText.lineHeight = 1.6
        this.bodyText.sync()

        // Call to action
        this.ctaText = new Text()
        this.container.add(this.ctaText)
        this.ctaText.text = 'DRIVE CLOSER TO EXPLORE'
        this.ctaText.fontSize = 0.4
        this.ctaText.position.set(this.x, 0.05, this.y + 3.5)
        this.ctaText.rotation.set(-Math.PI / 2, 0, 0)
        this.ctaText.color = 0x1a1a1a
        this.ctaText.anchorX = 'center'
        this.ctaText.anchorY = 'middle'
        this.ctaText.fontWeight = 'bold'
        this.ctaText.letterSpacing = 0.08
        this.ctaText.sync()

        // Add subtle pulsing animation to CTA
        this.time.on('tick', () => {
            const scale = 1 + Math.sin(this.time.elapsed * 0.002) * 0.05
            this.ctaText.fontSize = 0.4 * scale
            this.ctaText.sync()
        })
    }

    setInteractionArea()
    {
        // Clickable area for link interaction (will be activated in future step)
        this.area = this.areas.add({
            position: new THREE.Vector2(this.x, this.y),
            halfExtents: new THREE.Vector2(8, 5),
            hasKey: false,
            testCar: true,
            active: false
        })

        // Will handle click/interaction here when links are added
        this.area.on('interact', () => {
            // Link functionality to be added in next phase
            console.log('Research Hub clicked - link will be added')
        })
    }

    setZone()
    {
        // Zone triggers camera change when approaching
        const zone = this.zones.add({
            position: { x: this.x, y: this.y },
            halfExtents: { x: 12, y: 12 },
            data: { cameraAngle: 'projects' } // Use projects camera angle for birds-eye view
        })

        // Entering zone - switch to birds-eye view
        zone.on('in', (_data) =>
        {
            // Camera transition
            this.camera.angle.set(_data.cameraAngle)
            
            // Reduce blur for clarity
            if(this.passes && this.passes.horizontalBlurPass && this.passes.verticalBlurPass)
            {
                gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, { x: 0, duration: 2 })
                gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, { y: 0, duration: 2 })
            }

            // Activate interaction area
            this.area.activate()

            // Smooth text fade-in
            gsap.from(this.titleText.material, { opacity: 0, duration: 1 })
            gsap.from(this.subtitleText.material, { opacity: 0, duration: 1, delay: 0.1 })
            gsap.from(this.bodyText.material, { opacity: 0, duration: 1, delay: 0.2 })
            gsap.from(this.ctaText.material, { opacity: 0, duration: 1, delay: 0.3 })
        })

        // Leaving zone - return to default view
        zone.on('out', () =>
        {
            // Reset camera
            this.camera.angle.set('default')
            
            // Restore blur
            if(this.passes && this.passes.horizontalBlurPass && this.passes.verticalBlurPass)
            {
                gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, 
                    { x: this.passes.horizontalBlurPass.strength, duration: 2 })
                gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, 
                    { y: this.passes.verticalBlurPass.strength, duration: 2 })
            }

            // Deactivate interaction
            this.area.deactivate()
        })
    }
}