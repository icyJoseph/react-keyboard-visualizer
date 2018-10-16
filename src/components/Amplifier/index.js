import React from "react";

import { Slider } from "proton-native";

const Amplifier = ({ value, callback, min = 0, max = 15 }) => (
  <Slider value={value} min={min} max={max} onChange={callback} />
);

export default Amplifier;
