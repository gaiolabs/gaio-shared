import mitt from 'mitt'

type Events = {
	openTable: string
}

export default mitt<Events>()
