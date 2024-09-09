type CronFrequency = {
	every?: number
	minuteValues?: number | number[]
	hourValues?: number | number[]
	dayOfMonthValues?: number | number[]
	monthValues?: number | number[]
	dayValues?: number | number[]
}

export const CronNumeral = (value: number | null): string | null => {
	if (value === null) {
		return null
	}

	switch (value) {
		case 1:
			return '1º'
		case 2:
			return '2º'
		case 3:
			return '3º'
		case 21:
			return '21º'
		case 22:
			return '22º'
		case 23:
			return '23º'
		case 31:
			return '31º'
		default:
			return value + 'º'
	}
}

export const CronDayName: { [key: number]: string } = {
	1: 'monday',
	2: 'tuesday',
	3: 'wednesday',
	4: 'thursday',
	5: 'friday',
	6: 'saturday',
	7: 'sunday'
}

export const CronMonthName = (value: number | null): string | null => {
	const months: { [key: number]: string } = {
		1: 'january',
		2: 'february',
		3: 'march',
		4: 'april',
		5: 'may',
		6: 'june',
		7: 'july',
		8: 'august',
		9: 'september',
		10: 'october',
		11: 'november',
		12: 'december'
	}

	if (value !== null && months[value]) {
		return months[value]
	} else {
		return null
	}
}

export const localFrequence = {
	minute: 1,
	hour: 2,
	day: 3,
	week: 4,
	month: 5,
	year: 6
}

export const frequency = [
	{
		value: 1,
		label: 'minute'
	},
	{
		value: 2,
		label: 'hour'
	},
	{
		value: 3,
		label: 'day'
	},
	{
		value: 4,
		label: 'week'
	},
	{
		value: 5,
		label: 'month'
	},
	{
		value: 6,
		label: 'year'
	}
]

export const minuteValues = Array.from({ length: 60 }, (_, i) => i)
export const hourValues = Array.from({ length: 24 }, (_, i) => i)
export const dayOfMonthValues = Array.from({ length: 31 }, (_, i) => i + 1)
export const dayValues = Array.from({ length: 7 }, (_, i) => i + 1)
export const monthValues = Array.from({ length: 12 }, (_, i) => i + 1)

export class CronBaseHelper {
	setCron(n: CronFrequency, cronType = 'default'): string {
		if (n && n.every) {
			n.every = Number(n.every)
		}
		if (cronType === 'quartz') {
			return this.setQuartzCron(n)
		} else {
			return this.setDefaultCron(n)
		}
	}

	setQuartzCron(n: CronFrequency): string {
		const cron = ['0', '*', '*', '*', '*', '?']
		if (n && n.every && n.every >= localFrequence.hour) {
			cron[1] = typeof n.minuteValues !== 'undefined' ? String(n.minuteValues) : '0'
		}

		if (n && n.every && n.every >= localFrequence.day) {
			cron[2] = typeof n.hourValues !== 'undefined' ? String(n.hourValues) : '*'
		}

		if (n && n.every && n.every === localFrequence.week) {
			cron[3] = '?'
			cron[5] = String(n.dayValues)
		}

		if (n && n.every && n.every >= localFrequence.month) {
			cron[3] = typeof n.dayOfMonthValues !== 'undefined' ? String(n.dayOfMonthValues) : '?'
		}

		if (n && n.every && n.every === localFrequence.year) {
			cron[4] = typeof n.monthValues !== 'undefined' ? String(n.monthValues) : '*'
		}

		return cron.join(' ')
	}

	setDefaultCron(n: CronFrequency): string {
		const cron = ['*', '*', '*', '*', '*']

		if (n && n.every && n.every >= localFrequence.hour) {
			cron[0] = typeof n.minuteValues !== 'undefined' ? String(n.minuteValues) : '*'
		}

		if (n && n.every && n.every >= localFrequence.day) {
			cron[1] = typeof n.hourValues !== 'undefined' ? String(n.hourValues) : '*'
		}

		if (n && n.every && n.every === localFrequence.week) {
			cron[4] = String(n.dayValues)
		}

		if (n && n.every && n.every >= localFrequence.month) {
			cron[2] = typeof n.dayOfMonthValues !== 'undefined' ? String(n.dayOfMonthValues) : '*'
		}

		if (n && n.every && n.every === localFrequence.year) {
			cron[3] = typeof n.monthValues !== 'undefined' ? String(n.monthValues) : '*'
		}
		return cron.join(' ')
	}

	fromCron(value: string, allowMultiple = true, cronType = 'default'): CronFrequency {
		if (cronType === 'quartz') {
			return this.fromQuartzCron(value, allowMultiple)
		} else {
			return this.fromDefaultCron(value, allowMultiple)
		}
	}

