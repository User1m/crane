module.exports = {
  target: "node",
  entry: "./dist/api/server.js",
  output: {
    path: __dirname + "/dist/api/",
    filename: "api.js",
    library: "",
    libraryTarget: "commonjs-module"
  },
  module: {
    rules: [
      { test: /rx\.lite\.aggregates\.js/, use: "imports-loader?define=>false" },
      {
        test: /.\/dist\/index.js$/,
        use: "shebang-loader"
      }
    ]
  },
  node: {
    __dirname: false,
    __filename: false
  }
};
