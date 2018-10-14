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

export const scale = k => arr => arr.map(val => k * val);

// break down into commonly used audio bands
// need 6 for the 6 rows of the keyboard
export const segmentInBands = gains => {
  // length is 512
  // from 0 to 22050 Hz
  // each band is 43 Hz
  const bass = average(gains.slice(0, 6));
  const low = average(gains.slice(6, 11));
  const mid = average(gains.slice(12, 47));
  const upper = average(gains.slice(48, 94));
  const preserve = average(gains.slice(95, 140));
  const brillance = average(gains.slice(141, 512));
  return [bass, low, mid, upper, preserve, brillance];
};

export const razerKeyBoardArray = str => {
  const [red, green, blue] = str
    .split("rgb")[1]
    .split("(")[1]
    .split(")")[0]
    .split(",");
  const row = Array.from({ length: 22 }, () => ({
    red: parseInt(red, 10),
    green: parseInt(green, 10),
    blue: parseInt(blue, 10)
  }));
  return Array.from({ length: 6 }, () => row);
};

// copy the buffer as quickly as possible
export const copyBuffer = buffer => {
  const ret = new Float32Array(1024);
  buffer[0].slice(0).map((value, index) => (ret[index] = value));
  return ret;
};
