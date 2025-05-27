import path from 'node:path'
import * as Repack from '@callstack/repack';
import { withZephyr } from 'zephyr-repack-plugin';
import { getSharedDependencies } from './getSharedDependencies.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import rspack from '@rspack/core';

const dirname = Repack.getDirname(import.meta.url)

/** @type {(env: import('@callstack/repack').EnvOptions) => import('@rspack/core').Configuration} */
export default (env) => {
// @ts-ignore
  // Read package.json
  const sharedDepsMobile = JSON.parse(
    readFileSync(join(dirname, '../../shared-deps-mob.json'), 'utf8')
  );

  const {
    mode = 'development',
    context = dirname,
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = 'mob_remote1_sourcemap.json',
    assetsPath = undefined,
  } = env;

  /**
   * Using Module Federation might require disabling hmr.
   * Uncomment below to set `devServer.hmr` to `false`.
   *
   * Keep in mind that `devServer` object is not available
   * when running `webpack-bundle` command. Be sure
   * to check its value to avoid accessing undefined value,
   * otherwise an error might occur.
   */
  // if (devServer) {
  //  devServer.hmr = false;
  // }


  if (!platform) {
    throw new Error('Missing platform');
  }

  process.env.BABEL_ENV = mode;

  const zephyrDisabled = true
  const config = {
    mode,
    devtool: mode === 'development' ? 'source-map' : false, // Enable source maps in development
    context,
    entry:{},
    resolve: {
      /**
       * `getResolveOptions` returns additional resolution configuration for React Native.
       * If it's removed, you won't be able to use `<file>.<platform>.<ext>` (eg: `file.ios.js`)
       * convention and some 3rd-party libraries that specify `react-native` field
       * in their `package.json` might not work correctly.
       */
      ...Repack.getResolveOptions(platform),
    },
    output: {
      clean: false,
      hashFunction: 'xxhash64',
      path: path.join(dirname, 'build', 'mob_remote1', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      publicPath: Repack.getPublicPath({ platform, devServer }),
      uniqueName: 'mob_remote1',
    },
    optimization: {
      minimize,
      chunkIds: 'named',
    },
    module: {
      rules: [
        Repack.REACT_NATIVE_LOADING_RULES,
        Repack.NODE_MODULES_LOADING_RULES,
        Repack.FLOW_TYPED_MODULES_LOADING_RULES,
        {
          test: /\.[jt]sx?$/,
          type: 'javascript/auto',
          exclude: [/node_modules/],
          use: {
            loader: 'builtin:swc-loader',
            options: {
              env: {
                targets: { 'react-native': '0.77' },
              },
              jsc: {
                assumptions: {
                  setPublicClassFields: true,
                  privateFieldsAsProperties: true,
                },
                externalHelpers: true,
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          },
        },
        {
          test: Repack.getAssetExtensionsRegExp(Repack.ASSET_EXTENSIONS),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
              inline: true,
            },
          },
        },
      ],
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
        name: 'mob_remote1',
        filename: `mob_remote1.container.js.bundle`,
        exposes: {
          '.': './src/app/App',
        },
        dts: false,
        getPublicPath: `return "http://localhost:8082/${platform}/"`,
        shared: getSharedDependencies({eager:true}, sharedDepsMobile),
      }),
      // silence missing @react-native-masked-view optionally required by @react-navigation/elements
      new rspack.IgnorePlugin({
        resourceRegExp: /^@react-native-masked-view/,
      }),
    ],
  };
  console.log({config});
  return zephyrDisabled ? config : withZephyr(config);
};
