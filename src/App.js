import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  ColorNode,
  compileShader,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  FresnelNode,
  GeometryPositionNode,
  MixNode,
  MultiplyNode,
  TimeNode,
  vec3,
} from "shadenfreude";
import { Color, MeshStandardMaterial } from "three";
import CustomShaderMaterial from "three-custom-shader-material";

const AnimationStack = Factory(() => ({
  name: "Animation Stack",
  in: {
    origin: vec3(GeometryPositionNode()),
  },
  out: {
    value: vec3("in_origin"),
  },
  filters: [
    SqueezeWithTime({ frequency: 0.1 }),
    ScaleWithTime("x")({ frequency: 0.2 }),
    ScaleWithTime("y")({ frequency: 0.1 }),
    ScaleWithTime("z")({ frequency: 0.3 }),
    MoveWithTime("x")({ frequency: 0.8, amplitude: 2 }),
    MoveWithTime("y")({ frequency: 0.6, amplitude: 1 }),
    MoveWithTime("z")({ frequency: 0.3, amplitude: 2 }),
  ],
}));

const ScaleWithTime = (axis = "xyz") =>
  Factory(() => ({
    name: "Scale with Time",
    in: {
      a: vec3(),
      frequency: float(1),
      time: float(TimeNode()),
    },
    out: {
      value: vec3("in_a"),
    },
    vertex: {
      body: `out_value.${axis} *= (1.0 + sin(in_time * in_frequency) * 0.5);`,
    },
  }));

const SqueezeWithTime = Factory(() => ({
  name: "Squeeze with Time",
  in: {
    a: vec3(),

    frequency: float(1),
    time: float(TimeNode()),
  },
  out: {
    value: vec3("in_a"),
  },
  vertex: {
    body: `out_value.x *= (1.0 + sin(in_time * in_frequency + position.y * 0.3 + position.x * 0.3) * 0.2);`,
  },
}));

const MoveWithTime = (axis = "xyz") =>
  Factory(() => ({
    name: "Move with Time",
    in: {
      a: vec3(),
      frequency: float(1),
      amplitude: float(1),
      time: float(TimeNode()),
    },
    out: {
      value: vec3("in_a"),
    },
    vertex: {
      body: `out_value.${axis} += sin(in_time * in_frequency) * in_amplitude;`,
    },
  }));

const ColorStack = Factory(() => ({
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
        a: new Color(2, 2, 2),
        b: FresnelNode(),
      }),
      amount: 0.5,
    }),
  ],
}));

function useShader() {
  const root = CustomShaderMaterialMasterNode({
    position: AnimationStack(),
    diffuseColor: ColorStack(),
  });

  return compileShader(root);
}

function Thingy() {
  return (
    <mesh>
      <boxGeometry />
      <CustomShaderMaterial baseMaterial={MeshStandardMaterial} />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas>
      <Environment preset="studio" background />
      <OrbitControls />

      <Thingy />
    </Canvas>
  );
}
