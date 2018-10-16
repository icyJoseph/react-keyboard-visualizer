import React, { Component } from "react"; // import from react

import { Window } from "proton-native"; // import the proton-native components
import fft from "fourier-transform/asm";
import Amplifier from "../../components/Amplifier";

import chroma from "../../../../razer-chroma-js";
import coreAudio from "../../../../node-core-audio";

import {
  copyAndEmptyInputBuffer,
  pipe,
  segmentInBands,
  razerKeyBoardArray,
  withColor,
  withOutNoise
} from "../../utils";

const options = {
  inputChannels: 1,
  outputChannels: 1
};

class Main extends Component {
  state = {
    amp: 1,
    buffer: new Float32Array(1024),
    equalizer: {
      bassEq: 1,
      lowEq: 1.5,
      midEq: 1,
      upperEq: 1,
      preserveEq: 2,
      brillanceEq: 4
    },
    limit: -90
  };
  componentDidMount() {
    chroma.initialize();
    this.engine = coreAudio.createNewAudioEngine();
    this.engine.setOptions(options);
    this.engine.addAudioCallback(this.processAudio.bind(this));
  }

  processAudio(inputBuffer) {
    const { amp, buffer, equalizer, limit } = this.state;
    pipe(
      copyAndEmptyInputBuffer,
      fft,
      segmentInBands(equalizer),
      withColor,
      withOutNoise(limit),
      razerKeyBoardArray(amp),
      arr => {
        const { Keyboard } = chroma;
        return Keyboard.setCustom(arr);
      }
    )(inputBuffer, buffer);

    this.setState({ buffer });

    return inputBuffer;
  }

  componentWillUnmount() {
    this.engine.terminate();
    chroma.terminate();
  }

  render() {
    return (
      <Window {...this.props}>
        <Amplifier
          value={this.state.amp}
          callback={amp => this.setState({ amp })}
        />
      </Window>
    );
  }
}

export default Main;
