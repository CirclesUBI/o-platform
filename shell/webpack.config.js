const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const sveltePreprocess = require("svelte-preprocess");
const webpack = require("webpack");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
const prod = !!process.env.IS_PRODUCTION;
const dev = !prod;
const DEBUG = !process.argv.includes("--release");
const VERBOSE = process.argv.includes("--verbose");

const __API_ENDPOINT__ = process.env.API_ENDPOINT;
const __CIRCLES_SUBGRAPH_ENDPOINT__ = process.env.CIRCLES_SUBGRAPH_ENDPOINT;
const __PATHFINDER_ENDPOINT__ = process.env.PATHFINDER_ENDPOINT;
const __CIRCLES_HUB_ADDRESS__ = process.env.CIRCLES_HUB_ADDRESS;
const __SAFE_PROXY_FACTORY_ADDRESS__ = process.env.SAFE_PROXY_FACTORY_ADDRESS;
const __SAFE_ADDRESS__ = process.env.SAFE_ADDRESS;
const __RPC_ENDPOINT__ = process.env.RPC_ENDPOINT;
const __OPENLOGIN_CLIENT_ID__ = process.env.OPENLOGIN_CLIENT_ID;
const __HERE_API_KEY__ = process.env.HERE_API_KEY;
const __PLACES_API_KEY__ = process.env.PLACES_API_KEY;

const __USE_MOCKS__ = process.env.USE_MOCKS ? "true" : "false";
const __SHOW_LANGUAGE_SWITCHER__ = process.env.SHOW_LANGUAGE_SWITCHER ? "true" : "false";

const __ENVIRONMENT__ = process.env.ENVIRONMENT;

require('dotenv').config({ path: `./../.env.${__ENVIRONMENT__}`})

console.log("Config from environment variables:");
console.log("----------------------------------------");
console.log("!: API_ENDPOINT:", process.env.API_ENDPOINT);
console.log("   - The url to the application's graphql api.");
console.log("!: CIRCLES_SUBGRAPH_ENDPOINT:", process.env.CIRCLES_SUBGRAPH_ENDPOINT);
console.log("   - The url to the theGraph's circles subgraph.");
console.log("!: PATHFINDER_ENDPOINT:", process.env.PATHFINDER_ENDPOINT);
console.log("   - The url to the pathfinder2 json-rpc endpoint.");
console.log("!: CIRCLES_HUB_ADDRESS:", process.env.CIRCLES_HUB_ADDRESS);
console.log("   - The address of the deployed CirclesHub contract.");
console.log("!: SAFE_PROXY_FACTORY_ADDRESS:", process.env.SAFE_PROXY_FACTORY_ADDRESS);
console.log("   - The address of the deployed SafeProxyFactory contract.");
console.log("!: SAFE_ADDRESS:", process.env.SAFE_ADDRESS);
console.log("   - The address of the deployed master safe contract.");
console.log("!: RPC_ENDPOINT:", process.env.RPC_ENDPOINT);
console.log("   - The address to an EVM chain's json-rpc endpoint.");
console.log("!: OPENLOGIN_CLIENT_ID:", process.env.OPENLOGIN_CLIENT_ID);
console.log("   - The OpenLogin client-id that's used to generate the user's key.");
console.log("!: HERE_API_KEY:", process.env.HERE_API_KEY);
console.log("   - The api key for the here.com geolocation services.");
console.log("!: PLACES_API_KEY:", process.env.PLACES_API_KEY);
console.log("   - The api key for the google geolocation services.");
console.log("?: IS_PRODUCTION:", prod ? "true" : "false");
console.log("   - Minimizes the bundle when 'true'.");
console.log("?: USE_MOCKS:", __USE_MOCKS__);
console.log("?: SHOW_LANGUAGE_SWITCHER:", __SHOW_LANGUAGE_SWITCHER__);

