import React from "react";
import { render, App } from "proton-native"; // import the proton-native components
import Main from "./container/Main";

const options = {
  title: "Razer Chroma Audio Visualizer!",
  size: {
    w: 300,
    h: 300
  },
  menuBar: false
};

const AudioVizualizer = () => (
  <App>
    <Main {...options} />
  </App>
);

render(<AudioVizualizer />);