	fromDefaultCron(value: string, allowMultiple: boolean): CronFrequency {
		const cron = value.replace(/\s+/g, ' ').split(' ')
		const frequency: CronFrequency = {
			every: 1
		} // default: every minute
		let tempArray: number[] = []

		if (cron[0] === '*' && cron[1] === '*' && cron[2] === '*' && cron[3] === '*' && cron[4] === '*') {
			frequency.every = localFrequence.minute // every minute
		} else if (cron[1] === '*' && cron[2] === '*' && cron[3] === '*' && cron[4] === '*') {
			frequency.every = localFrequence.hour // every hour
		} else if (cron[2] === '*' && cron[3] === '*' && cron[4] === '*') {
			frequency.every = localFrequence.day // every day
		} else if (cron[2] === '*' && cron[3] === '*') {
			frequency.every = localFrequence.week // every week
		} else if (cron[3] === '*' && cron[4] === '*') {
			frequency.every = localFrequence.month // every month
		} else if (cron[4] === '*') {
			frequency.every = localFrequence.year // every year
		}

		if (cron[0] !== '*') {
			// preparing to handle multiple minutes
			if (allowMultiple) {
				tempArray = cron[0].split(',').map(Number)
				frequency.minuteValues = tempArray
			} else {
				frequency.minuteValues = Number(cron[0])
			}
		}
		if (cron[1] !== '*') {
			// preparing to handle multiple hours
			if (allowMultiple) {
				tempArray = cron[1].split(',').map(Number)
				frequency.hourValues = tempArray
			} else {
				frequency.hourValues = Number(cron[1])
			}
		}
		if (cron[2] !== '*') {
			// preparing to handle multiple days of the month
			if (allowMultiple) {
				tempArray = cron[2].split(',').map(Number)
				frequency.dayOfMonthValues = tempArray
			} else {
				frequency.dayOfMonthValues = Number(cron[2])
			}
		}
		if (cron[3] !== '*') {
			// preparing to handle multiple months
			if (allowMultiple) {
				tempArray = cron[3].split(',').map(Number)
				frequency.monthValues = tempArray
			} else {
				frequency.monthValues = Number(cron[3])
			}
		}
		if (cron[4] !== '*') {
			// preparing to handle multiple days of the week
			if (allowMultiple) {
				tempArray = cron[4].split(',').map(Number)
				frequency.dayValues = tempArray
			} else {
				frequency.dayValues = Number(cron[4])
			}
		}
		return frequency
	}

	fromQuartzCron(value: string, allowMultiple: boolean): CronFrequency {
		const cron = value.replace(/\s+/g, ' ').split(' ')
		const frequency: CronFrequency = {
			every: 1
		} // default: every minute

		let tempArray: number[] = []

		if (cron[1] === '*' && cron[2] === '*' && cron[3] === '*' && cron[4] === '*' && cron[5] === '?') {
			frequency.every = 1 // every minute
		} else if (cron[2] === '*' && cron[3] === '*' && cron[4] === '*' && cron[5] === '?') {
			frequency.every = 2 // every hour
		} else if (cron[3] === '*' && cron[4] === '*' && cron[5] === '?') {
			frequency.every = 3 // every day
		} else if (cron[3] === '?') {
			frequency.every = 4 // every week
		} else if (cron[4] === '*' && cron[5] === '?') {
			frequency.every = 5 // every month
		} else if (cron[5] === '?') {
			frequency.every = 6 // every year
		}

		if (cron[1] !== '*') {
			// preparing to handle multiple minutes
			if (allowMultiple) {
				tempArray = cron[1].split(',').map(Number)
				frequency.minuteValues = tempArray
			} else {
				frequency.minuteValues = Number(cron[1])
			}
		}
		if (cron[2] !== '*') {
			// preparing to handle multiple hours
			if (allowMultiple) {
				tempArray = cron[2].split(',').map(Number)
				frequency.hourValues = tempArray
			} else {
				frequency.hourValues = Number(cron[2])
			}
		}
		if (cron[3] !== '*' && cron[3] !== '?') {
			// preparing to handle multiple days of the month
			if (allowMultiple) {
				tempArray = cron[3].split(',').map(Number)
				frequency.dayOfMonthValues = tempArray
			} else {
				frequency.dayOfMonthValues = Number(cron[3])
			}
		}
		if (cron[4] !== '*') {
			// preparing to handle multiple months
			if (allowMultiple) {
				tempArray = cron[4].split(',').map(Number)
				frequency.monthValues = tempArray
			} else {
				frequency.monthValues = Number(cron[4])
			}
		}
		if (cron[5] !== '*' && cron[5] !== '?') {
			// preparing to handle multiple days of the week
			if (allowMultiple) {
				tempArray = cron[5].split(',').map(Number)
				frequency.dayValues = tempArray
			} else {
				frequency.dayValues = Number(cron[5])
			}
		}

		return frequency
	}
}