if (
  !process.env.API_ENDPOINT ||
  !process.env.CIRCLES_SUBGRAPH_ENDPOINT ||
  !process.env.PATHFINDER_ENDPOINT ||
  !process.env.CIRCLES_HUB_ADDRESS ||
  !process.env.SAFE_PROXY_FACTORY_ADDRESS ||
  !process.env.SAFE_ADDRESS ||
  !process.env.RPC_ENDPOINT ||
  !process.env.OPENLOGIN_CLIENT_ID ||
  !process.env.HERE_API_KEY ||
  !process.env.PLACES_API_KEY
) {
  console.log("");
  console.error("Error: All above mandatory (!) environment variables must be set.");
  console.log("");
  process.exit();
}

const sveltePath = path.resolve("node_modules", "svelte");

module.exports = ({
  mode,
  devtool: prod ? false : "inline-cheap-module-source-map",
  entry: {
    bundle: ["./src/main.ts"],
  },
  resolve: {
    alias: {
      svelte: sveltePath,
      src: path.resolve(__dirname, "src"),
      libs: path.resolve(__dirname, "libs"),
      // dapps: path.resolve( __dirname, 'dapps'),
      // libs: path.resolve( __dirname, 'dapps')
    },
    extensions: [".mjs", ".tsx", ".ts", ".js", ".svelte", ".svx"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
    warningsFilter: ["../node_modules/"],
  },
  output: {
    path: __dirname + "/public",
    filename: "bundle.js",
    chunkFilename: "bundle.[id].js",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },

  module: {
    rules: [
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__PLACES_API_KEY__",
          replace: __PLACES_API_KEY__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__HERE_API_KEY__",
          replace: __HERE_API_KEY__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__USE_MOCKS__",
          replace: __USE_MOCKS__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__CIRCLES_HUB_ADDRESS__",
          replace: __CIRCLES_HUB_ADDRESS__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__OPENLOGIN_CLIENT_ID__",
          replace: __OPENLOGIN_CLIENT_ID__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__SAFE_ADDRESS__",
          replace: __SAFE_ADDRESS__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__SAFE_PROXY_FACTORY_ADDRESS__",
          replace: __SAFE_PROXY_FACTORY_ADDRESS__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__PATHFINDER_ENDPOINT__",
          replace: __PATHFINDER_ENDPOINT__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.js|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__CIRCLES_SUBGRAPH_ENDPOINT__",
          replace: __CIRCLES_SUBGRAPH_ENDPOINT__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__API_ENDPOINT__",
          replace: __API_ENDPOINT__,
          flags: "g",
        },
      },
      {
        // https://github.com/sveltejs/svelte-loader/issues/139
        test: /.m?js$/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__RPC_ENDPOINT__",
          replace: __RPC_ENDPOINT__,
          flags: "g",
        },
      },
      {
        test: /\.ts|\.svelte$/,
        loader: "string-replace-loader",
        options: {
          search: "__SHOW_LANGUAGE_SWITCHER__",
          replace: __SHOW_LANGUAGE_SWITCHER__,
          flags: "g",
        },
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: [
          prod ? MiniCssExtractPlugin.loader : "style-loader",
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
        test: /.(svelte|html|svx)$/,
        use: {
          loader: "svelte-loader-hot",
          options: {
            dev,
            hotReload: true,
            hotOptions: {
              // whether to preserve local state (i.e. any `let` variable) or
              // only public props (i.e. `export let ...`)
              noPreserveState: false,
              // optimistic will try to recover from runtime errors happening
              // during component init. This goes funky when your components are
              // not pure enough.
              optimistic: true,

              // See docs of svelte-loader-hot for all available options:
              //
              // https://github.com/rixo/svelte-loader-hot#usage
            },
            // https://github.com/sveltejs/svelte-loader/issues/139
            emitCss: false,
            preprocess: sveltePreprocess({}),
          },
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "bundle.[name].css",
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(mode),
    }),
  ],
  optimization: {
    minimize: prod,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
  devServer: {
    compress: false,
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: process.env.DEPLOY_ENVIRONMENT !== "docker" ? 5000 : 8080,
    host: "localhost",
    open: true,
    client: {
      webSocketURL: process.env.DEPLOY_ENVIRONMENT === "docker" ? "wss://o-platform.localhost/ws" : undefined,
      overlay: {
        errors: true,
        warnings: false, // TODO: REMOVE THIS!!!
      },
    },
  },
});
