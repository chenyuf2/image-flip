import { ShaderMaterial } from "three";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

class ImageShaderMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: `
        varying vec2 vUv;
        uniform float xOffsetV;
        uniform float radiusV;
        uniform float alpha;
        varying float distanceToLine;

        // 点到直线垂足坐标
        vec2 getPerpendicularPointGivenPointAndLine(vec2 point, vec3 line) {
          float A = line.x;
          float B = line.y;
          float C = line.z;
          float x0 = point.x;
          float y0 = point.y;
          return vec2((B * B * x0 - A * B * y0 - A * C) / (A * A + B * B), (-A * B * x0 + A * A * y0 - B * C) / (A * A + B * B));
        }
  
        // 点到直线距离
        float getPerpendicularDistanceBetweenPointAndLine(vec2 point, vec3 line) {
          float A = line.x;
          float B = line.y;
          float C = line.z;
          float x0 = point.x;
          float y0 = point.y;
          return abs((A * x0 + B * y0 + C) / sqrt(A * A + B * B));
        }
  
        // mesh上的点映射到圆柱的坐标
        vec3 meshPointMapToCylinderPos(vec2 point, float radius, vec3 line) {
          float d = getPerpendicularDistanceBetweenPointAndLine(point, line);
          vec2 perpendicularPoint = getPerpendicularPointGivenPointAndLine(point, line);
          float a0 = perpendicularPoint.x;
          float b0 = perpendicularPoint.y;
          float x0 = point.x;
          float y0 = point.y;
          float theta = d / radius;
          return vec3(a0 + (x0 - a0) * radius * sin(theta) / d, b0 + (y0 - b0) * radius * sin(theta) / d, radius * (1. - cos(theta)));
        }
  
        bool isPointEffective(vec2 point, vec3 line) {
          float posX = point.x;
          float posY = point.y;
          float val = line.x * posX + line.y * posY + line.z;
          return val > 0.0;
        }

        void main() {
            vec3 line = vec3(-sin(alpha), cos(alpha), xOffsetV * sin(alpha));
            vec4 point = modelMatrix * vec4(position,1.);
            if (!isPointEffective(position.xy, line)) {
              distanceToLine = 0.;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, 0., 1.);
            } else {
              distanceToLine = getPerpendicularDistanceBetweenPointAndLine(position.xy, line) / (0.58 * 3.1415926);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(meshPointMapToCylinderPos(position.xy, radiusV, line), 1.0);
            }
            vUv = uv;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D imgTexture;
        varying float distanceToLine;
        uniform float progress;
        uniform float progressBack;
        void main() {
            vec4 tex2d=texture2D(imgTexture,vUv);
            if(gl_FrontFacing){
              gl_FragColor=mix(tex2d,mix(tex2d,vec4(vec3(0.),1),.5),sin(progressBack * distanceToLine));
            } else{
              gl_FragColor=mix(tex2d,vec4(mix(vec3(1),mix(vec3(1),vec3(9.,20.,33.)/255.,.45),cos(progressBack * distanceToLine)),1.),.92);
            }
           
        }
      `,
      side: THREE.DoubleSide,
      uniforms: {
        imgTexture: {
          value: null,
        },
        width: {
          value: 0,
        },
        radiusV: {
          value: 0.5,
        },
        xOffsetV: {
          value: 0,
        },
        alpha: {
          value: Math.PI / 2,
        },
        progress: {
          value: 0,
        },
        progressBack: {
          value: 0,
        },
      },
    });
  }

  set imgTexture(value) {
    this.uniforms.imgTexture.value = value;
  }

  get imgTexture() {
    return this.uniforms.imgTexture.value;
  }

  get width() {
    return this.uniforms.width.value;
  }

  set width(value) {
    this.uniforms.width.value = value;
  }

  get radiusV() {
    return this.uniforms.radiusV.value;
  }

  set radiusV(value) {
    this.uniforms.radiusV.value = value;
  }

  get xOffsetV() {
    return this.uniforms.xOffsetV.value;
  }

  set xOffsetV(value) {
    this.uniforms.xOffsetV.value = value;
  }

  get alpha() {
    return this.uniforms.alpha.value;
  }

  set alpha(value) {
    this.uniforms.alpha.value = value;
  }

  get progress() {
    return this.uniforms.progress.value;
  }

  set progress(value) {
    this.uniforms.progress.value = value;
  }

  get progressBack() {
    return this.uniforms.progressBack.value;
  }

  set progressBack(value) {
    this.uniforms.progressBack.value = value;
  }
}

extend({ ImageShaderMaterial });
