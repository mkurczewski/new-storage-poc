import { FileMetadata } from "./use-queue"

interface WorkerProgressEvent {
  id: string
  type: "progress"
  progress: number
  response: undefined
}

interface WorkerFinishEvent {
  id: string
  type: "finish"
  progress: 100
  response: object
}

export type WorkerEvent = WorkerProgressEvent | WorkerFinishEvent

export const worker = new Worker("/peergos.worker.js")

export const renameTask = (
  previousMetadata: FileMetadata,
  newMetadata: FileMetadata
) => {
  worker.postMessage({
    action: "rename",
    params: {
      file: previousMetadata,
      newName: newMetadata.name,
    },
  })
}

export const moveTask = (
  previousMetadata: FileMetadata,
  newMetadata: FileMetadata
) => {
  worker.postMessage({
    action: "move",
    params: {
      file: previousMetadata,
      newPath: newMetadata.path,
    },
  })
}
