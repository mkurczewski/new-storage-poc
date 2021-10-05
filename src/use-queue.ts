import { useEffect, useState } from "react"
import { singletonHook } from "react-singleton-hook"
import { moveTask, renameTask, worker, WorkerEvent } from "./api"

type ActionType =
  | "rename"
  | "move"
  | "delete"
  | "download"
  | "upload"
  | "pin"
  | "share"
  | "createDir"

export interface FileMetadata {
  path: string
  name: string
  directory?: true
}

interface Action {
  id: string
  type: ActionType
  previousMetadata: FileMetadata
  newMetadata: FileMetadata
}

interface UseQueue {
  addToQueue: (action: Action) => void
  setProgress: (progress: number) => void
  progress?: number
  currentAction?: Action
  actions?: Action[]
}

const useQueueHook = (): UseQueue => {
  const [actions, setActions] = useState<Action[]>([])
  const [currentAction, setCurrentAction] = useState<Action>()
  const [currentActionProgress, setCurrentActionProgress] = useState<number>()

  const addToQueue = (action: Action) => {
    setActions((prevState) => [...prevState, action])
  }

  const updateActions = (currentAction: Action) => {
    let updateFunction = (action: Action) => action

    switch (currentAction.type) {
      case "rename":
        updateFunction = (action: Action) => {
          if (
            currentAction.previousMetadata.path ===
              action.previousMetadata.path &&
            currentAction.previousMetadata.name &&
            action.previousMetadata.name
          ) {
            return {
              ...action,
              previousMetadata: {
                ...action.previousMetadata,
                name: currentAction.newMetadata.name,
              },
            }
          } else {
            return action
          }
        }
        break
      case "move":
        updateFunction = (action: Action) => {
          if (
            currentAction.previousMetadata.path ===
              action.previousMetadata.path &&
            currentAction.previousMetadata.name &&
            action.previousMetadata.name
          ) {
            return {
              ...action,
              previousMetadata: {
                ...action.previousMetadata,
                path: currentAction.newMetadata.path,
              },
            }
          } else {
            return action
          }
        }
        break
    }

    setActions(([currentAction, ...prevState]) => [
      currentAction,
      ...prevState.map(updateFunction),
    ])
  }

  useEffect(() => {
    if (actions.length > 0 && !currentAction) {
      setCurrentAction(actions[0])
    }
  }, [actions, currentAction])

  useEffect(() => {
    if (currentAction) {
      switch (currentAction.type) {
        case "rename":
          renameTask(currentAction.previousMetadata, currentAction.newMetadata)
          break
        case "move":
          moveTask(currentAction.previousMetadata, currentAction.newMetadata)
          break
      }
    }
  }, [currentAction])

  useEffect(() => {
    if (currentActionProgress === 100) {
      currentAction && updateActions(currentAction)

      setTimeout(() => {
        setActions(([_, ...prevState]) => prevState)
        setCurrentAction(undefined)
        setCurrentActionProgress(undefined)
      }, 300)
    }
  }, [currentActionProgress])

  useEffect(() => {
    worker.addEventListener("message", (event) => {
      const { type, progress } = event.data as WorkerEvent

      switch (type) {
        case "progress":
          setCurrentActionProgress(progress)
          break
        case "finish":
          setCurrentActionProgress(100)
          break
      }
    })
  }, [])

  return {
    addToQueue,
    setProgress: setCurrentActionProgress,
    progress: currentActionProgress,
    currentAction,
    actions,
  }
}

export const useQueue = singletonHook(
  {
    addToQueue: (action) => {},
    setProgress: (progress) => {},
  },
  useQueueHook
)
