import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function Thingy() {
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color="red" />
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
