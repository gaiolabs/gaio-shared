import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'
import { useAppStore, useAuthStore } from '@/stores'
import type { WorkflowType, TaskType, FlowType, NodeType } from '@gaio/types'
import { getId } from '@gaio/utils'
import useApi from '@/composables/useApi'

type TaskFlowType<T> = {
    task: T & TaskType
    sources?: T[]
    targets?: T[]
}

export default (workflowFromTask: WorkflowType) => {
    const workflow = cloneDeep(workflowFromTask)

    const setPropertyOrder = (obj: NodeType) => {
        const order = ['id', 'type', 'label']

        const orderedObj = {}

        for (let i = 0; i < order.length; i++) {
            if (Object.prototype.hasOwnProperty.call(obj, order[i])) {
                orderedObj[order[i]] = obj[order[i]]
            }
        }

        for (const prop in obj) {
            if (!Object.prototype.hasOwnProperty.call(orderedObj, prop)) {
                orderedObj[prop] = obj[prop]
            }
        }

        return orderedObj as NodeType
    }

    const save = async (updateFlow = 'updateCurrentFlow') => {
        workflow.nodes = workflow.nodes.map((node) => setPropertyOrder(node))

        return await useApi('useFlowSave')
            .post('api/flow/save', {
                body: {
                    flowData: {
                        flowId: useAppStore().flow.flowId,
                        appId: useAppStore().flow.appId,
                        workflow
                    }
                }
            })
            .then((res: FlowType) => {
                if (updateFlow === 'updateCurrentFlow') {
                    useAppStore().flow.workflow = workflow
                    useAppStore().flowList.forEach((flow) => {
                        if (flow.flowId === res.flowId) {
                            flow.workflow = workflow
                        }
                    })
                }
            })
    }

    const compareNode = (node: NodeType, ref: NodeType) => {
        switch (ref.type) {
            case 'table':
                return (
                    node.type === ref.type &&
                    node.tableName === ref.tableName &&
                    node.databaseName === ref.databaseName &&
                    node.sourceType === ref.sourceType
                )
            case 'report':
                return node.type === ref.type && node.tableName === ref.tableName && node.sourceType === ref.sourceType
            case 'reportPreview':
                return node.type === ref.type && node.reportId === ref.reportId
            case 'automlReport':
                return (
                    node.type === ref.type &&
                    node.tableName === ref.tableName &&
                    node.settings.projectName === ref.settings.projectName
                )
            case 'fileImport':
                return node.fileName === ref.fileName
            default:
                return false
        }
    }

    const generate = <T>({ task, sources = [], targets = [] }: TaskFlowType<T>) => {
        const base = { task, sources, targets }

        base.task.id = base.task['temporaryId'] || base.task.id || getId()
        delete base.task['temporaryId'] // when you need some id to check, run, organize and others

        upsetTask(base)
        removeEdges(base)
        setSources(base)
        setTargets(base)

        ensureUniquePositions(workflow.nodes)

        return {
            workflow,
            save
        }
    }

    const ensureUniquePositions = (nodes) => {
        const positions = new Map()

        for (const node of nodes) {
            if (!node.position) {
                node.position = { x: 100, y: 100 }
            }

            const positionKey = `${node.position.x},${node.position.y}`

            if (positions.has(positionKey)) {
                // Position already exists, modify it to ensure minimum distance
                let newY = node.position.y + 65 // Modify the Y coordinate

                // Check if the modified position is also taken
                while (positions.has(`${node.position.x},${newY}`)) {
                    newY += 65 // Increment Y coordinate by minimumDistance
                }

                // Update the node's position
                node.position.y = newY
            }

            // Add the position to the map
            positions.set(positionKey, true)
        }
    }

    const upsetTask = ({ task }) => {
        const findTask = workflow.nodes.findIndex((o) => {
            // if (task.type === 'table') {
            //     const hasTable = o.tableName === task.tableName && o.databaseName === task.databaseName
            //
            //     if (hasTable) {
            //         task.id = o.id
            //     }
            //
            //     return hasTable
            // }
            //
            return task.id === o.id
        })

        task = setPropertyOrder(defineTaskInfo(task))

        if (findTask < 0) {
            task.created = true
            workflow.nodes.push(task)
        } else {
            workflow.nodes[findTask] = task
        }
    }

    const setSources = ({ task, sources }) => {
        // (FROM) SOURCES (TO) TASK
        for (let source of sources) {
            const findNode = workflow.nodes.find((node) => compareNode(node, source))

            source = defineTaskInfo(source)

            if (!findNode) {
                // NODES
                source.id = getId()
                source.created = true
                workflow.nodes.push(source)
                workflow.edges.push({
                    id: getId(),
                    source: source.id,
                    target: task.id
                })
            } else {
                // IF THERE IS A manual EDGE, KEEP IT
                const findEdge = workflow.edges.find((edge) => edge.source === findNode.id && edge.target === task.id)
                if (!findEdge) {
                    // EDGES
                    workflow.edges.push({
                        id: getId(),
                        source: findNode.id,
                        target: task.id
                    })
                }
            }
        }
    }

    const setTargets = ({ task, targets }) => {
        // (FROM) TASK (TO) TARGET
        for (let target of targets) {
            const findNode = workflow.nodes.find((node) => compareNode(node, target))

            target = defineTaskInfo(target)

            if (!findNode) {
                // NODES
                target.id = newId()
                target.created = true

                if (task.type === 'report' || task.type === 'maps') {
                    target.reportId = task.id
                }

                workflow.nodes.push(target)
                workflow.edges.push({
                    id: newId(),
                    source: task.id,
                    target: target.id
                })
            } else {
                findNode.id = findNode.id || newId() // make sure node always have an id

                workflow.nodes = workflow.nodes.map((old) => {
                    if (old.id === findNode.id) {
                        return {
                            ...target,
                            position: findNode.position,
                            grid: findNode.grid,
                            id: old.id // never change
                        }
                    } else {
                        old.id = old.id || newId() // make sure node always have an id
                        return old
                    }
                })

                // IF THERE IS A manual EDGE, KEEP IT
                const findEdge = workflow.edges.find((o) => o.target === findNode.id && o.source === task.id)
                if (!findEdge) {
                    // EDGES
                    workflow.edges.push({
                        id: newId(),
                        source: task.id,
                        target: findNode.id
                    })
                }
            }
        }
    }

    const defineTaskInfo = (task) => {
        const userId = useAuthStore().user.userId

        task.profile = task.profile || {}

        if (!task.profile.createdAt) {
            task.profile.createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
        }

        task.profile.updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')

        if (!task.profile.createdBy) {
            task.profile.createdBy = userId
        }

        task.profile.updatedBy = userId

        return task
    }

    const removeEdges = ({ task }) => {
        workflow.edges = workflow.edges.filter((o) => o.source !== task.id || o.type === 'manual')
        workflow.edges = workflow.edges.filter((o) => o.target !== task.id || o.type === 'manual')
    }

    const newId = () => getId()

    return {
        generate,
        save
    }
}
