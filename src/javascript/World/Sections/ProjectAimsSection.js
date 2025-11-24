import * as THREE from 'three'
import { Text } from 'troika-three-text'
import gsap from 'gsap'

export default class ProjectAimsSection
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
        // Floor panel with slightly darker tone for visual distinction
        const panelGeometry = new THREE.PlaneGeometry(20, 14)
        const panelMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xf5f5f5,
            transparent: true,
            opacity: 0.95
        })
        this.floorPanel = new THREE.Mesh(panelGeometry, panelMaterial)
        this.floorPanel.position.set(this.x, 0.01, this.y)
        this.floorPanel.rotation.x = -Math.PI / 2
        this.container.add(this.floorPanel)

        // Border
        const borderGeometry = new THREE.PlaneGeometry(20.2, 14.2)
        const borderMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x2a2a2a,
            transparent: true,
            opacity: 0.4
        })
        const border = new THREE.Mesh(borderGeometry, borderMaterial)
        border.position.set(this.x, 0.005, this.y)
        border.rotation.x = -Math.PI / 2
        this.container.add(border)

        // Accent corner markers - critical design aesthetic
        this.createCornerMarker(-9.5, -6.5)
        this.createCornerMarker(9.5, -6.5)
        this.createCornerMarker(-9.5, 6.5)
        this.createCornerMarker(9.5, 6.5)
    }

    createCornerMarker(offsetX, offsetZ)
    {
        const markerGeometry = new THREE.PlaneGeometry(0.8, 0.8)
        const markerMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x1a1a1a,
            transparent: true,
            opacity: 0.6
        })
        const marker = new THREE.Mesh(markerGeometry, markerMaterial)
        marker.position.set(this.x + offsetX, 0.015, this.y + offsetZ)
        marker.rotation.x = -Math.PI / 2
        this.container.add(marker)
    }

    setText()
    {
        // Title - ADD TO CONTAINER FIRST
        this.titleText = new Text()
        this.container.add(this.titleText)
        this.titleText.text = 'PROJECT AIMS'
        this.titleText.fontSize = 1.6
        this.titleText.position.set(this.x, 0.05, this.y - 5.5)
        this.titleText.rotation.set(-Math.PI / 2, 0, 0)
        this.titleText.color = 0x1a1a1a
        this.titleText.anchorX = 'center'
        this.titleText.anchorY = 'middle'
        this.titleText.fontWeight = 'bold'
        this.titleText.letterSpacing = 0.1
        this.titleText.sync()

        // Section label
        this.labelText = new Text()
        this.container.add(this.labelText)
        this.labelText.text = 'RESEARCH OBJECTIVES & METHODOLOGY'
        this.labelText.fontSize = 0.35
        this.labelText.position.set(this.x, 0.05, this.y - 4.2)
        this.labelText.rotation.set(-Math.PI / 2, 0, 0)
        this.labelText.color = 0x666666
        this.labelText.anchorX = 'center'
        this.labelText.anchorY = 'middle'
        this.labelText.letterSpacing = 0.05
        this.labelText.sync()

        // Main divider
        const lineGeometry = new THREE.PlaneGeometry(16, 0.04)
        const lineMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x1a1a1a, 
            opacity: 0.3, 
            transparent: true 
        })
        const line = new THREE.Mesh(lineGeometry, lineMaterial)
        line.position.set(this.x, 0.015, this.y - 3.2)
        line.rotation.x = -Math.PI / 2
        this.container.add(line)

        // Description - aims overview
        this.bodyText = new Text()
        this.container.add(this.bodyText)
        this.bodyText.text = `Interrogating surveillance capitalism through participatory
critical design. Making invisible data extraction visible
through interactive experience.

This section details:
→ Primary research questions and hypotheses
→ Theoretical framework and literature review
→ Methodology and design approach
→ Expected outcomes and contributions
→ Evaluation criteria and success metrics`
        
        this.bodyText.fontSize = 0.38
        this.bodyText.position.set(this.x, 0.05, this.y - 0.5)
        this.bodyText.rotation.set(-Math.PI / 2, 0, 0)
        this.bodyText.color = 0x2a2a2a
        this.bodyText.anchorX = 'center'
        this.bodyText.anchorY = 'middle'
        this.bodyText.maxWidth = 15
        this.bodyText.textAlign = 'center'
        this.bodyText.lineHeight = 1.7
        this.bodyText.sync()

        // Critical framing quote
        this.quoteText = new Text()
        this.container.add(this.quoteText)
        this.quoteText.text = '"Making consent visible, interrogating power structures"'
        this.quoteText.fontSize = 0.42
        this.quoteText.position.set(this.x, 0.05, this.y + 3.5)
        this.quoteText.rotation.set(-Math.PI / 2, 0, 0)
        this.quoteText.color = 0x1a1a1a
        this.quoteText.anchorX = 'center'
        this.quoteText.anchorY = 'middle'
        this.quoteText.fontStyle = 'italic'
        this.quoteText.maxWidth = 14
        this.quoteText.sync()

        // CTA
        this.ctaText = new Text()
        this.container.add(this.ctaText)
        this.ctaText.text = 'ENTER TO READ MORE'
        this.ctaText.fontSize = 0.38
        this.ctaText.position.set(this.x, 0.05, this.y + 5.2)
        this.ctaText.rotation.set(-Math.PI / 2, 0, 0)
        this.ctaText.color = 0x1a1a1a
        this.ctaText.anchorX = 'center'
        this.ctaText.anchorY = 'middle'
        this.ctaText.fontWeight = 'bold'
        this.ctaText.letterSpacing = 0.08
        this.ctaText.sync()

        // Subtle pulse animation
        this.time.on('tick', () => {
            const scale = 1 + Math.sin(this.time.elapsed * 0.0018) * 0.04
            this.ctaText.fontSize = 0.38 * scale
            this.ctaText.sync()
        })
    }

    setInteractionArea()
    {
        // Clickable area
        this.area = this.areas.add({
            position: new THREE.Vector2(this.x, this.y),
            halfExtents: new THREE.Vector2(9, 6),
            hasKey: false,
            testCar: true,
            active: false
        })

        this.area.on('interact', () => {
            // Link functionality to be added
            console.log('Project Aims clicked - link will be added')
        })
    }

    setZone()
    {
        // Zone for camera transition
        const zone = this.zones.add({
            position: { x: this.x, y: this.y },
            halfExtents: { x: 14, y: 14 },
            data: { cameraAngle: 'projects' }
        })

        zone.on('in', (_data) =>
        {
            this.camera.angle.set(_data.cameraAngle)
            
            if(this.passes && this.passes.horizontalBlurPass && this.passes.verticalBlurPass)
            {
                gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, { x: 0, duration: 2 })
                gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, { y: 0, duration: 2 })
            }

            this.area.activate()

            // Staggered fade-in
            gsap.from(this.titleText.material, { opacity: 0, duration: 0.8 })
            gsap.from(this.labelText.material, { opacity: 0, duration: 0.8, delay: 0.1 })
            gsap.from(this.bodyText.material, { opacity: 0, duration: 0.8, delay: 0.2 })
            gsap.from(this.quoteText.material, { opacity: 0, duration: 0.8, delay: 0.3 })
            gsap.from(this.ctaText.material, { opacity: 0, duration: 0.8, delay: 0.4 })
        })

        zone.on('out', () =>
        {
            this.camera.angle.set('default')
            
            if(this.passes && this.passes.horizontalBlurPass && this.passes.verticalBlurPass)
            {
                gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, 
                    { x: this.passes.horizontalBlurPass.strength, duration: 2 })
                gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, 
                    { y: this.passes.verticalBlurPass.strength, duration: 2 })
            }

            this.area.deactivate()
        })
    }
}