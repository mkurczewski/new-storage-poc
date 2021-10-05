/* eslint-disable no-restricted-globals */

const reportProgressOfCurrentTask = (progress = 0) => {
  self.postMessage({ type: "progress", progress })
}

const reportTaskFinish = (action, response) => {
  self.postMessage({ type: "finish", progress: 100, response })
}

// Peergos "rename" action
const renameFile = ({ file, newName }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      reportProgressOfCurrentTask(34)
    }, 1000)

    setTimeout(() => {
      reportProgressOfCurrentTask(76)
    }, 2000)

    setTimeout(() => {
      resolve({ ...file, name: newName })
    }, 3000)
  })
}

// Peergos "move file" action
const moveFile = ({ file, newPath }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      reportProgressOfCurrentTask(34)
    }, 1000)

    setTimeout(() => {
      reportProgressOfCurrentTask(76)
    }, 2000)

    setTimeout(() => {
      resolve({ ...file, path: newPath })
    }, 3000)
  })
}

self.addEventListener("message", async (event) => {
  const { action, params } = event.data

  if (action === "rename") {
    const response = await renameFile(params)
    reportTaskFinish(action, response)
  }

  if (action === "move") {
    const response = await moveFile(params)
    reportTaskFinish(action, response)
  }

  console.log(action, params)
})
