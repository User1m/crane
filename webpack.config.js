module.exports = {
  target: "node",
  entry: "./index.js",
  output: {
    path: __dirname,
    filename: "bundle.js",
    library: "",
    libraryTarget: "commonjs-module"
  },
  node: {
    __dirname: false,
    __filename: false
  }
};
