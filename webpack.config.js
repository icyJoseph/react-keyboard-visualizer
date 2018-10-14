const path = require("path");

module.exports = {
  entry: {
    main: "./src/index.js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },

  output: {
    path: path.join(__dirname, "build"),
    filename: "index.js"
  },

  target: "node",
  mode: "production",
  externals: {
    "libui-node": "commonjs libui-node"
  }
};
