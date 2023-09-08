const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
var path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { dependencies } = require("./package.json");
const webpack = require("webpack");

module.exports = function (config, env) {
  const isProduction = process.env.NODE_ENV || "development";
  config.mode = process.env.NODE_ENV || "development";
  config.output = {
    filename: "bundle.js",
  };
  config.resolve = {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    fallback: {
      https: false,
      stream: false,
    },
  };

  config.module.rules = [
    {
      test: /\.json$/,
      loader: "json-loader",
      type: "javascript/auto",
    },
    {
      test: /\.m?js/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    },
    {
      test: /\.(css|s[ac]ss)$/i,
      use: ["style-loader", "css-loader", "postcss-loader"],
    },
    {
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
      },
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/i, // (1)
      type: "asset/resource",
    },
  ];
  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env": "{}", // This can be an empty object or any configuration you need
    }),
    new ModuleFederationPlugin(
      (module.exports = {
        name: "MessageRemotMFE",
        filename: "remoteEntry.js",
        exposes: {
          "./Messages": "./src/pages/message-page/message-page",
        },
        remotes: {
          // group_mfe: `group_mfe@http://localhost:3001/remoteEntry.js`,
        },
        shared: {
          ...dependencies,
          react: {
            singleton: true,
            requiredVersion: dependencies["react"],
          },
          "react-dom": {
            singleton: true,
            requiredVersion: dependencies["react-dom"],
          },
          "scholarpresent-integration": {
            singleton: true,
            requiredVersion: dependencies["scholarpresent-integration"],
          },
          "aws-amplify": {
            singleton: true,
            requiredVersion: dependencies["aws-amplify"],
          },
        },
      })
    ),
    // new HtmlWebPackPlugin({
    //   template: "./public/index.html",
    //   filename: "popup.html",
    // }),
    new CopyPlugin({
      patterns: [{ from: "src/ServiceWorker.js", to: "service-worker.js" }],
    })
  );
  config.output.publicPath = "auto";
  return config;
};
