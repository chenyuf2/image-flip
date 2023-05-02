import { useTexture } from "@react-three/drei";
import poster from "images/poster.jpg";
import "./ImageShaderMaterial";
import { useFrame, useThree } from "@react-three/fiber";
import { lerp } from "three/src/math/MathUtils";
import { useRef } from "react";
const imageHeight = 4;
const imageWidth = 3.2;
const LERP_PARAMS = {
  cylinderIn: 0.25,
  cylinderOut: 0.0018,
  alpha: 0.12,
  shadowIn: 0.035,
  shadowInBack: 0.25,
  shadowOut: 0.15,
};
const xOffsetV = -0.6;

const Scene = () => {
  const [texture] = useTexture([poster]);
  const { viewport } = useThree();
  const meshRef = useRef();
  const pageStateRef = useRef({
    radius: 100,
    alpha: Math.PI / 2,
    progress: 0,
    progressBack: 0,
  });

  const CYLINDER_RADIUS_MAX = 100;
  const getAlpha = (mouseY) => {
    if (mouseY === 0) return Math.PI / 2;
    const angel = Math.atan(
      (0.4 * mouseY) / (imageWidth / 2 - Math.abs(xOffsetV))
    );
    return mouseY > 0 ? Math.PI / 2 - angel : Math.PI / 2 + Math.abs(angel);
  };
  useFrame(({ pointer }) => {
    let mouseX = (pointer.x * viewport.width) / 2;
    let mouseY = (pointer.y * viewport.height) / 2;
    if (
      mouseX < 0 &&
      mouseX > -imageWidth / 2 &&
      mouseY < imageHeight / 2 &&
      mouseY > -imageHeight / 2
    ) {
      const alphaV = getAlpha(mouseY);
      const A = -Math.sin(alphaV);
      const B = Math.cos(alphaV);
      const C = Math.sin(alphaV) * xOffsetV;
      let x0 = 0;
      let y0 = 0;
      let d = Math.abs(imageWidth / 2) - Math.abs(xOffsetV);
      if (mouseY > 0) {
        x0 = -imageWidth / 2;
        y0 = imageHeight / 2;
        d = Math.abs(A * x0 + B * y0 + C) / Math.sqrt(A ** 2 + B ** 2);
      } else if (mouseY < 0) {
        x0 = -imageWidth / 2;
        y0 = -imageHeight / 2;
        d = Math.abs(A * x0 + B * y0 + C) / Math.sqrt(A ** 2 + B ** 2);
      }

      meshRef.current.material.uniforms.maxDistance.value = Math.max(
        d,
        0.4 * Math.PI
      );

      pageStateRef.current.radius = lerp(
        pageStateRef.current.radius,
        Math.max(d / Math.PI, 0.4),
        LERP_PARAMS.cylinderIn
      );
      pageStateRef.current.progress = lerp(
        pageStateRef.current.progress,
        1,
        LERP_PARAMS.shadowIn
      );
      pageStateRef.current.progressBack = lerp(
        pageStateRef.current.progressBack,
        1,
        LERP_PARAMS.shadowInBack
      );
    } else {
      pageStateRef.current.radius = lerp(
        pageStateRef.current.radius,
        CYLINDER_RADIUS_MAX,
        LERP_PARAMS.cylinderOut
      );
      pageStateRef.current.progress = lerp(
        pageStateRef.current.progress,
        0,
        LERP_PARAMS.shadowOut
      );
      pageStateRef.current.progressBack = lerp(
        pageStateRef.current.progressBack,
        0,
        LERP_PARAMS.cylinderIn
      );
    }

    if (mouseY < imageHeight / 2 && mouseY > -imageHeight / 2) {
      pageStateRef.current.alpha = lerp(
        pageStateRef.current.alpha,
        getAlpha(mouseY),
        LERP_PARAMS.alpha
      );
    }
    meshRef.current.material.uniforms.alpha.value = pageStateRef.current.alpha;
    meshRef.current.material.uniforms.radiusV.value =
      pageStateRef.current.radius;
    meshRef.current.material.uniforms.progress.value =
      pageStateRef.current.progress;
    meshRef.current.material.uniforms.progressBack.value =
      pageStateRef.current.progressBack;
  });
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[imageWidth, imageHeight, 512, 512]} />
      <imageShaderMaterial
        imgTexture={texture}
        radiusV={0.4}
        alpha={Math.PI / 2}
        xOffsetV={xOffsetV}
        progress={0}
        maxDistance={1}
        progressBack={0}
      />
    </mesh>
  );
};

export default Scene;
