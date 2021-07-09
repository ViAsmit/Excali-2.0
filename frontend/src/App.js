import React, { useEffect, useRef } from "react";
import Excalidraw, { exportToBlob } from "@excalidraw/excalidraw";
import InitialData from "./initialData";
import axios from "axios";

import "./styles.scss";
import initialData from "./initialData";

export default function App() {
  const excalidrawRef = useRef(null);
  // const [msg, setmsg] = useState("");

  useEffect(() => {
    setInterval(() => {
      console.log("Logs every second");
      getImage();
    }, 10000);

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
      // clearInterval(interval);
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
    // setBlobUrl(window.URL.createObjectURL(blob));
    // setmsg(
    //   "Image Uploaded Successfully. Visit https://excali-demo.herokuapp.com/files/ to see all saved photos"
    // );
    var formData = new FormData();
    formData.append("file", blob);
    axios
      .post("https://excali-demo.herokuapp.com/upload", formData, {
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
      <a href="/files">Click to view saved states</a>
      <br />
      <b>Important:-</b> To Download any image locally. Go to{" "}
      <b>/files/:filename </b> to download on your computer
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
        />
      </div>
      <div className="export-wrapper button-wrapper">
        <button onClick={getImage}>Save Now!</button>
        <p>Automatic Saving is 10 sec</p>
        <div className="export export-svg"></div>
      </div>
    </div>
  );
}
