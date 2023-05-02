import "./App.scss";
import { Canvas } from "@react-three/fiber";
import Scene from "components/Scene/Scene";
const App = () => {
  return (
    <Canvas
      dpr={Math.max(window.devicePixelRatio, 2)}
      camera={{ position: [0, 0, 15], fov: 30 }} // previous, it has too strong perspective camera
    >
      <color args={["#122943"]} attach="background" />
      <Scene />
    </Canvas>
  );
};

export default App;
