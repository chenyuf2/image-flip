import "./App.scss";
import { Canvas } from "@react-three/fiber";
import Scene from "components/Scene/Scene";
import { useMediaQuery } from "react-responsive";
import Mobile from "components/Mobile/Mobile";
import Home from "components/Home/Home";
const App = () => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1224px)" });
  const isLandscape = useMediaQuery({ query: "(orientation: landscape)" });
  return (
    <>
      {isBigScreen && isLandscape ? (
        <>
          <Home />
          <Canvas
            linear
            legacy
            dpr={Math.max(window.devicePixelRatio, 2)}
            camera={{ position: [0, 0, 15], fov: 30 }} // previous, it has too strong perspective camera
          >
            <color args={["#122943"]} attach="background" />
            <Scene />
          </Canvas>
        </>
      ) : (
        <Mobile />
      )}
    </>
  );
};

export default App;
