import * as Repack from '@callstack/repack';
import { withZephyr } from 'zephyr-repack-plugin';
import { getSharedDependencies } from './getSharedDependencies.js';
import path from 'node:path';
import { readFileSync } from 'fs';
import { join } from 'path';
import rspack from '@rspack/core';
// import { dirname, join } from 'path';
// import { fileURLToPath } from 'url';
// import rspack from '@rspack/core';
// @ts-ignore
const dirname = Repack.getDirname(import.meta.url)
const zephyrDisabled = true

// /** @type {(env: import('@callstack/repack').EnvOptions) => import('@rspack/core').Configuration} */
export default (env) => {

  const sharedDepsMobile = JSON.parse(
    readFileSync(join(dirname, '../../shared-deps-mob.json'), 'utf8')
  );

  const {
    mode = 'development',
    context = dirname,
    entry = './src/main.ts',
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = 'mob_host_sourcemap.json',
    assetsPath = undefined,
  } = env

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

  process.env.BABEL_ENV = mode

  // const remoteUrl = isHost ? '' : `http://localhost:${process.env.remote_port}/${platform}`;
  const defaultRemotes = {
    "mob_remote1": `mob_remote1@http://localhost:8082/${platform}/mf-manifest.json`,
    "mob_remote2": `mob_remote2@http://localhost:8083/${platform}/mf-manifest.json`,
    "mob_remote3": `mob_remote3@http://localhost:8084/${platform}/mf-manifest.json`,
    // "mfe-food": `mfe-food@http://localhost:8082/${platform}/mf-manifest.json`
  };
  console.log('SHARED', getSharedDependencies({eager:true}, sharedDepsMobile))
  return {
    mode,
    /**
     * This should be always `false`, since the Source Map configuration is done
     * by `SourceMapDevToolPlugin`.
     */
    devtool: false, // Enable source maps in development
    context,
    entry,
    resolve: {
      /**
       * `getResolveOptions` returns additional resolution configuration for React Native.
       * If it's removed, you won't be able to use `<file>.<platform>.<ext>` (eg: `file.ios.js`)
       * convention and some 3rd-party libraries that specify `react-native` field
       * in their `package.json` might not work correctly.
       */
      ...Repack.getResolveOptions(platform),
      /**
       * Uncomment this to ensure all `react-native*` imports will resolve to the same React Native
       * dependency. You might need it when using workspaces/monorepos or unconventional project
       * structure. For simple/typical project you won't need it.
       */
      // alias: {
      //   'react-native': reactNativePath,
      // },
    },
    externalsType: 'module', // Use ESM instead of commonjs
    /**
     * Configures output.
     * It's recommended to leave it as it is unless you know what you're doing.
     * By default, Webpack will emit files into the directory specified under `path`. In order for the
     * React Native app use them when bundling the `.ipa`/`.apk`, they need to be copied over with
     * `Repack.OutputPlugin`, which is configured by default inside `Repack.RepackPlugin`.
     */
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      path: path.join(dirname, 'build', 'host', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      uniqueName: 'mob_host',
    },
    /** Configures optimization of the built bundle. */
    optimization: {
      /** Enables minification based on values passed from React Native Community CLI or from fallback. */
      minimize,
      /** Configure minimizer to process the bundle. */
      chunkIds: 'named',
    },
    module: {
      rules: [
        ...Repack.getJsTransformRules(),
        ...Repack.getAssetTransformRules(),
      ],
    },
    plugins: [
      /**
       * Configure other required and additional plugins to make the bundle
       * work in React Native and provide good development experience with
       * sensible defaults.
       *
       * `Repack.RepackPlugin` provides some degree of customization, but if you
       * need more control, you can replace `Repack.RepackPlugin` with plugins
       * from `Repack.plugins`.
       */
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
        output: {
          assetsPath,
          bundleFilename,
          sourceMapFilename,
        },
      }),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'mob_host',
        filename: `mob_host.container.js.bundle`,

        exposes: {
          '.': './App',
        },
        remotes: defaultRemotes,
        dts: false,
        shared: getSharedDependencies({eager:true}, sharedDepsMobile),
      }),
      new rspack.IgnorePlugin({
        resourceRegExp: /^@react-native-masked-view/,
      }),
    ],
  };
};
