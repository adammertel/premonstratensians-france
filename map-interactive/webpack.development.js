const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const dotenv = require("dotenv-webpack");

console.log(merge);
module.exports = merge.merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    hot: true,
    contentBase: "./dist",
  },
  plugins: [
    new dotenv({
      path: ".env.development",
      safe: true,
      systemvars: true,
    }),
  ],
});
