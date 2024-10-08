export default () => {
	const treatLabelsTicks = (arrayValues: Array<number | string | Date>, tickCount: number) => {
		let ticksLabels: Array<number | string | Date> = []
		if (typeof arrayValues[0] === 'string') {
			const tickLabelLength = Math.ceil(arrayValues.length / (tickCount !== 0 ? tickCount : arrayValues.length))
			let i = 0
			arrayValues.forEach((value, index) => {
				if (index === 0) ticksLabels.push(value)
				if (tickLabelLength === i) {
					ticksLabels.push(value)
					i = 1
				} else i++
			})
		}

		if (typeof arrayValues[0] === 'number') {
			let min = roundToNearest(Math.min(...(arrayValues as number[])))
			let max = roundToNearest(Math.max(...(arrayValues as number[])))

			if (min >= 0 && max >= 0) min = 0
			if (min < 0 && max >= 0)
				if (Math.abs(min) > max) max = Math.abs(min)
				else min = max * -1
			if (min < 0 && max < 0) max = 0

			const range = max - min

			if (tickCount === 1) {
				ticksLabels = [min]
			} else if (tickCount === 2) {
				ticksLabels = [min, max]
			} else {
				const step = range / (tickCount - 1)
				const innerRange = []
				for (let i = 1; i <= tickCount; i++) {
					innerRange.push(Math.ceil(min + (i * step) / 10) * 10)
				}
				ticksLabels = [min, ...innerRange, max]
			}
		}
		return ticksLabels
	}

	const getMinMaxValues = (arrayValues: Array<number | string | Date>) => {
		let min = roundToNearest(Math.min(...(arrayValues as number[])))
		const minNotZero = roundToNearest(Math.min(...(arrayValues as number[])))
		let max = roundToNearest(Math.max(...(arrayValues as number[])))
		const maxNotZero = roundToNearest(Math.max(...(arrayValues as number[])))

		if (min >= 0 && max >= 0) min = 0
		if (min < 0 && max >= 0)
			if (Math.abs(min) > max) max = Math.abs(min)
			else min = max * -1
		if (min < 0 && max < 0) max = 0

		const middle = (max - min) / 2
		return { min, middle, max, minNotZero, maxNotZero }
	}

	const roundToNearest = (value: number) => {
		const isNegative = value < 0
		const absolute = Math.abs(value)
		const magnitude = Math.pow(10, Math.floor(Math.log10(absolute)))
		const normalized = absolute / magnitude
		let rounded: number

		for (let i = 0.5; i <= 10; i += 0.5) {
			if (normalized >= i && normalized < i + 0.5) rounded = i + 0.5
		}
		return isNegative ? -1 * rounded * magnitude : rounded * magnitude
	}
	return { treatLabelsTicks, roundToNearest, getMinMaxValues }
}
