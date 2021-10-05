import React from "react"
import logo from "./logo.svg"
import "./App.css"
import { useQueue } from "./use-queue"
import { v4 } from "uuid"
import "react-toastify/dist/ReactToastify.css"

function App() {
  const { addToQueue, progress, currentAction, actions = [] } = useQueue()

  const onRename = () => {
    addToQueue({
      id: v4(),
      type: "rename",
      previousMetadata: {
        name: "img001.jpg",
        path: "/home/photos/",
      },
      newMetadata: {
        name: "image1.jpg",
        path: "/home/photos/",
      },
    })
  }

  const onMove = () => {
    addToQueue({
      id: v4(),
      type: "move",
      previousMetadata: {
        name: "img001.jpg",
        path: "/home/photos/",
      },
      newMetadata: {
        name: "img001.jpg",
        path: "/home/photos/2021/",
      },
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={onRename}>Rename</button>
        <button onClick={onMove}>Move</button>
      </header>
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
        }}
      >
        {actions.map((action, index) => (
          <div
            style={{
              background: "#fff",
              margin: "10px",
              padding: "5px",
              borderRadius: "5px",
              overflow: "hidden",
            }}
            key={action.id}
          >
            <p>
              Performing {action.type} action on <br />
              {action.previousMetadata.path}
              {action.previousMetadata.name}
            </p>
            <div
              style={{
                height: "10px",
                width: "300px",
                background: "#586c80",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              {index === 0 && (
                <div
                  style={{
                    height: "100%",
                    width: `${progress || 0}%`,
                    background: "#2e85ef",
                    transition: "width .3s ease-in-out",
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
