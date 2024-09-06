const { sources } = require("webpack");

class NodeJSPolyfill {
  constructor(options) {
    this.snippet = options.snippet || "";
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("NodeJSPolyfill", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "NodeJSPolyfill",
          stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        (assets) => {
          for (const assetName in assets) {
            console.log({ assetName });
            if (assetName.endsWith(".js")) {
              const originalSource = assets[assetName].source();
              const modifiedSource = `${this.snippet}\n${originalSource}`;
              assets[assetName] = new sources.RawSource(modifiedSource);
            }
          }
        }
      );
    });
  }
}

module.exports = NodeJSPolyfill;
