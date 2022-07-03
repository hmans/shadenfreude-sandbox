/*

SHADENFREUDE DEMO SANDBOX
~~~~~~~~~~~~~~~~~~~~~~~~~ ~~~ ~~ ~     ~   -

Welcome to the official Shadenfreude sandbox! Just like the library
itself, this thing is still a work in progress. Feel free to play around
with the code, and please do ping me on Twitter if you build
something cool!

- https://twitter.com/hmans

*/

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  ColorNode,
  CustomShaderMaterialMasterNode,
  Factory,
  FresnelNode,
  MixNode,
  MultiplyNode,
  vec3,
  VertexPositionNode,
} from "shadenfreude";
import { Color, LinearEncoding, MeshStandardMaterial } from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import { MoveWithTime, ScaleWithTime, SqueezeWithTime } from "./nodes";
import { PostProcessing } from "./PostProcessing";
import { useShader } from "./useShader";

/*
Shadenfreude is a library for creating custom shaders from a tree of
nodes. These can be simple, or complex! But either way, they're always
just simple JavaScript objects. You can create them directly, or you
can write component-like functions that return them:
*/

const MyFresnel = (color = new Color("white")) =>
  MultiplyNode({
    a: color,
    b: FresnelNode(),
  });

/*
You can build your shaders as a tree of nodes, like you might have done
it in tools like ShaderGraph before -- but Shadenfreude also supports
the concept of "stacks" -- nodes that pass their return value through
a sequence of other nodes before the final value is returned.

This example makes use of two of these stacks: one for transforming
fragment colors, the other for animating vertex positions.
*/

export const AnimationStack = Factory(() => ({
  name: "Animation Stack",
  inputs: {
    origin: vec3(VertexPositionNode()),
  },
  outputs: {
    value: vec3("inputs.origin"),
  },

  /*
  The following filters are a chain of shader nodes, each of which
  transforming the output value of the previous filter, until the final
  result is returned from this node.

  The actual nodes we're using here are defined within this sandbox,
  in the `nodes.js` module. Take a look!
  */

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

/*
Let's do the same thing for color!
*/

export const ColorStack = Factory(() => ({
  name: "Color Stack",
  inputs: {
    color: vec3(),
  },
  outputs: {
    value: vec3("inputs.color"),
  },

  /*
  Filters are just normal shaders nodes, so like other shader nodes,
  they can have their own tree of dependencies. Shadenfreude will
  happily resolve all this into a nice, happy GLSL shader!
  */

  filters: [
    // /*
    // Let's blend the current color with another one. Note how we're
    // not defining an `a` prop here; this is because it will automatically
    // be set to the ColorStack's current output value.
    // */
    MixNode({
      b: MyFresnel(new Color(2, 2, 2)),
      amount: 0.5,
    }),
  ],
}));

/*
Here's our mesh. It's just a simple sphere with a CustomShaderMaterial.
CustomShaderMaterial is the easiest way to inject shaders into Three's
out-of-the-box materials, but of course you can use Shadenfreude with
ShaderMaterial or even RawShaderMaterial!

If you're interested in CustomShaderMaterial, here's the link:
https://www.npmjs.com/package/three-custom-shader-material
*/

function Thingy() {
  /*
  useShader is a little helper that is declared within this sandbox.
  Shadenfreude doesn't know or care about React.
  */
  const shader = useShader(
    () =>
      CustomShaderMaterialMasterNode({
        position: AnimationStack(),
        diffuseColor: ColorStack({
          color: ColorNode({ a: new Color("hotpink") }),
        }),
      }),
    []
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
