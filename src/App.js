import  { useEffect, useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemash from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from "./utils/util";
const App = () => {
  const webCamRef = useRef(null);
  const canvasRef = useRef(null);

  const runFacemash = async () => {

    const net = await facemash.load(
      facemash.SupportedPackages.mediapipeFacemesh
    );
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof webCamRef.current !== "undefined" &&
      webCamRef.current !== null &&
      webCamRef.current.video.readyState === 4
    ) {
      //get video properties
      const video = webCamRef.current.video;
      const videoWidth = webCamRef.current.video.videoWidth;
      const videoHeight = webCamRef.current.video.videoHeight;

      //set video width
      webCamRef.current.video.width = videoWidth;
      webCamRef.current.video.height = videoHeight;

      //set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      //detection
      const face = await net.estimateFaces({ input: video });
      
      // ctx get from canvas
      const ctx = canvasRef.current.getContext('2d');
      requestAnimationFrame(() => {
        drawMesh(face,ctx)
      });
    }
  };

  useEffect(() => {
    runFacemash();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webCamRef} className="webcam" /> 
      <canvas ref={canvasRef} className="canvas" />
      </header>
    </div>
  );
};

export default App;
