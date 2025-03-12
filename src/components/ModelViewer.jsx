import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Grid } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import {
  Mesh,
  MeshStandardMaterial,
  Box3,
  Vector3,
  Color,
  DirectionalLight,
} from "three";
import {
  Lightbulb,
  Palette,
  Maximize2,
  Minimize2,
  Grid as GridIcon,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Repeat,
  Eye,
} from "lucide-react";

function Model({ model, color, wireframe }) {
  if (model) {
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new MeshStandardMaterial({
          color: new Color(color),
          metalness: 0.5,
          roughness: 0.4,
          wireframe: wireframe,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }
  return <primitive object={model} />;
}

export default function ModelViewer({
  modelUrl,
  fileName = "",
  isFullScreen = false,
  onExitFullScreen = () => {},
}) {
  const [model, setModel] = useState(null);
  const [color, setColor] = useState("#ffffff");
  const [showGrid, setShowGrid] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(1.5);

  const containerRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (modelUrl) {
      loadModelFromURL(modelUrl);
    }
  }, [modelUrl]);

  const loadModelFromURL = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const buffer = await response.arrayBuffer();
      const fileExtension = fileName.split(".").pop().toLowerCase();
      let loadedModel;

      if (fileExtension === "stl") {
        const geometry = new STLLoader().parse(buffer);
        loadedModel = new Mesh(geometry);
      } else if (fileExtension === "obj") {
        const text = new TextDecoder().decode(buffer);
        loadedModel = new OBJLoader().parse(text);
      }

      if (loadedModel) {
        setModel(loadedModel);
        fitModelToView();
      }
    } catch (error) {
      console.error("Error loading model:", error);
      alert("Error loading model. Please try a different file.");
    }
  };

  const resetCamera = () => {
    controlsRef.current?.reset();
  };

  const zoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2);
      controlsRef.current.update();
    }
  };

  const zoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2);
      controlsRef.current.update();
    }
  };

  const fitModelToView = () => {
    if (controlsRef.current && model) {
      const box = new Box3().setFromObject(model);
      const size = box.getSize(new Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = controlsRef.current.object.fov * (Math.PI / 180);
      let cameraZ = maxDim / 2 / Math.tan(fov / 2);
      cameraZ *= 1.5; // Add some padding
      controlsRef.current.object.position.z = cameraZ;
      controlsRef.current.update();
    }
  };
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
      onExitFullScreen();
    }
  };
  const directionalLight = useMemo(() => {
    return new DirectionalLight("#ffffff", lightIntensity);
  }, [lightIntensity]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex flex-col rounded-lg overflow-hidden border border-gray-200 bg-white ${
        isFullScreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Controls */}
      <div className="absolute top-28 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
          title="Toggle Fullscreen"
        >
          {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
        <button
          onClick={() => setShowGrid(!showGrid)}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <GridIcon size={20} />
        </button>
        <button
          onClick={resetCamera}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={zoomIn}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={zoomOut}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <Repeat size={20} />
        </button>
        <button
          onClick={() => setWireframe(!wireframe)}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <Eye size={20} />
        </button>
        <button
          onClick={() => setLightIntensity(lightIntensity === 1.5 ? 2.5 : 1.5)}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <Lightbulb size={20} />
        </button>
        <div className="relative w-10 h-10">
          <input
            type="color"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />

          <div
            className="w-10 h-10 rounded-full border shadow flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <Palette size={20} className="text-gray-700" />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 relative">
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <primitive object={directionalLight} position={[3, 5, 3]} />
          <Stage environment="city" intensity={0.4}>
            {model && (
              <Model model={model} color={color} wireframe={wireframe} />
            )}
          </Stage>
          {showGrid && <Grid args={[10, 10]} cellSize={0.5} infiniteGrid />}
          <OrbitControls
            ref={controlsRef}
            autoRotate={autoRotate}
            enablePan
            enableZoom
          />
        </Canvas>
      </div>
    </div>
  );
}
