import React, { useEffect, useState, useRef } from "react";
import Excalidraw, { exportToBlob } from "@excalidraw/excalidraw";
import InitialData from "./initialData";
import axios from "axios";

import "./styles.scss";
import initialData from "./initialData";

const renderTopRightUI = () => {
  return (
    <button onClick={() => alert("This is dummy top right UI")}>
      {" "}
      Click me{" "}
    </button>
  );
};

const renderFooter = () => {
  return (
    <button onClick={() => alert("This is dummy footer")}>
      {" "}
      custom footer{" "}
    </button>
  );
};

export default function App() {
  const excalidrawRef = useRef(null);
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Logs every second");
    }, 1000);

    const onHashChange = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const libraryUrl = hash.get("addLibrary");
      if (libraryUrl) {
        excalidrawRef.current.importLibrary(libraryUrl, hash.get("token"));
      }
    };
    window.addEventListener("hashchange", onHashChange, false);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      clearInterval(interval);
    };
  }, []);

  const getImage = async () => {
    const blob = await exportToBlob({
      elements: excalidrawRef.current.getSceneElements(),
      mimeType: "image/png",
      appState: {
        ...initialData.appState,
      },
    });
    setBlobUrl(window.URL.createObjectURL(blob));
    var formData = new FormData();
    formData.append("file", blob);
    axios
      .post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => console.log(res.data))
      .catch((e) => console.log(e));
  };

  return (
    <div className="App">
      <h1> Excalidraw Example</h1>
      <div className="excalidraw-wrapper">
        <Excalidraw
          ref={excalidrawRef}
          initialData={InitialData}
          onChange={(elements, state) =>
            console.log("Elements :", elements, "State : ", state)
          }
          onPointerUpdate={(payload) => console.log(payload)}
          onCollabButtonClick={() =>
            window.alert("You clicked on collab button")
          }
          name="Custom name of drawing"
          UIOptions={{ canvasActions: { loadScene: false } }}
          renderTopRightUI={renderTopRightUI}
          renderFooter={renderFooter}
        />
      </div>

      <div className="export-wrapper button-wrapper">
        <button
          onClick={() => {
            console.log("ddd");
          }}
        >
          Export to Server
        </button>

        <button onClick={getImage}>Export to Blob</button>
        <div className="export export-blob">
          <img src={blobUrl} alt="" />
        </div>
      </div>
    </div>
  );
}
