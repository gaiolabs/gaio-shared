<template>
	<div
		id="g-animated-background"
		class="relative w-screen h-screen overflow-hidden bg-[#faf8f0] dark:bg-[#141414]"
	>
		<svg
			v-if="!isDark"
			ref="svgRef"
			width="1440"
			height="1024"
			viewBox="0 0 1440 1024"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="opacity-60"
		>
			<!-- Light SVG content with improved IDs and no clipping -->
			<g>
				<!-- Circle Group 1 -->
				<g
					filter="url(#blurFilter1)"
					opacity="0.6"
				>
					<ellipse
						id="ellipse1"
						cx="1209.5"
						cy="80"
						rx="436.5"
						ry="439"
						fill="#CAE383"
					/>
				</g>
				<!-- Circle Group 2 -->
				<g
					filter="url(#blurFilter2)"
					opacity="0.4"
				>
					<circle
						id="circle1"
						cx="665"
						cy="1033"
						r="431"
						fill="#CAE383"
					/>
				</g>
				<!-- Circle Group 3 -->
				<g
					filter="url(#blurFilter3)"
					opacity="0.4"
				>
					<circle
						id="circle2"
						cx="985"
						cy="348"
						r="578"
						fill="#CAE383"
					/>
				</g>
				<!-- Circle Group 4 -->
				<g
					filter="url(#blurFilter4)"
					opacity="0.6"
				>
					<circle
						id="circle3"
						cx="994.5"
						cy="915.5"
						r="643.5"
						fill="#E3AC83"
					/>
				</g>
			</g>
			<defs>
				<!-- Adjusted filter regions to prevent cropping -->
				<filter
					id="blurFilter1"
					x="-200%"
					y="-200%"
					width="400%"
					height="400%"
					color-interpolation-filters="sRGB"
				>
					<feGaussianBlur
						in="SourceGraphic"
						stdDeviation="150"
					/>
				</filter>
				<filter
					id="blurFilter2"
					x="-200%"
					y="-200%"
					width="400%"
					height="400%"
					color-interpolation-filters="sRGB"
				>
					<feGaussianBlur
						in="SourceGraphic"
						stdDeviation="150"
					/>
				</filter>
				<filter
					id="blurFilter3"
					x="-200%"
					y="-200%"
					width="400%"
					height="400%"
					color-interpolation-filters="sRGB"
				>
					<feGaussianBlur
						in="SourceGraphic"
						stdDeviation="150"
					/>
				</filter>
				<filter
					id="blurFilter4"
					x="-200%"
					y="-200%"
					width="400%"
					height="400%"
					color-interpolation-filters="sRGB"
				>
					<feGaussianBlur
						in="SourceGraphic"
						stdDeviation="150"
					/>
				</filter>
			</defs>
		</svg>

		<svg
			v-else
			ref="svgRef"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 1440 1024"
		>
			<!-- Dark SVG content with improved IDs and adjusted filters -->
			<g>
				<!-- Background -->
				<rect
					width="1440"
					height="1024"
					fill="#141414"
				/>

				<!-- Circle Group 1 -->
				<g filter="url(#blurFilter1)">
					<circle
						id="circle1"
						cx="665"
						cy="1033"
						r="431"
						fill="#19A76B"
						fill-opacity="0.22"
					/>
				</g>

				<!-- Ellipse Group -->
				<g filter="url(#blurFilter2)">
					<ellipse
						id="ellipse1"
						cx="1209.5"
						cy="80"
						rx="436.5"
						ry="439"
						fill="#211E1B"
					/>
				</g>

				<!-- Circle Group 2 -->
				<g filter="url(#blurFilter3)">
					<circle
						id="circle2"
						cx="985"
						cy="348"
						r="578"
						fill="#0B0439"
						fill-opacity="0.22"
					/>
				</g>

				<!-- Circle Group 3 -->
				<g filter="url(#blurFilter4)">
					<circle
						id="circle3"
						cx="994.5"
						cy="915.5"
						r="643.5"
						fill="#0A153C"
						fill-opacity="0.22"
					/>
				</g>
			</g>

			<defs>
				<!-- Adjusted filters to prevent cropping -->
				<filter
					id="blurFilter1"
					x="-200%"
					y="-200%"
					width="400%"
					height="400%"
					color-interpolation-filters="sRGB"
				>
					<feGaussianBlur
						in="SourceGraphic"
						stdDeviation="250"
					/>
				</filter>

				<filter
					id="blurFilter2"
					x="-200%"
					y="-200%"
					width="400%"
					height="400%"
					color-interpolation-filters="sRGB"
				>
					<feGaussianBlur
						in="SourceGraphic"
						stdDeviation="75"
					/>
				</filter>

				<filter
					id="blurFilter3"
					x="-200%"
					y="-200%"
					width="400%"
					height="400%"
					color-interpolation-filters="sRGB"
				>
					<feGaussianBlur
						in="SourceGraphic"
						stdDeviation="250"
					/>
				</filter>

				<filter
					id="blurFilter4"
					x="-200%"
					y="-200%"
					width="400%"
					height="400%"
					color-interpolation-filters="sRGB"
				>
					<feGaussianBlur
						in="SourceGraphic"
						stdDeviation="250"
					/>
				</filter>
			</defs>
		</svg>
	</div>
</template>

<script setup>
import { useDark, useMouse } from '@vueuse/core'
import { ref, onMounted, watchEffect } from 'vue'

const isDark = useDark()
const svgRef = ref(null)
const circles = ref([])

// Mouse position reactive variables
const { x: mouseX, y: mouseY } = useMouse()

const animateCircles = () => {
	circles.value.forEach((circle) => {
		// Random movement logic
		const radius = parseFloat(circle.getAttribute('r')) || parseFloat(circle.getAttribute('rx')) || 0
		const diameter = radius * 2
		const randomX = (Math.random() - 0.5) * diameter
		const randomY = (Math.random() - 0.5) * diameter

		// Get current position
		const cxAttr = circle.getAttribute('cx')
		const cyAttr = circle.getAttribute('cy')
		const cx = parseFloat(cxAttr) || 0
		const cy = parseFloat(cyAttr) || 0

		// Update positions
		let newCx = cx + randomX
		let newCy = cy + randomY

		// Optional: Boundary checks to keep circles within view
		const variation = 1.25 // 10%
		const minX = -radius * variation
		const maxX = (1440 + radius) * variation
		const minY = -radius * variation
		const maxY = (1024 + radius) * variation

		if (newCx < minX) newCx = minX
		if (newCx > maxX) newCx = maxX
		if (newCy < minY) newCy = minY
		if (newCy > maxY) newCy = maxY

		circle.setAttribute('cx', newCx)
		circle.setAttribute('cy', newCy)
	})

	requestAnimationFrame(animateCircles)
}

onMounted(() => {
	// Select circles in the SVG
	watchEffect(() => {
		if (svgRef.value) {
			// Query all circles with a specific class or attribute
			circles.value = svgRef.value.querySelectorAll('circle, ellipse')
			// Start animation
			animateCircles()
		}
	})
})
</script>

<style scoped>
svg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

circle,
ellipse {
	transition: all 0.3s ease-in-out;
}
</style>
