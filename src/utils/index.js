import db from "decibels";
import toColor from "../../../color-spectrum";

// Regular pipe, can take many arguments during the first evaluation
export const pipe = (...fns) => (...args) =>
  fns.reduce(
    (prevResult, fn, index) =>
      index === 0 ? fn(...prevResult) : fn(prevResult),
    args
  );

// preload a function to be mapped over an array
export const map = fn => arr => arr.map(val => fn(val));

// add all values in an array
export const sum = arr => arr.reduce((prev, curr) => prev + curr, 0);

// calculate average of the array
export const average = arr => (arr.length > 0 ? sum(arr) / arr.length : 0);

// scale a whole array
export const scale = k => arr => arr.map(val => k * val);

// break down into commonly used audio bands
// need 6 for the 6 rows of the keyboard
export const segmentInBands = eq => fft => {
  // length of fft is 512
  // from 0 to 22050 Hz
  // each band is 43 Hz

  const eqs = Object.values(eq);
  const totalWeight = sum(eqs);

  const bass = fft.slice(0, 6); // 0 - 258 Hz
  const low = fft.slice(6, 11); // 258 - 516 Hz
  const mid = fft.slice(12, 47); // 516 - 2021 Hz
  const upper = fft.slice(48, 94); // 2021 - 4042 Hz
  const preserve = fft.slice(95, 140); // 4042 - 6020 Hz
  const brillance = fft.slice(141, 512); // 6020 - 20 Khz

  const bands = [bass, low, mid, upper, preserve, brillance];
  const gains = bands.map((band, index) => eqs[index] * average(band));
  const avg = sum(gains) / totalWeight;
  return { gains, avg, bands };
};

const colorGen = ({ red, green, blue }, val) => ({
  red: red * val,
  green: green * val,
  blue: blue * val
});

export const razerKeyBoardArray = k => ({ gains, avg, colors }) => {
  return gains.map((value, row) => {
    const rate = (k * value) / avg;
    return Array.from({ length: 22 }, (_, i) =>
      colorGen(colors[row], Math.round(rate / (i * i + 1)))
    );
  });
};

// copy the buffer as quickly as possible
export const copyAndEmptyInputBuffer = (inputBuffer, workBuffer) => {
  inputBuffer[0].slice(0).map((value, index) => {
    const soft = (value + workBuffer[index]) / 2;
    workBuffer[index] = soft;
    inputBuffer[0][index] = 0;
  });
  return workBuffer;
};

const threshold = limit => val => (val > limit ? val : 0);
const reGain = val => (val === 0 ? 0 : db.toGain(val));

// map values to decibels, filter on noise limit threshold
// and recalculate gains
export const toDb = limit => arr =>
  arr.map(
    pipe(
      db.fromGain,
      threshold(limit),
      reGain
    )
  );

export const withColor = ({ gains, bands, ...rest }) => ({
  gains,
  colors: bands.map(band => toColor(band)),
  ...rest
});
export const withOutNoise = limit => ({ gains, ...rest }) => ({
  gains: toDb(limit)(gains),
  ...rest
});
