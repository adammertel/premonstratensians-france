const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./app/index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: "babel-loader", exclude: /node_modules/ },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000",
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /favicon\.ico$/,
        loader: "url",
        query: {
          limit: 1,
          name: "[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: ["node_modules", "src"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new FaviconsWebpackPlugin("./public/favicon.png"),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
