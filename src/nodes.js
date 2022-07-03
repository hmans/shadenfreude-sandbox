import { Factory, float, TimeNode, vec3 } from "shadenfreude";

export const ScaleWithTime = (axis = "xyz") =>
  Factory(() => ({
    name: "Scale with Time",
    inputs: {
      a: vec3(),
      frequency: float(1),
      time: float(TimeNode()),
    },
    outputs: {
      value: vec3("inputs.a"),
    },
    vertex: {
      body: `outputs.value.${axis} *= (1.0 + sin(inputs.time * inputs.frequency) * 0.5);`,
    },
  }));

export const SqueezeWithTime = Factory(() => ({
  name: "Squeeze with Time",
  inputs: {
    a: vec3(),

    frequency: float(1),
    time: float(TimeNode()),
  },
  outputs: {
    value: vec3("inputs.a"),
  },
  vertex: {
    body: `outputs.value.x *= (1.0 + sin(inputs.time * inputs.frequency + position.y * 0.3 + position.x * 0.3) * 0.2);`,
  },
}));

export const MoveWithTime = (axis = "xyz") =>
  Factory(() => ({
    name: "Move with Time",
    inputs: {
      a: vec3(),
      frequency: float(1),
      amplitude: float(1),
      time: float(TimeNode()),
    },
    outputs: {
      value: vec3("inputs.a"),
    },
    vertex: {
      body: `outputs.value.${axis} += sin(inputs.time * inputs.frequency) * inputs.amplitude;`,
    },
  }));
