module.exports = {
  target: "node",
  entry: "./dist/index.js",
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
