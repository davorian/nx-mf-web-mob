import { Repack } from '@callstack/repack';
import { zephyrDisabled, withZephyr } from 'zephyr-rspack-plugin';
import { getSharedDependencies } from './getSharedDependencies';

export default (env) => {
  const {
    mode = 'development',
    context = __dirname,
    entry = './src/index.js',
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
  } = env;

  if (!platform) {
    throw new Error('Missing platform');
  }

  process.env.BABEL_ENV = mode;

  const isHost = process.env.app_type == "host";
  const remoteUrl = isHost ? '' : `http://localhost:${process.env.remote_port}/${platform}`;
  const defaultRemotes = isHost ? {} : {};

  const config = {
    mode,
    context,
    entry,
    devtool: mode === 'development' ? 'source-map' : false,
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      path: `${context}/build/${platform}`,
      filename: bundleFilename || '[name].bundle',
      chunkFilename: '[name].chunk.bundle',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath,
        },
      }),
      new Repack.plugins.ModuleFederationPluginV2({
        name: process.env.app_name,
        filename: `${process.env.app_name}.container.js.bundle`,
        exposes: {
          '.': './App',
        },
        remotes: isHost ? defaultRemotes : {},
        remoteType: isHost ? undefined : 'script',
        get getRemoteEntry() {
          if (!isHost) {
            return `fetch("${remoteUrl}/mf-manifest.json").then(res => res.json()).then(manifest => manifest.url)`;
          }
          return;
        },
        dts: false,
        shared: getSharedDependencies({eager:true}, require('./package.json')),
      }),
      new Repack.IgnorePlugin({
        resourceRegExp: /^@react-native-masked-view/,
      }),
    ],
  };

  return zephyrDisabled ? config : withZephyr(config);
};
