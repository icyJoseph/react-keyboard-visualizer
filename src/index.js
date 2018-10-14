import React, { Component } from "react"; // import from react

import { render, Window, App } from "proton-native"; // import the proton-native components
import toColor from "color-spectrum";
import fft from "fourier-transform/asm";
// import db from "decibels";

import chroma from "../../razer-chroma-js";
import coreAudio from "../../node-core-audio";

import { copyBuffer, pipe, razerKeyBoardArray } from "./utils";

const options = {
  inputChannels: 1,
  outputChannels: 1
};

class AudioVizualizer extends Component {
  componentDidMount() {
    chroma.initialize();
    this.engine = coreAudio.createNewAudioEngine();
    this.engine.setOptions(options);
    this.engine.addAudioCallback(this.processAudio);

    // const thisColor = { red: 255, green: 0, blue: 20 };
    // const thatColor = { red: 255, green: 0, blue: 20 };

    // Go ahead, go add some effects!
    // Keyboard.setBreathing(thisColor, thatColor);
    // this.Keyboard.setBreathingRandom();
    // Keyboard.setReactive(thisColor);
    // Keyboard.setSpectrumCycling();
    // Keyboard.setStarlight(thisColor, thatColor);
    // Keyboard.setWave("leftToRight");
    // Keyboard.setStatic(thisColor);
  }

  processAudio(inputBuffer) {
    pipe(
      copyBuffer,
      fft,
      toColor,
      razerKeyBoardArray,
      arr => {
        const { Keyboard } = chroma;
        return Keyboard.setCustom(arr);
      }
    )(inputBuffer);
    return inputBuffer;
  }

  componentWillUnmount() {
    this.engine = null;
    chroma.terminate();
  }

  render() {
    // all Components must have a render method
    return (
      <App>
        {" "}
        // you must always include App around everything
        <Window
          title="Razer Chroma Audio Visualizer!"
          size={{ w: 300, h: 300 }}
          menuBar={false}
        >
          {/* all your other components go here*/}
        </Window>
      </App>
    );
  }
}

render(<AudioVizualizer />); // and finally render your main component
