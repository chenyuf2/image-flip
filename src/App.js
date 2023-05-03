import "./App.scss";
import { Canvas } from "@react-three/fiber";
import Scene from "components/Scene/Scene";
import { OrbitControls } from "@react-three/drei";
const App = () => {
  return (
    <Canvas
      linear
      legacy
      dpr={Math.max(window.devicePixelRatio, 2)}
      camera={{ position: [0, 0, 15], fov: 30 }} // previous, it has too strong perspective camera
    >
      <color args={["#122943"]} attach="background" />
      <Scene />
      <OrbitControls />
    </Canvas>
  );
};

export default App;
