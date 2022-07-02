import { Factory, float, TimeNode, vec3 } from "shadenfreude";

export const ScaleWithTime = (axis = "xyz") =>
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

export const SqueezeWithTime = Factory(() => ({
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

export const MoveWithTime = (axis = "xyz") =>
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
