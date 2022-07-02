import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  ColorNode,
  CustomShaderMaterialMasterNode,
  Factory,
  FresnelNode,
  GeometryPositionNode,
  MixNode,
  MultiplyNode,
  vec3,
} from "shadenfreude";
import { Color, LinearEncoding, MeshStandardMaterial } from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import { MoveWithTime, ScaleWithTime, SqueezeWithTime } from "./nodes";
import { PostProcessing } from "./PostProcessing";
import { useShader } from "./useShader";

export const AnimationStack = Factory(() => ({
  name: "Animation Stack",
  in: {
    origin: vec3(GeometryPositionNode()),
  },
  out: {
    value: vec3("in_origin"),
  },
  filters: [
    SqueezeWithTime({ frequency: 0.8 }),
    ScaleWithTime("x")({ frequency: 0.2 }),
    ScaleWithTime("y")({ frequency: 0.2 }),
    ScaleWithTime("z")({ frequency: 0.1 }),
    MoveWithTime("x")({ frequency: 0.8, amplitude: 0.8 }),
    MoveWithTime("y")({ frequency: 0.6, amplitude: 0.5 }),
    MoveWithTime("z")({ frequency: 0.3, amplitude: 0.8 }),
  ],
}));

export const ColorStack = Factory(() => ({
  name: "Color Stack",
  in: {
    color: vec3(ColorNode({ value: new Color("hotpink") })),
  },
  out: {
    value: vec3("in_color"),
  },
  filters: [
    MixNode({
      b: MultiplyNode({
        a: new Color(1, 1, 1),
        b: FresnelNode(),
      }),
      amount: 0.5,
    }),
  ],
}));

function Thingy() {
  const shader = useShader(() =>
    CustomShaderMaterialMasterNode({
      position: AnimationStack(),
      diffuseColor: ColorStack(),
    })
  );

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <CustomShaderMaterial baseMaterial={MeshStandardMaterial} {...shader} />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas
      flat
      gl={{
        outputEncoding: LinearEncoding,
        powerPreference: "high-performance",
        alpha: false,
        depth: false,
        stencil: false,
      }}
    >
      <color args={["#445566"]} attach="background" />
      <fog args={["#445566", 32, 128]} attach="fog" />
      <ambientLight intensity={0.5} />
      <directionalLight intensity={0.5} position={[10, 10, 10]} />
      <directionalLight intensity={0.5} position={[-10, 10, 10]} />
      <OrbitControls maxPolarAngle={Math.PI / 2} makeDefault />
      <PerspectiveCamera position={[0, 0, 20]} makeDefault />
      <PostProcessing />

      <mesh position-y={-55}>
        <cylinderGeometry args={[10, 15, 100, 64]} />
        <meshStandardMaterial color="#888" metalness={0.5} roughness={0.7} />
      </mesh>

      <Thingy />
    </Canvas>
  );
}
