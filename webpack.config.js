const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "none",
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  externals: [nodeExternals()],
  context: path.resolve(__dirname, "src"),
  entry: ".",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'awesome-typescript-loader',
          options: {
            configFileName: 'tsconfig.webpack.json'
          }
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[local]_[hash:base64:5]"
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "lib"),
    libraryTarget: 'umd'
  }
};