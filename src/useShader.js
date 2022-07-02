import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { compileShader } from "shadenfreude";

export function useShader(ctor, deps) {
  const [shader, update] = useMemo(() => compileShader(ctor()), deps);

  useFrame((_, dt) => update(dt));

  return shader;
}
