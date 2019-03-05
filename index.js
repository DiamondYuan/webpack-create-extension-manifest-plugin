const fs = require("mz/fs");
const path = require("path");

const mkdir = async dirname => {
  //console.log(dirname);
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdir(path.dirname(dirname))) {
      fs.mkdir(dirname);
      return true;
    }
  }
};

class WebpackCreateExtensionManifestPlugin {
  constructor({ root = process.cwd(), key = "manifest", output }) {
    this.options = { root, key, output };
  }

  apply(compiler) {
    compiler.hooks.done.tapPromise(
      "WebpackCreateExtensionManifestPlugin",
      async () => {
        const { output, key, root } = this.options;
        const packageJson = JSON.parse(
          await fs.readFile(path.resolve(root, "package.json"), {
            encoding: "utf-8"
          })
        );
        const { name, version, description } = packageJson;
        let manifest = packageJson[key] || {};
        manifest = Object.assign(manifest, { name, version, description });
        mkdir(path.dirname(output));
        await fs.writeFile(output, JSON.stringify(manifest, null, 2));
      }
    );
  }
}

module.exports = WebpackCreateExtensionManifestPlugin;
