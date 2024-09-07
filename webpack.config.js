const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const NodeJSPolyfill = require("./plugin");
const { readFileSync } = require("node:fs");
const { Overlay } = require("react-hydration-overlay");

// Path to the polyfill JavaScript file
const polyfillCodePath = path.join(__dirname, "./polyfill.js");
// Read the contents of the polyfill JavaScript file
const polyfillCode = readFileSync(polyfillCodePath, { encoding: "utf-8" });

module.exports = (configOptions) => {
  const {
    isLocal, // Flag indicating if the environment is local (development) or not
    isHMREnabled, // Flag indicating if Hot Module Replacement (HMR) is enabled
    context, // Base directory for resolving paths
    assetNormalizedBasePath, // Base path for assets in production (CDN or other)
    imageCDNNormalizedBasePath, // Base path for images when using a CDN
    localImageBasePath, // Base path for local images in development
    localFontsBasePath, // Base path for local fonts in development
  } = configOptions;

  return {
    entry: {
      // Entry point for the theme bundle
      themeBundle: [path.resolve(context, "theme/index.jsx")],
    },
    resolve: {
      // Resolve file extensions
      extensions: ["", ".js", ".jsx", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          // Rule to handle TypeScript (.ts, .tsx) files
          test: /\.(ts|tsx)$/, // Matches TypeScript files (.ts and .tsx)
          exclude: /node_modules/, // Excludes node_modules to improve performance
          use: [
            {
              loader: "babel-loader", // Uses Babel to transpile TypeScript code
              options: {
                presets: [
                  [
                    "@babel/preset-env", // Transpiles JavaScript based on target environments (browsers, etc.)
                    {
                      targets: "defaults", // Default target browsers/environments
                    },
                  ],
                  "@babel/preset-react", // Transpiles JSX syntax for React
                  "@babel/preset-typescript", // Transpiles TypeScript to JavaScript
                ],
                plugins: [
                  ...(isLocal && isHMREnabled
                    ? [require.resolve("react-refresh/babel")] // Enables hot module replacement (HMR) for React components in development
                    : []),
                ],
              },
            },
          ],
        },
        {
          // Rule to handle JavaScript (.js, .jsx) files in the "theme" folder
          test: /\.(jsx|js)$/, // Matches JavaScript and JSX files (.js and .jsx)
          include: path.resolve(context, "theme"), // Only applies to files in the "theme" directory
          exclude: /node_modules/, // Excludes node_modules for better performance
          use: [
            {
              loader: "babel-loader", // Uses Babel to transpile JavaScript/JSX
              options: {
                presets: [
                  [
                    "@babel/preset-env", // Transpiles modern JavaScript based on target environments
                    {
                      targets: "defaults", // Default target browsers/environments
                    },
                  ],
                  "@babel/preset-react", // Transpiles JSX syntax for React
                ],
                plugins: [
                  ...(isLocal && isHMREnabled
                    ? [require.resolve("react-refresh/babel")] // Enables React HMR in development
                    : []),
                ],
              },
            },
          ],
        },
        {
          // Rule to handle regular CSS files (excluding .global.css)
          test: /\.css$/i, // Matches CSS files
          use: [
            MiniCssExtractPlugin.loader, // Extracts CSS into separate files
            {
              loader: "css-loader", // Loads and interprets CSS files
              options: {
                modules: false, // Disables CSS modules for regular CSS files
              },
            },
          ],
          exclude: /\.global\.css$/, // Excludes global CSS files (handled by the next rule)
        },
        {
          // Rule to handle global CSS files
          test: /\.css$/i, // Matches CSS files
          use: [
            MiniCssExtractPlugin.loader, // Extracts CSS into separate files
            {
              loader: "css-loader", // Loads and interprets CSS files
              options: {
                modules: false, // Disables CSS modules for global CSS files
              },
            },
          ],
          include: /\.global\.css$/, // Only includes global CSS files
        },
        {
          // Rule to handle global Less files
          test: /\.less$/i, // Matches Less files (.less)
          use: [
            MiniCssExtractPlugin.loader, // Extracts CSS from Less files
            {
              loader: "css-loader", // Loads and interprets CSS from Less files
              options: {
                modules: false, // Disables CSS modules for global Less files
              },
            },
            "less-loader", // Compiles Less to CSS
          ],
          include: /\.global\.less$/, // Only includes global Less files
        },
        {
          // Rule to handle Less files with CSS modules
          test: /\.less$/i, // Matches Less files
          use: [
            MiniCssExtractPlugin.loader, // Extracts CSS from Less files
            {
              loader: "css-loader", // Loads and interprets CSS from Less files
              options: {
                modules: {
                  localIdentName: isLocal
                    ? "[path][name]__[local]--[hash:base64:5]" // Names classes for easier debugging in development
                    : "[hash:base64:5]", // Shorter hashed class names in production
                },
              },
            },
            "less-loader", // Compiles Less to CSS
          ],
          exclude: /\.global\.less$/, // Excludes global Less files
        },
        {
          // Rule to handle image files
          test: /\.(png|jpg|jpeg|gif)$/i, // Matches image files
          type: "asset/resource", // Uses Webpack's asset/resource type to handle these files
          generator: {
            publicPath: isLocal
              ? localImageBasePath // Uses local image path in development
              : imageCDNNormalizedBasePath, // Uses CDN image path in production
            outputPath: "assets/images/", // Outputs images to the assets/images/ folder
          },
        },
        {
          // Rule to handle font files
          test: /\.(ttf|otf|woff|woff2)$/i, // Matches font files
          type: "asset/resource", // Uses Webpack's asset/resource type to handle these files
          generator: {
            publicPath: isLocal ? localFontsBasePath : assetNormalizedBasePath, // Adjusts path for local or CDN use
            outputPath: "assets/fonts/", // Outputs fonts to the assets/fonts/ folder
          },
        },
        {
          // Rule to handle SVG files
          test: /\.svg$/, // Matches SVG files
          use: ["@svgr/webpack"], // Uses svgr to convert SVG files into React components
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isLocal ? "[name].css" : "[name].[contenthash].css", // Generate different filenames based on environment
      }),
      new NodeJSPolyfill({
        snippet: polyfillCode, // Include polyfill code for Node.js compatibility
      }),
      ...(isLocal
        ? [
            new Overlay({
              querySelector: "div#app", // Apply hydration overlay in development mode
            }),
          ]
        : []),
    ],
    optimization: {
      minimizer: [`...`, new CssMinimizerPlugin()], // Use CssMinimizerPlugin for CSS minimization
    },
  };
};
