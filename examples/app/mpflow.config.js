const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs-extra');

class RewriteSubpackages {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('rewrite subpackages', async () => {
      const appJsonPath = path.resolve('./dist/app.json');
      const appJson = fs.readJsonSync(appJsonPath);

      if (appJson.isolatedSubpackages) {
        appJson.subpackages = appJson.subpackages || [];
        appJson.subpackages.push(...appJson.isolatedSubpackages);

        delete appJson.isolatedSubpackages;

        fs.writeJsonSync(appJsonPath, appJson);
        console.log('重写小程序分包信息 ...');
      }
    });
  }
}

const copyList = () => {
  const appJson = fs.readJsonSync(path.resolve('./src/app.json'));

  return appJson.isolatedSubpackages.map(({ root }) => {
    return {
      from: '**/*',
      context: path.resolve(__dirname, 'src', 'packages', root, 'dist'),
      to: root,
    };
  });
};

module.exports = {
  appId: 'wxeae77bf5cf0f0c02',
  app: 'src/app',
  compileType: 'miniprogram',
  plugins: ['@mpflow/plugin-babel', '@mpflow/plugin-css'],
  configureWebpackChain: (config) => {
    config.module
      .rule('wxss')
      .use('@mpflow/wxss-loader')
      .loader('@mpflow/wxss-loader')
      .end()
      .use('px2rpx-loader')
      .loader('px2rpx-loader')
      .tap((options) => {
        return {
          ...options,
          rpxUnit: 0.5,
        };
      });

    config.merge({
      resolve: {
        alias: {
          '@': path.resolve('src'),
        },
      },
      plugin: {
        copyPlugin: {
          plugin: CopyPlugin,
          args: [
            {
              patterns: copyList(),
            },
          ],
        },
        rewriteSubpackages: { plugin: RewriteSubpackages },
      },
    });
  },
  useExtendedLib: {
    weui: true,
  },
  settings: {
    urlCheck: false,
    es6: false,
    enhance: false,
    postcss: false,
    preloadBackgroundData: false,
    minified: true,
    newFeature: false,
    coverView: true,
    nodeModules: false,
    autoAudits: false,
    showShadowRootInWxmlPanel: true,
    scopeDataCheck: false,
    uglifyFileName: false,
    checkInvalidKey: true,
    checkSiteMap: true,
    uploadWithSourceMap: true,
    compileHotReLoad: false,
    babelSetting: {
      ignore: [],
      disablePlugins: [],
      outputPath: '',
    },
    useIsolateContext: true,
    useCompilerModule: false,
    userConfirmedUseCompilerModuleSwitch: false,
  },
};